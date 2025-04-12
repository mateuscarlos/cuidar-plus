import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';
import { CpfMaskPipe } from '../../pipes/cpf-mask.pipe';
import { DynamicPipePipe } from '../../pipes/dynamic-pipe.pipe';

export interface SearchField {
  name: string;          // Nome interno do campo (usado no formControl)
  label: string;         // Rótulo exibido para o usuário
  type: 'text' | 'select' | 'date' | 'number'; // Tipo de campo
  placeholder?: string;  // Placeholder (opcional)
  width?: number;        // Largura em colunas do grid (1-12)
  options?: any[];       // Opções para select
  optionLabel?: string;  // Propriedade para exibir nas opções (para objetos)
  optionValue?: string;  // Propriedade para o valor das opções (para objetos)
  icon?: string;         // Ícone do Bootstrap
  formatFn?: (value: any) => string; // Função para formatar o valor exibido no badge
  pipe?: any;            // Pipe para formatar o valor exibido
  pipeArgs?: any[];      // Argumentos para o pipe
}

export interface SearchResult {
  [key: string]: any;    // Campo genérico para receber valores de busca
}

@Component({
  selector: 'app-advanced-search',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    StatusBadgeComponent,
    CpfMaskPipe,
    DynamicPipePipe
  ],
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.scss'],
  template: `
    <!-- ... outras partes do template ... -->
    
    <!-- Debug -->
    <div *ngIf="resultados && resultados.length > 0" class="mt-2">
      <p class="text-success">{{resultados.length}} resultados encontrados</p>
    </div>
    
    <!-- Tabela de Resultados -->
    <div class="table-responsive mt-3" *ngIf="resultados && resultados.length > 0">
      <table class="table table-hover align-middle">
        <thead>
          <tr>
            <th *ngFor="let col of colunas">{{col.header}}</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let item of resultados" (click)="onSelectItem(item)" class="cursor-pointer">
            <td *ngFor="let col of colunas">
              <!-- Renderizar o valor conforme o tipo de coluna -->
              <ng-container *ngIf="col.type === 'status'">
                <span class="badge" [ngClass]="getStatusClass(getItemValue(item, col))">
                  {{ getItemValue(item, col) }}
                </span>
              </ng-container>
              <ng-container *ngIf="col.pipe">
                {{ getItemValue(item, col) | dynamicPipe:col.pipe:col.pipeArgs }}
              </ng-container>
              <ng-container *ngIf="!col.type && !col.pipe">
                {{ col.formatFn ? col.formatFn(getItemValue(item, col)) : getItemValue(item, col) }}
              </ng-container>
            </td>
            <td class="text-end">
              <button class="btn btn-sm btn-outline-primary me-2" (click)="onAction('view', item); $event.stopPropagation()">
                <i class="bi bi-eye"></i>
              </button>
              <button class="btn btn-sm btn-outline-secondary" (click)="onAction('edit', item); $event.stopPropagation()">
                <i class="bi bi-pencil"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Mensagem de nenhum resultado -->
    <div *ngIf="!isLoading && (!resultados || resultados.length === 0)" class="alert alert-info mt-3">
      <i class="bi bi-info-circle me-2"></i>
      Nenhum resultado encontrado para os critérios de busca.
    </div>
    
    <!-- ... resto do template ... -->
  `
})
export class AdvancedSearchComponent implements OnInit, OnDestroy {
  @Input() title: string = 'Busca Avançada';
  @Input() fields: SearchField[] = [];
  @Input() isLoading: boolean = false;
  @Input() resultados: any[] = [];
  @Input() colunas: {header: string, field: string, type?: string, pipe?: any, pipeArgs?: any[], formatFn?: (value: any) => string}[] = [];
  @Input() pageSize: number = 10;
  @Input() totalItems: number = 0;
  @Input() showActions: boolean = true;
  @Input() actionButtons: {icon: string, label: string, action: string, class: string}[] = [
    { icon: 'eye', label: 'Visualizar', action: 'view', class: 'btn-outline-primary' },
    { icon: 'pencil', label: 'Editar', action: 'edit', class: 'btn-outline-secondary' }
  ];
  @Input() currentPage: number = 1;
  
