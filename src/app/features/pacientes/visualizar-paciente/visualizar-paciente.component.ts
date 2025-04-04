import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { BuscaPacienteComponent } from '../busca-paciente/busca-paciente.component';
import { Paciente, StatusPaciente } from '../models/paciente.model';
import { Plano } from '../models/plano.model';
import { Convenio } from '../models/convenio.model';
import { Endereco } from '../models/endereco.model';
import { ResultadoBusca } from '../models/busca-paciente.model';
import { PacienteService } from '../services/paciente.service';
import { ConvenioPlanoService } from '../services/convenio-plano.service';
import { finalize } from 'rxjs/operators';
import { InfoCardComponent } from '../../../shared/components/info-card/info-card.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { PacienteAvatarComponent } from '../../../shared/components/paciente-avatar/paciente-avatar.component';

@Component({
  selector: 'app-visualizar-paciente',
  standalone: true,
  imports: [
    CommonModule, 
    BuscaPacienteComponent,
    InfoCardComponent,
    StatusBadgeComponent,
    PacienteAvatarComponent
  ],
  templateUrl: './visualizar-paciente.component.html',
  styleUrls: ['./visualizar-paciente.component.scss']
})
export class VisualizarPacienteComponent implements OnInit {
  paciente: Paciente | null = null;
  convenio: string = '';
  plano: string = '';
  isLoading: boolean = true;
  error: string | null = null;
  
  // Controle da tela
  modoVisualizacao: boolean = false;
  resultadosBusca: Paciente[] = [];
  
  // Mapeamento de status para texto amigável
  statusMap: {[key: string]: {texto: string, classe: string}} = {
    'em-avaliacao': { texto: 'Em Avaliação', classe: 'bg-warning' },
    'ativo': { texto: 'Ativo', classe: 'bg-success' },
    'inativo': { texto: 'Inativo', classe: 'bg-secondary' },
    'alta': { texto: 'Alta', classe: 'bg-info' },
    'em-tratamento': { texto: 'Em Tratamento', classe: 'bg-warning text-dark' },
    'obito': { texto: 'Óbito', classe: 'bg-danger' }
  };

  constructor(
    private pacienteService: PacienteService,
    private convenioService: ConvenioPlanoService,
    private statusPaciente: StatusPaciente,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['pacienteId']) {
        this.carregarPaciente(String(params['pacienteId']));
      } else {
        this.isLoading = false;
      }
    });
  }

  carregarPaciente(id: string): void {
    this.isLoading = true;
    this.error = null;

    this.pacienteService.obterPacientePorId(id)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (paciente) => {
          if (paciente) {
            // Desserializar o campo 'endereco' se ele for uma string JSON
            if (paciente.endereco && typeof paciente.endereco === 'string') {
              try {
                paciente.endereco = JSON.parse(paciente.endereco);
              } catch (e) {
                console.error('Erro ao desserializar o endereço:', e);
                paciente.endereco = {
                  logradouro: '',
                  numero: '',
                  complemento: '',
                  bairro: '',
                  cidade: '',
                  estado: '',
                  cep: ''
                };
              }
            }

            // Garantir que o endereço seja sempre um objeto válido
            paciente.endereco = paciente.endereco || {
              logradouro: '',
              numero: '',
              complemento: '',
              bairro: '',
              cidade: '',
              estado: '',
              cep: ''
            };

            this.paciente = paciente;
            this.modoVisualizacao = true;

            // Carregar informações de convênio e plano, se disponíveis
            if (paciente.convenio_id) {
                this.convenioService.listarConvenios().subscribe((convenios: Convenio[]) => {
                const convenio = convenios.find((c: Convenio) => String(c.id) === String(paciente.convenio_id));
                this.convenio = convenio ? convenio.nome : 'Não informado';

                if (paciente.plano_id && paciente.convenio_id) {
                    // Convert convenio_id to number if the method expects a number
                    const convenioId = typeof paciente.convenio_id === 'string' 
                    ? parseInt(paciente.convenio_id, 10) 
                    : paciente.convenio_id;
                    
                    this.convenioService.listarPlanosPorConvenio(convenioId).subscribe((planos: Plano[]) => {
                    const planosMapeados = planos.map((p: Plano) => ({ id: String(p.id), nome: p.nome }));
                    const plano = planosMapeados.find((p: { id: string; nome: string }) => p.id === String(paciente.plano_id));
                    this.plano = plano ? plano.nome : 'Não informado';
                    });
                }
                });
            }
          } else {
            this.error = 'Paciente não encontrado';
            this.modoVisualizacao = false;
          }
        },
        error: (err) => {
          this.error = 'Erro ao carregar dados do paciente';
          this.modoVisualizacao = false;
        }
      });
  }
  
  buscarPaciente(resultado: ResultadoBusca): void {
    this.isLoading = true;
    this.error = null;
    this.modoVisualizacao = false;
    
    this.pacienteService.buscarPacientes(resultado)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (pacientes) => {
          this.resultadosBusca = pacientes;
          
          if (pacientes.length === 0) {
            this.error = 'Nenhum paciente encontrado com os critérios informados.';
          }
        },
        error: (err) => {
          this.error = 'Erro ao buscar pacientes';
          this.resultadosBusca = [];
        }
      });
  }
  
  selecionarPaciente(paciente: Paciente): void {
    this.carregarPaciente(String(paciente.id));
  }

  voltarParaBusca(): void {
    this.modoVisualizacao = false;
    this.paciente = null;
    this.resultadosBusca = [];
  }

  voltarParaLista(): void {
    this.router.navigate(['/pacientes']);
  }

  irParaAcompanhamento(): void {
    this.router.navigate(['/pacientes/acompanhamento'], {
      queryParams: { pacienteId: this.paciente?.id }
    });
  }
  
  getStatusInfo(statusCode: string): {texto: string, classe: string} {
    return this.statusMap[statusCode] || { texto: statusCode, classe: 'bg-secondary' };
  }

  formatarData(data: string | undefined): string {
    if (!data) return 'Não informado';
    
    try {
      const dataObj = new Date(data);
      return dataObj.toLocaleDateString('pt-BR');
    } catch (e) {
      return data;
    }
  }

  formatarEndereco(endereco: Endereco): string {
    if (!endereco) return 'Não informado';

    // Usar 'logradouro' ou 'rua', dependendo de qual estiver disponível
    const logradouroOuRua = endereco.logradouro || endereco.rua || 'Logradouro não informado';

    let enderecoCompleto = `${logradouroOuRua}, ${endereco.numero || 'S/N'}`;

    if (endereco.complemento) {
      enderecoCompleto += ` - ${endereco.complemento}`;
    }

    enderecoCompleto += ` - ${endereco.bairro || 'Bairro não informado'}, ${endereco.cidade || 'Cidade não informada'}/${endereco.estado || 'Estado não informado'} - ${this.formatarCep(endereco.cep)}`;

    return enderecoCompleto;
  }

  formatarCep(cep: string): string {
    if (!cep) return '';
    
    // Remove caracteres não numéricos
    const numeros = cep.replace(/\D/g, '');
    
    // Aplica a máscara de CEP: 00000-000
    if (numeros.length === 8) {
      return `${numeros.substring(0, 5)}-${numeros.substring(5)}`;
    }
    
    return cep;
  }
}