import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PacienteService } from '../services/paciente.service';
import { ConvenioPlanoService } from '../services/convenio-plano.service';
import { NotificacaoService } from '../../../shared/services/notificacao.service';
import { StatusPaciente } from '../models/paciente.model';
import { AdvancedSearchComponent, SearchField, SearchResult } from '../../../shared/components/advanced-search/advanced-search.component';
import { DynamicPipePipe } from '../../../shared/pipes/dynamic-pipe.pipe';

@Component({
  selector: 'app-paciente-busca-page',
  standalone: true,
  imports: [
    CommonModule,
    AdvancedSearchComponent,
    DynamicPipePipe
  ],
  template: `
    <div class="container-fluid p-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h3 class="mb-0">
          <i class="bi bi-search me-2 text-primary"></i>Busca Avançada de Pacientes
        </h3>
        <button class="btn btn-primary" (click)="navegarParaCadastro()">
          <i class="bi bi-plus-circle me-2"></i>Novo Paciente
        </button>
      </div>
      
      <!-- Debug Info -->
      <div *ngIf="pacientes?.length" class="alert alert-info">
        {{ pacientes.length }} pacientes encontrados
      </div>
      
      <app-advanced-search
        [title]="'Filtros de Busca'"
        [fields]="camposBusca"
        [isLoading]="isLoading"
        [resultados]="pacientes"
        [colunas]="colunasPaciente"
        [totalItems]="totalPacientes"
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
    { header: 'Data Nascimento', field: 'data_nascimento', pipe: 'date', pipeArgs: ['dd/MM/yyyy'] },
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
        // Atualizar a lista de opções do campo convênio
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
    this.ultimaConsulta = filtros; // Guarda a última consulta
    this.isLoading = true;
    
    // Adicionar paginação
    const filtrosComPaginacao = {
      ...filtros,
      page: this.paginaAtual,
      limit: 10
    };
    
    this.pacienteService.buscarPacientes(filtrosComPaginacao).subscribe({
      next: (response) => {
        console.log('Resposta da API de busca:', response); // Log para debug
        
        // Tratamento para diferentes formatos de resposta
        if (Array.isArray(response)) {
          // Caso 1: API retorna um array diretamente
          this.pacientes = response;
          this.totalPacientes = response.length;
        } else if (response && response.items && Array.isArray(response.items)) {
          // Caso 2: API retorna objeto com propriedade items (array)
          this.pacientes = response.items;
          this.totalPacientes = response.total || response.items.length;
          this.paginaAtual = response.page || this.paginaAtual;
        } else if (response && typeof response === 'object') {
          // Caso 3: API retorna outro formato de objeto
          // Verificar se é um único objeto ou uma coleção de objetos
          if (response.id) {
            // É um único paciente
            this.pacientes = [response];
            this.totalPacientes = 1;
          } else {
            // Tentativa de extrair valores relevantes do objeto
            const possibleArrays = Object.values(response).filter(val => Array.isArray(val));
            if (possibleArrays.length > 0) {
              // Usar o primeiro array encontrado
              this.pacientes = possibleArrays[0] as any[];
              this.totalPacientes = this.pacientes.length;
            } else {
              // Último recurso: tratar como array de propriedades
              const objKeys = Object.keys(response);
              if (objKeys.length > 0 && !isNaN(Number(objKeys[0]))) {
                // Parece ser um objeto com índices numéricos
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
        
        console.log('Pacientes processados:', this.pacientes); // Log para debug
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
    // Reexecuta a busca com a nova página
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