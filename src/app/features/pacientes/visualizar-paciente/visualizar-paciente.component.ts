import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormattedDateComponent } from '../../../shared/components/formatted-date/formatted-date.component';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';
import { BuscaPacienteComponent } from '../busca-paciente/busca-paciente.component';
import { Paciente, StatusPaciente } from '../models/paciente.model';
import { Plano } from '../models/plano.model';
import { Convenio } from '../models/convenio.model';
import { Endereco } from '../models/endereco.model';
import { ResultadoBusca } from '../models/busca-paciente.model';
import { PacienteService } from '../services/paciente.service';
import { ConvenioPlanoService } from '../services/convenio-plano.service';
import { StatusStyleService } from '../../../core/services/status-style.service';
import { NotificacaoService } from '../../../shared/services/notificacao.service';
import { InfoCardComponent } from '../../../shared/components/info-card/info-card.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { PacienteAvatarComponent } from '../../../shared/components/paciente-avatar/paciente-avatar.component';
import { finalize, catchError, tap, of } from 'rxjs';
import { ResultadoBusca as BuscaPacienteResultadoBusca } from '../models/busca-paciente.model';

@Component({
  selector: 'app-visualizar-paciente',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    BuscaPacienteComponent,
    InfoCardComponent,
    StatusBadgeComponent,
    PacienteAvatarComponent,
    DateFormatPipe,
    FormattedDateComponent
  ],
  providers: [
    DateFormatPipe
  ],
  templateUrl: './visualizar-paciente.component.html',
  styleUrls: ['./visualizar-paciente.component.scss']
})
export class VisualizarPacienteComponent implements OnInit {
  // Dados principais
  paciente: Paciente | null = null;
  convenio: string = '';
  plano: string = '';
  
  // Estados da UI
  isLoading: boolean = false;
  error: string | null = null;
  modoVisualizacao: boolean = false;
  resultadosBusca: Paciente[] = [];
  
  // Referência para enum de status
  statusPacienteEnum = StatusPaciente;
  
  constructor(
    private pacienteService: PacienteService,
    private convenioPlanoService: ConvenioPlanoService,
    private notificacaoService: NotificacaoService,
    private router: Router,
    private route: ActivatedRoute,
    public statusStyle: StatusStyleService
  ) {}

  ngOnInit(): void {
    // Resetamos o estado inicial antes de qualquer carregamento
    this.resetComponent();
    
    // Verificar os parâmetros de rota
    this.route.params.subscribe(params => {
      console.log('Params recebidos:', params);
      if (params['id']) {
        console.log('Carregando paciente com ID:', params['id']);
        this.carregarPacientePorId(params['id']);
      } else {
        // Verificar parâmetros de consulta (se não houver parâmetros de rota)
        this.route.queryParams.subscribe(queryParams => {
          if (queryParams['pacienteId']) {
            this.carregarPacientePorId(queryParams['pacienteId']);
          } else {
            // Se não há parâmetros, mostramos a tela de busca
            this.isLoading = false;
            this.modoVisualizacao = false;
          }
        });
      }
    });
  }
  
  /**
   * Reseta o componente para o estado inicial
   */
  resetComponent(): void {
    this.paciente = null;
    this.convenio = '';
    this.plano = '';
    this.error = null;
    this.resultadosBusca = [];
    this.modoVisualizacao = false;
  }
  
