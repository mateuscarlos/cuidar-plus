import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { PacienteService } from '../services/paciente.service';
import { ConvenioPlanoService } from '../services/convenio-plano.service';
import { NotificacaoService } from '../../../shared/services/notificacao.service';
import { StatusPaciente } from '../models/paciente.model';
import { AdvancedSearchComponent, SearchField, SearchResult } from '../../../shared/components/advanced-search/advanced-search.component';
import { DynamicPipePipe } from '../../../shared/pipes/dynamic-pipe.pipe';
import { DateFormatterService } from '../../../core/services/date-formatter.service';

@Component({
  selector: 'app-paciente-busca-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AdvancedSearchComponent,
    DynamicPipePipe
  ],
  template: `
    <div class="container-fluid py-4">
      <!-- Breadcrumb -->
      <nav aria-label="breadcrumb" class="mb-4">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a routerLink="/dashboard">Home</a></li>
          <li class="breadcrumb-item"><a routerLink="/pacientes">Pacientes</a></li>
          <li class="breadcrumb-item active" aria-current="page">Busca Avançada</li>
        </ol>
      </nav>
      
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h3 class="mb-0">
          <i class="bi bi-search me-2 text-primary"></i>Busca Avançada de Pacientes
        </h3>
        <button class="btn btn-primary" (click)="navegarParaCadastro()">
          <i class="bi bi-plus-circle me-2"></i>Novo Paciente
        </button>
      </div>
      
      <app-advanced-search
        [title]="'Filtros de Busca'"
        [fields]="camposBusca"
        [isLoading]="isLoading"
        [resultados]="pacientes"
        [colunas]="colunasPaciente"
        [totalItems]="totalPacientes"
        [currentPage]="paginaAtual"
        [pageSize]="10"
        (search)="buscarPacientes($event)"
        (clear)="limparBusca()"
        (action)="handleAction($event)"
        (select)="selecionarPaciente($event)"
        (pageChange)="mudarPagina($event)">
      </app-advanced-search>
    </div>
  `
})
export class PacienteBuscaPageComponent implements OnInit {
  camposBusca: SearchField[] = [
    {
      name: 'nome',
      label: 'Nome',
      type: 'text',
      placeholder: 'Buscar por nome',
      width: 3,
      icon: 'person'
    },
    {
      name: 'cpf',
      label: 'CPF',
      type: 'text',
      placeholder: 'Digite o CPF',
      width: 2,
      icon: 'card-text',
      pipe: 'cpf'
    },
    {
      name: 'id',
      label: 'ID/Matrícula',
      type: 'number',
      placeholder: 'Digite o ID',
      width: 2,
      icon: 'hash'
    },
    {
      name: 'dataNascimento',
      label: 'Data de Nascimento',
      type: 'date',
      width: 2,
      pipe: 'date',
      pipeArgs: ['dd/MM/yyyy']
    },
    {
      name: 'convenio',
      label: 'Convênio',
      type: 'select',
      width: 2,
      icon: 'hospital',
      options: [],
      optionLabel: 'nome',
      optionValue: 'id',
      formatFn: (value) => this.getConvenioNome(value)
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      width: 2,
      icon: 'tag',
      options: Object.values(StatusPaciente)
    }
  ];
  
  colunasPaciente = [
    { header: 'Nome', field: 'nome_completo' },
    { header: 'CPF', field: 'cpf', pipe: 'cpf' },
    { 
      header: 'Data Nascimento', 
      field: 'data_nascimento', 
      formatFn: (value: any, item: any) => {
        const date = value || item.dataNascimento || item.data_nascimento || item.dt_nascimento;
        if (!date) return 'N/A';
        return this.dateFormatter.toDisplayDateOnly(date);
      }
    },
    { header: 'Convênio', field: 'convenio_id', formatFn: (value: number) => this.getConvenioNome(value) },
    { header: 'Status', field: 'status', type: 'status' }
  ];
  
  pacientes: any[] = [];
  isLoading = false;
  totalPacientes = 0;
  convenios: any[] = [];
  paginaAtual = 1;
  ultimaConsulta: SearchResult | null = null;

  constructor(
    private pacienteService: PacienteService,
    private convenioService: ConvenioPlanoService,
    private notificacaoService: NotificacaoService,
    private dateFormatter: DateFormatterService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarConvenios();
  }

