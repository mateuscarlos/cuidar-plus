import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';

// Modelos
import { Paciente, ResultadoBusca, StatusPaciente } from '../models/paciente.model';
import { Convenio } from '../models/convenio.model';

// Serviços
import { ConvenioPlanoService } from '../services/convenio-plano.service';
import { PacienteService } from '../services/paciente.service';

// Pipes
import { CpfMaskPipe } from '../../../shared/pipes/cpf-mask.pipe';
import { NotificacaoService } from '../../../shared/services/notificacao.service';

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
  @Output() pacienteSelecionado = new EventEmitter<Paciente>();
  
  buscaForm: FormGroup;
  buscaAtiva: boolean = false;
  resultadosBusca: Paciente[] = [];
  
  // Lista de convênios para o dropdown
  convenios: Convenio[] = [];
  carregandoConvenios: boolean = false;
  
  // Lista de status de pacientes
  statusPaciente = Object.values(StatusPaciente);
  
  // Controle de mudanças e limpeza
  private searchTerms = new Subject<string>();
  private destroy$ = new Subject<void>();
  
  // Paginação
  totalPacientes: number = 0;
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;

  constructor(
    private fb: FormBuilder,
    private convenioPlanoService: ConvenioPlanoService,
    private pacienteService: PacienteService,
    private notificacaoService: NotificacaoService,
    private router: Router // Adicione o router aqui
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
  
  calculatePaginationStart(currentPage: number, pageSize: number): number {
    return (currentPage - 1) * pageSize + 1;
  }

  calculatePaginationEnd(currentPage: number, pageSize: number, totalPacientes: number): number {
    return Math.min(currentPage * pageSize, totalPacientes);
  }

  ngOnInit() {
    // Configurar o debounce para busca com um tempo maior
    this.searchTerms.pipe(
      debounceTime(800),  // Aumentado para 800ms conforme recomendação
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.realizarBusca();
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
        this.realizarBusca();
      });
    
    this.buscaForm.get('dataNascimento')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.realizarBusca();
      });
    
    this.buscaForm.get('status')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.realizarBusca();
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
          this.notificacaoService.mostrarErro('Erro ao carregar convênios. Tente novamente.');
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
    this.resultadosBusca = [];
    this.limparFiltros.emit();
  }
  
  /**
   * Realiza a busca de pacientes com os filtros aplicados
   */
  realizarBusca() {
    this.buscaAtiva = this.temFiltrosAtivos();
    if (!this.buscaAtiva) {
      this.resultadosBusca = [];
      return;
    }
    
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
    
    this.isLoading = true;
    
    // Log para debug
    console.log('Buscando pacientes com filtros:', filtros);
    
    // Realizar a busca no serviço
    this.pacienteService.buscarPacientes(filtros)
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (pacientes) => {
          this.resultadosBusca = pacientes;
          this.totalPacientes = pacientes.length;
          this.totalPages = Math.ceil(this.totalPacientes / this.pageSize);
          
          // Aplicar paginação
          this.aplicarPaginacao();
          
          // Emitir o evento com os filtros
          this.filtrosChange.emit(filtros);
        },
        error: (erro) => {
          console.error('Erro ao buscar pacientes:', erro);
          this.notificacaoService.mostrarErro('Erro ao buscar pacientes. Tente novamente.');
          this.resultadosBusca = [];
        }
      });
  }
  
  /**
   * Aplica a paginação aos resultados
   */
  aplicarPaginacao() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.resultadosBusca = this.resultadosBusca.slice(startIndex, startIndex + this.pageSize);
  }
  
  /**
   * Navega para a próxima página
   */
  proximaPagina() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.aplicarPaginacao();
    }
  }
  
  /**
   * Navega para a página anterior
   */
  paginaAnterior() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.aplicarPaginacao();
    }
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
    this.realizarBusca();
  }
  
  /**
   * Seleciona um paciente dos resultados
   */
  selecionarPaciente(paciente: Paciente) {
    this.pacienteSelecionado.emit(paciente);
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
  
  /**
   * Obtém o nome do convênio pelo ID
   */
  getConvenioNomeById(id: string | number): string {
    if (!id) return 'Não definido';
    
    const convenioId = typeof id === 'string' ? parseInt(id) : id;
    const convenio = this.convenios.find(c => c.id === convenioId);
    
    return convenio ? convenio.nome : 'Convênio não encontrado';
  }
  
  /**
   * Navega para a visualização detalhada do paciente selecionado
   */
  visualizarPaciente(paciente: Paciente) {
    if (paciente && paciente.id) {
      console.log('Navegando para visualizar paciente:', paciente.id);
      this.router.navigate(['/pacientes/visualizar', paciente.id]);
    } else {
      this.notificacaoService.mostrarErro('Não foi possível visualizar este paciente. ID inválido.');
    }
  }
}
