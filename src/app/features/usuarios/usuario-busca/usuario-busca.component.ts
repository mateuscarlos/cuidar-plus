import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

// Modelos
import { Setor } from '../models/setor.model';
import { Funcao } from '../models/funcao.model';
import { UserStatus } from '../models/user.model';

// Serviços
import { ApiUsuarioService } from '../services/api-usuario.service';

@Component({
  selector: 'app-usuario-busca',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './usuario-busca.component.html',
  styleUrls: ['./usuario-busca.component.scss']

  
})
export class UsuarioBuscaComponent implements OnInit, OnChanges {
  @Input() setores: Setor[] = [];
  @Input() statusOptions: { value: UserStatus; label: string; }[] = [];
  @Input() isLoading: boolean = false;
  @Output() filtrosChange = new EventEmitter<any>();
  @Output() limparFiltros = new EventEmitter<void>();
  
  buscaForm: FormGroup;
  funcoesFiltradas: Funcao[] = [];
  buscaAtiva: boolean = false;
  

  getSetorNome(): string {
    const setorId = this.buscaForm.get('setor')?.value;
    const setor = this.setores.find(s => s.id === setorId);
    return setor ? setor.nome : '';
  }

  getFuncaoNome(): string {
    const funcaoId = this.buscaForm.get('funcao')?.value;
    if (!funcaoId) return '';
    
    // Garantir que estamos comparando strings
    const funcaoIdStr = funcaoId.toString();
    console.log(`Buscando nome da função com ID: ${funcaoIdStr}`);
    console.log('Funções disponíveis:', this.funcoesFiltradas.map(f => `${f.nome} (ID: ${f.id})`));
    
    const funcao = this.funcoesFiltradas.find(f => f.id.toString() === funcaoIdStr);
    console.log('Função encontrada:', funcao);
    
    return funcao ? funcao.nome : 'Não encontrado';
  }

  getStatusNome(): string {
    const statusValue = this.buscaForm.get('status')?.value;
    if (!statusValue) return '';
    
    const statusOption = this.statusOptions.find(opt => opt.value === statusValue);
    return statusOption ? statusOption.label : statusValue;
  }
  
  // Controle de mudanças
  private searchTerms = new Subject<string>();
  
  constructor(
    private fb: FormBuilder,
    private apiUsuarioService: ApiUsuarioService
  ) {
    this.buscaForm = this.fb.group({
      nome: [''],
      email: [''],
      status: [''],
      setor: [''],
      funcao: ['']
    });
  }
  
  ngOnInit() {
    // Configurar o debounce para busca
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.aplicarFiltros();
    });
    
    // Observar mudanças nos campos de texto
    this.buscaForm.get('nome')?.valueChanges.subscribe(value => {
      this.searchTerms.next(value);
    });
    
    this.buscaForm.get('email')?.valueChanges.subscribe(value => {
      this.searchTerms.next(value);
    });
    
    // Observar mudança no setor para carregar funções
    this.buscaForm.get('setor')?.valueChanges.subscribe(setorId => {
      this.buscaForm.get('funcao')?.setValue('');
      
      if (setorId) {
        this.carregarFuncoesPorSetor(setorId);
      } else {
        this.funcoesFiltradas = [];
      }
      
      this.aplicarFiltros();
    });
    
    // Aplicar filtros imediatamente quando mudar o status ou a função
    this.buscaForm.get('status')?.valueChanges.subscribe(() => {
      this.aplicarFiltros();
    });
    
    this.buscaForm.get('funcao')?.valueChanges.subscribe(() => {
      this.aplicarFiltros();
    });
  }
  
  ngOnChanges(changes: SimpleChanges) {
    // Atualizar as funções se os setores mudarem
    if (changes['setores'] && !changes['setores'].firstChange) {
      const setorId = this.buscaForm.get('setor')?.value;
      if (setorId) {
        this.carregarFuncoesPorSetor(setorId);
      }
    }
  }
  
  /**
   * Verifica se há algum filtro aplicado
   */
  temFiltrosAtivos(): boolean {
    const values = this.buscaForm.value;
    return !!(values.nome || values.email || values.status || values.setor || values.funcao);
  }
  
  /**
   * Limpa todos os filtros
   */
  limparTodosFiltros() {
    this.buscaForm.reset({
      nome: '',
      email: '',
      status: '',
      setor: '',
      funcao: ''
    });
    
    this.funcoesFiltradas = [];
    this.buscaAtiva = false;
    this.limparFiltros.emit();
  }
  
  /**
   * Aplica os filtros e emite o evento
   */
  aplicarFiltros() {
    this.buscaAtiva = this.temFiltrosAtivos();
    
    // Coletar todos os valores do formulário
    const filtros = {
      nome: this.buscaForm.get('nome')?.value || '',
      email: this.buscaForm.get('email')?.value || '',
      status: this.buscaForm.get('status')?.value || '',
      setor: this.buscaForm.get('setor')?.value || '',
      funcao: this.buscaForm.get('funcao')?.value || ''
    };
    
    // Log para debug
    console.log('Emitindo filtros:', filtros);
    
    // Emitir o evento com os filtros
    this.filtrosChange.emit(filtros);
  }
  
  /**
   * Carrega as funções disponíveis para um setor específico
   */
  carregarFuncoesPorSetor(setorId: number | string) {
    const setorIdNumber = Number(setorId);
    console.log(`Carregando funções para setor ID: ${setorIdNumber}`);
    
    this.apiUsuarioService.listarFuncoesPorSetor(setorIdNumber)
      .subscribe({
        next: (funcoes) => {
          // Processar funções mantendo os tipos originais
          this.funcoesFiltradas = funcoes.map(funcao => ({
            ...funcao
            // Não converter o ID para string para manter compatibilidade com o tipo Funcao
          }));
          
          console.log(`${this.funcoesFiltradas.length} funções carregadas:`, 
            this.funcoesFiltradas.map(f => `${f.nome} (ID: ${f.id})`));
        },
        error: (err) => {
          console.error('Erro ao carregar funções por setor:', err);
          this.funcoesFiltradas = [];
        }
      });
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
    if (campo === 'setor') {
      this.buscaForm.get('funcao')?.setValue('');
      this.funcoesFiltradas = [];
    }
  }
}