  /**
   * Carrega os dados de um paciente pelo ID
   */
  carregarPacientePorId(id: string): void {
    this.isLoading = true;
    this.pacienteService.obterPacientePorId(id).subscribe({
      next: (paciente) => {
        this.paciente = paciente;
        this.modoVisualizacao = true;
        if (paciente) {
          this.carregarInformacoesConvenio(paciente);
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar dados do paciente:', err);
        this.notificacaoService.mostrarErro('Erro ao carregar paciente. Tente novamente.');
        this.isLoading = false;
        this.error = 'Não foi possível carregar os dados do paciente';
      }
    });
  }
  
  /**
   * Carrega informações de convênio e plano do paciente
   */
  carregarInformacoesConvenio(paciente: Paciente): void {
    // Buscar informações do convênio
    this.convenioPlanoService.listarConvenios().subscribe({
      next: (convenios: Convenio[]) => {
        const convenio = convenios.find(c => String(c.id) === String(paciente.convenio_id));
        this.convenio = convenio ? convenio.nome : 'Não informado';
        
        // Buscar informações do plano se houver convênio e plano
        if (paciente.plano_id && paciente.convenio_id) {
          const convenioId = typeof paciente.convenio_id === 'string' 
            ? parseInt(paciente.convenio_id, 10) 
            : paciente.convenio_id;
          
          this.convenioPlanoService.listarPlanosPorConvenio(convenioId).subscribe({
            next: (planos: Plano[]) => {
              const plano = planos.find(p => String(p.id) === String(paciente.plano_id));
              this.plano = plano ? plano.nome : 'Não informado';
            },
            error: (err) => {
              console.error('Erro ao carregar planos:', err);
              this.plano = 'Não foi possível carregar';
            }
          });
        }
      },
      error: (err) => {
        console.error('Erro ao carregar convênios:', err);
        this.convenio = 'Não foi possível carregar';
      }
    });
  }
  
  /**
   * Processa o resultado da busca de pacientes
   */
  buscarPaciente(resultado: ResultadoBusca): void {
    this.isLoading = true;
    this.error = null;
    this.modoVisualizacao = false;
    
    this.pacienteService.buscarPacientes(resultado as any)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (pacientes) => {
          this.resultadosBusca = pacientes;
          
          if (pacientes.length === 0) {
            this.error = 'Nenhum paciente encontrado com os critérios informados.';
          } else if (pacientes.length === 1) {
            // Selecionar automaticamente se houver apenas um resultado
            this.selecionarPaciente(pacientes[0]);
          }
        },
        error: (err) => {
          this.error = 'Erro ao buscar pacientes';
          this.resultadosBusca = [];
          this.notificacaoService.mostrarErro('Erro ao buscar pacientes.');
          console.error('Erro na busca:', err);
        }
      });
  }
  
  /**
   * Seleciona um paciente da lista de resultados
   */
  selecionarPaciente(paciente: Paciente): void {
    this.carregarPacientePorId(String(paciente.id));
  }
  
  /**
   * Navega para a página de edição do paciente
   */
  irParaEdicao(): void {
    if (this.paciente && this.paciente.id) {
      this.router.navigate(['/pacientes/editar', this.paciente.id]);
    } else {
      this.notificacaoService.mostrarErro('Não é possível editar: paciente não encontrado ou sem ID.');
    }
  }
  
  /**
   * Navega para a página de acompanhamento do paciente
   */
  irParaAcompanhamento(): void {
    if (this.paciente && this.paciente.id) {
      this.router.navigate(['/pacientes/acompanhamento'], {
        queryParams: { pacienteId: this.paciente.id }
      });
    }
  }
  
  /**
   * Navega de volta para a tela de busca
   */
  voltarParaBusca(): void {
    this.router.navigate(['/pacientes/busca']);
}

  /**
   * Navega de volta para a lista de pacientes
   */
  voltarParaLista(): void {
    this.router.navigate(['/pacientes/lista']);
  }
  
  /**
   * Formata um endereço para exibição
   */
  formatarEndereco(endereco: Endereco): string {
    if (!endereco) {
      return 'Não informado';
    }

    const logradouro = endereco.logradouro || 'Logradouro não informado';
    
    let enderecoCompleto = `${logradouro}, ${endereco.numero || 'S/N'}`;

    if (endereco.complemento) {
      enderecoCompleto += ` - ${endereco.complemento}`;
    }
    
    // Cidade e Estado podem estar em campos diferentes dependendo da fonte
    const cidade = endereco.cidade || endereco.localidade || 'Cidade não informada';
    const estado = endereco.estado || endereco.uf || 'UF não informado';
    const bairro = endereco.bairro || 'Bairro não informado';
    const cep = this.formatarCep(endereco.cep || '');

    enderecoCompleto += ` - ${bairro}, ${cidade}/${estado} - ${cep}`;

    return enderecoCompleto;
  }
  
  /**
   * Formata um CEP para exibição
   */
  formatarCep(cep: string): string {
    if (!cep) return 'Não informado';
    
    // Remove caracteres não numéricos
    const numeros = cep.replace(/\D/g, '');
    
    // Aplica a máscara de CEP: 00000-000
    if (numeros.length === 8) {
      return `${numeros.substring(0, 5)}-${numeros.substring(5)}`;
    }
    
    return cep;
  }
  
  /**
   * Formata uma data para exibição
   */
  formatarData(data: string | undefined): string {
    if (!data) {
      return 'Não informado';
    }
    
    try {
      // Remove informações de timezone se presentes
      const cleanDate = data.toString().split('T')[0];
      const dataObj = new Date(cleanDate);
      
      // Verifica se a data é válida
      if (isNaN(dataObj.getTime())) {
        return 'Data inválida';
      }
      
      // Formata para o padrão brasileiro
      return dataObj.toLocaleDateString('pt-BR');
    } catch (e) {
      return 'Data inválida';
    }
  }

  /**
   * Método adaptador para lidar com o evento resultadoBusca do componente app-busca-paciente
   * @param resultado O resultado emitido pelo componente de busca
   */
  buscarPacientePorResultado(resultado: any): void {
    // Adaptar o resultado para o formato esperado pelo método buscarPaciente
    // ou lidar diretamente com o resultado aqui
    if (resultado) {
      // Se o resultado já estiver no formato esperado pelo buscarPaciente
      this.buscarPaciente(resultado);
      // Caso contrário, adapte o formato conforme necessário:
      // const adaptedResult = { tipo: resultado.tipoBusca, valor: resultado.valorBusca };
      // this.buscarPaciente(adaptedResult);
    }
  }
}