  @Output() search = new EventEmitter<SearchResult>();
  @Output() clear = new EventEmitter<void>();
  @Output() action = new EventEmitter<{action: string, item: any}>();
  @Output() select = new EventEmitter<any>();
  @Output() pageChange = new EventEmitter<number>();
  
  searchForm: FormGroup;
  buscaAtiva: boolean = false;
  totalPages: number = 0;
  
  private searchTerms = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder) {
    this.searchForm = this.fb.group({});
  }

  ngOnInit(): void {
    // Criar controles do formulário baseados nos campos recebidos
    this.fields.forEach(field => {
      this.searchForm.addControl(field.name, this.fb.control(''));
      
      // Observar mudanças para cada campo
      this.searchForm.get(field.name)?.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe(value => {
          if (field.type === 'text' || field.type === 'number') {
            this.searchTerms.next(value);
          } else {
            // Para selects e datas, aplicamos o filtro imediatamente
            this.realizarBusca();
          }
        });
    });
    
    // Configurar o debounce para busca em campos de texto
    this.searchTerms.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.realizarBusca();
    });
    
    // Calcular total de páginas
    this.updatePagination();
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  realizarBusca(): void {
    this.buscaAtiva = this.temFiltrosAtivos();
    if (!this.buscaAtiva) {
      return;
    }

    const filtros: SearchResult = {};
    
    // Coletar valores de todos os campos
    this.fields.forEach(field => {
      const value = this.searchForm.get(field.name)?.value;
      if (value) {
        filtros[field.name] = value;
      }
    });
    
    // Adicionar página atual
    filtros['page'] = this.currentPage;
    filtros['pageSize'] = this.pageSize;
    
    this.search.emit(filtros);
  }
  
  updatePagination(): void {
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
  }
  
  temFiltrosAtivos(): boolean {
    for (const field of this.fields) {
      if (this.temFiltro(field.name)) {
        return true;
      }
    }
    return false;
  }
  
  temFiltro(campo: string): boolean {
    return !!this.searchForm.get(campo)?.value;
  }
  
  limparFiltro(campo: string): void {
    this.searchForm.get(campo)?.setValue('');
    this.realizarBusca();
  }
  
  limparTodosFiltros(): void {
    const resetValues: any = {};
    this.fields.forEach(field => {
      resetValues[field.name] = '';
    });
    
    this.searchForm.reset(resetValues);
    this.buscaAtiva = false;
    this.clear.emit();
  }
  
  emitirAcao(acao: string, item: any, event: Event): void {
    event.stopPropagation();
    this.action.emit({ action: acao, item });
  }
  
  selecionarItem(item: any): void {
    this.select.emit(item);
  }
  
  proximaPagina(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.pageChange.emit(this.currentPage);
      this.realizarBusca();
    }
  }
  
  paginaAnterior(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.pageChange.emit(this.currentPage);
      this.realizarBusca();
    }
  }
  
  getFieldById(id: string): SearchField | undefined {
    return this.fields.find(field => field.name === id);
  }
  
  getFormattedValue(field: SearchField, value: any): string {
    if (!value) return '';
    
    if (field.formatFn) {
      return field.formatFn(value);
    }
    
    if (field.type === 'select' && field.options) {
      const option = field.options.find(opt => {
        if (typeof opt === 'object') {
          return opt[field.optionValue || 'id'] === value;
        }
        return opt === value;
      });
      
      if (option) {
        if (typeof option === 'object') {
          return option[field.optionLabel || 'name'];
        }
        return String(option);
      }
    }
    
    return String(value);
  }

  calculatePaginationStart(): number {
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  calculatePaginationEnd(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalItems);
  }
}