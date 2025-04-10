import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, takeUntil } from 'rxjs/operators';

// Modelos
import { Paciente, ResultadoBusca, StatusPaciente } from '../models/paciente.model';
import { Convenio } from '../models/convenio.model';

// Serviços
import { ConvenioPlanoService } from '../services/convenio-plano.service';

// Pipes
import { CpfMaskPipe } from '../../../shared/pipes/cpf-mask.pipe';

@Component({
  selector: 'app-paciente-busca-avancada',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CpfMaskPipe
  ],
  templateUrl: './paciente-busca-avancada.component.html',
  styleUrls: ['./paciente-busca-avancada.component.scss']
})
export class PacienteBuscaAvancadaComponent implements OnInit, OnDestroy {
  @Input() isLoading: boolean = false;
  @Output() filtrosChange = new EventEmitter<ResultadoBusca>();
  @Output() limparFiltros = new EventEmitter<void>();
  @Output() filtrarEvent = new EventEmitter<ResultadoBusca>();
  
  buscaForm: FormGroup;
  buscaAtiva: boolean = false;
  
  // Lista de convênios para o dropdown
  convenios: Convenio[] = [];
  carregandoConvenios: boolean = false;
  
  // Lista de status de pacientes
  statusPaciente = Object.values(StatusPaciente);
  
  // Controle de mudanças e limpeza
  private searchTerms = new Subject<string>();
  private destroy$ = new Subject<void>();

  getConvenioNomeById(id: string | number): string {
    if (!id) return 'Não definido';
    
    const convenioId = typeof id === 'string' ? parseInt(id) : id;
    const convenio = this.convenios.find(c => c.id === convenioId);
    
    return convenio ? convenio.nome : 'Convênio não encontrado';
  }
  
  constructor(
    private fb: FormBuilder,
    private convenioPlanoService: ConvenioPlanoService
  ) {
    this.buscaForm = this.fb.group({
      nome: [''],
      cpf: [''],
      id: [''],
      dataNascimento: [''],
      convenio: [''],
      status: ['']
    });
  }
  
  ngOnInit() {
    // Configurar o debounce para busca
    this.searchTerms.pipe(
      debounceTime(800),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.aplicarFiltros();
    });
    
    // Observar mudanças nos campos de texto
    this.buscaForm.get('nome')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.searchTerms.next(value);
      });
    
    this.buscaForm.get('cpf')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.searchTerms.next(value);
      });
    
    this.buscaForm.get('id')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.searchTerms.next(value);
      });
    
    // Aplicar filtros imediatamente quando mudar campos de seleção
    this.buscaForm.get('convenio')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.aplicarFiltros();
      });
    
    this.buscaForm.get('dataNascimento')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.aplicarFiltros();
      });
    
    this.buscaForm.get('status')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.aplicarFiltros();
      });
    
    // Carregar a lista de convênios ao inicializar
    this.carregarConvenios();
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  /**
   * Carrega a lista de convênios do banco de dados
   */
  carregarConvenios() {
    this.carregandoConvenios = true;
    
    this.convenioPlanoService.listarConvenios()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.carregandoConvenios = false)
      )
      .subscribe({
        next: (convenios) => {
          this.convenios = convenios.filter(conv => conv.ativo);
          console.log('Convênios carregados:', this.convenios.length);
        },
        error: (erro) => {
          console.error('Erro ao carregar convênios:', erro);
        }
      });
  }
  
  /**
   * Verifica se há algum filtro aplicado
   */
  temFiltrosAtivos(): boolean {
    const values = this.buscaForm.value;
    return !!(values.nome || values.cpf || values.id || values.dataNascimento || values.convenio || values.status);
  }
  
  /**
   * Limpa todos os filtros
   */
  limparTodosFiltros() {
    this.buscaForm.reset({
      nome: '',
      cpf: '',
      id: '',
      dataNascimento: '',
      convenio: '',
      status: ''
    });
    
    this.buscaAtiva = false;
    this.limparFiltros.emit();
  }
  
  /**
   * Aplica os filtros e emite o evento
   */
  aplicarFiltros() {
    this.buscaAtiva = this.temFiltrosAtivos();
    
    // Coletar todos os valores do formulário
    const filtros: ResultadoBusca = {
      nome: this.buscaForm.get('nome')?.value || '',
      cpf: this.buscaForm.get('cpf')?.value || '',
      status: this.buscaForm.get('status')?.value || '',
      convenio: this.buscaForm.get('convenio')?.value || '',
      dataNascimento: this.buscaForm.get('dataNascimento')?.value || ''
    };
    
    // Adicionar o ID apenas se estiver preenchido
    const id = this.buscaForm.get('id')?.value;
    if (id) {
      filtros.id = Number(id);
    }
    
    // Log para debug
    console.log('Emitindo filtros de pacientes:', filtros);
    
    // Emitir o evento com os filtros
    this.filtrosChange.emit(filtros);
  }
  
  /**
   * Verifica se um campo específico tem filtro aplicado
   */
  temFiltro(campo: string): boolean {
    return !!this.buscaForm.get(campo)?.value;
  }
  
  /**
   * Limpa um filtro específico
   */
  limparFiltro(campo: string) {
    this.buscaForm.get(campo)?.setValue('');
  }
  
  /**
   * Verifica se um convênio está selecionado
   */
  isConvenioSelecionado(convenioId: number): boolean {
    return this.buscaForm.get('convenio')?.value === convenioId.toString();
  }
  
  /**
   * Formata o nome do convênio para exibição
   */
  formatarNomeConvenio(convenio: Convenio): string {
    if (!convenio.ativo) {
      return `${convenio.nome} (Inativo)`;
    }
    return convenio.nome;
  }
}