  carregarConvenios(): void {
    this.isLoading = true;
    this.convenioService.listarConvenios().subscribe({
      next: (response) => {
        this.convenios = response.filter(c => c.ativo);
        const convenioField = this.camposBusca.find(f => f.name === 'convenio');
        if (convenioField) {
          convenioField.options = this.convenios;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar convênios', error);
        this.notificacaoService.mostrarErro('Não foi possível carregar a lista de convênios.');
        this.isLoading = false;
      }
    });
  }

  buscarPacientes(filtros: SearchResult): void {
    this.ultimaConsulta = filtros;
    this.isLoading = true;
    
    const filtrosComPaginacao = {
      ...filtros,
      page: this.paginaAtual,
      limit: 10
    };
    
    this.pacienteService.buscarPacientes(filtrosComPaginacao).subscribe({
      next: (response) => {
        console.log('Resposta da API de busca:', response);
        
        if (Array.isArray(response)) {
          this.pacientes = response;
          this.totalPacientes = response.length;
        } else if (response && response.items && Array.isArray(response.items)) {
          this.pacientes = response.items;
          this.totalPacientes = response.total || response.items.length;
          this.paginaAtual = response.page || this.paginaAtual;
        } else if (response && typeof response === 'object') {
          if (response.id) {
            this.pacientes = [response];
            this.totalPacientes = 1;
          } else {
            const possibleArrays = Object.values(response).filter(val => Array.isArray(val));
            if (possibleArrays.length > 0) {
              this.pacientes = possibleArrays[0] as any[];
              this.totalPacientes = this.pacientes.length;
            } else {
              const objKeys = Object.keys(response);
              if (objKeys.length > 0 && !isNaN(Number(objKeys[0]))) {
                this.pacientes = Object.values(response);
                this.totalPacientes = this.pacientes.length;
              } else {
                console.error('Formato de resposta não reconhecido:', response);
                this.notificacaoService.mostrarErro('Formato de resposta inesperado ao buscar pacientes');
                this.pacientes = [];
                this.totalPacientes = 0;
              }
            }
          }
        } else {
          console.error('Resposta inválida da API:', response);
          this.notificacaoService.mostrarErro('Resposta inválida ao buscar pacientes');
          this.pacientes = [];
          this.totalPacientes = 0;
        }
        
        this.pacientes = this.pacientes.map(paciente => {
          if (!paciente.data_nascimento && 
             (paciente.dataNascimento || paciente.dt_nascimento || paciente.nascimento)) {
            paciente.data_nascimento = paciente.dataNascimento || 
                                      paciente.dt_nascimento || 
                                      paciente.nascimento;
          }
          return paciente;
        });
        
        console.log('Pacientes processados:', this.pacientes);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao buscar pacientes:', error);
        this.notificacaoService.mostrarErro('Não foi possível realizar a busca de pacientes.');
        this.pacientes = [];
        this.totalPacientes = 0;
        this.isLoading = false;
      }
    });
  }

  limparBusca(): void {
    this.pacientes = [];
    this.totalPacientes = 0;
    this.paginaAtual = 1;
  }
  
  mudarPagina(pagina: number): void {
    this.paginaAtual = pagina;
    if (this.ultimaConsulta) {
      this.buscarPacientes(this.ultimaConsulta);
    }
  }

  handleAction(event: {action: string, item: any}): void {
    if (event.action === 'view') {
      this.visualizarPaciente(event.item);
    } else if (event.action === 'edit') {
      this.editarPaciente(event.item);
    }
  }

  visualizarPaciente(paciente: any): void {
    if (paciente?.id) {
      this.router.navigate(['/pacientes/visualizar', paciente.id]);
    }
  }

  editarPaciente(paciente: any): void {
    if (paciente?.id) {
      this.router.navigate(['/pacientes/editar', paciente.id]);
    }
  }

  selecionarPaciente(paciente: any): void {
    this.visualizarPaciente(paciente);
  }
  
  navegarParaCadastro(): void {
    this.router.navigate(['/pacientes/criar']);
  }

  getConvenioNome(id: number): string {
    if (!id) return 'N/A';
    const convenio = this.convenios.find(c => c.id === id);
    return convenio ? convenio.nome : 'Convênio não encontrado';
  }
}