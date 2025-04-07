import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
// Import the formatted date component and date pipe
import { FormattedDateComponent } from '../../../shared/components/formatted-date/formatted-date.component';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';
import { BuscaPacienteComponent } from '../busca-paciente/busca-paciente.component';
import { Paciente, StatusPaciente } from '../models/paciente.model'; // Import as a type, not for DI
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
    PacienteAvatarComponent,
    DateFormatPipe,
    FormattedDateComponent
  ],
  providers: [
    DateFormatPipe // Add this line to provide the pipe
  ],
  templateUrl: './visualizar-paciente.component.html',
  styleUrls: ['./visualizar-paciente.component.scss']
})
export class VisualizarPacienteComponent implements OnInit {
  paciente: Paciente | null = null;
  convenio: string = '';
  plano: string = '';
  isLoading: boolean = false; // Inicializa como false até que seja necessário carregar
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

  // Use the enum directly as a property or reference StatusPaciente directly when needed
  statusPacienteEnum = StatusPaciente;

  constructor(
    private pacienteService: PacienteService,
    private convenioService: ConvenioPlanoService,
    // Remove StatusPaciente from here - it's an enum, not a service
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Resetamos o estado inicial antes de qualquer carregamento
    this.resetComponent();
    
    this.route.queryParams.subscribe(params => {
      if (params['pacienteId']) {
        this.carregarPacienteParaEdicao(params['pacienteId']);
      } else {
        // Se não há parâmetros, mostramos a tela de busca
        this.isLoading = false;
        this.modoVisualizacao = false;
      }
    });
  }
  
  // Método para resetar o componente a um estado inicial consistente
  resetComponent(): void {
    this.paciente = null;
    this.convenio = '';
    this.plano = '';
    this.error = null;
    this.resultadosBusca = [];
  }

  carregarPacienteParaEdicao(id: string): void {
    this.isLoading = true;
    this.resetComponent(); // Reseta o estado antes de começar o carregamento
    
    this.pacienteService.obterPacientePorId(id)
      .pipe(
        finalize(() => {
          this.isLoading = false; // Sempre garante que o loading será desativado
          console.log('Finalizou a chamada de API para obter paciente');
        })
      )
      .subscribe({
        next: (paciente) => {
          if (paciente) {
            console.log('Paciente recebido com sucesso:', paciente.id);
            // Processar os dados do paciente
            this.paciente = paciente;
            this.modoVisualizacao = true;
            
            // If the patient has insurance, load additional information
            if (paciente.convenio_id) {
              this.loadInsuranceInfo(paciente);
            }
          } else {
            this.error = 'Paciente não encontrado';
            this.modoVisualizacao = false;
          }
        },
        error: (err) => {
          this.error = 'Erro ao carregar dados do paciente para edição';
          this.modoVisualizacao = false;
          console.error('Erro ao carregar paciente:', err);
        }
      });
  }

  loadInsuranceInfo(paciente: Paciente): void {
    this.convenioService.listarConvenios().subscribe({
      next: (convenios: Convenio[]) => {
        const convenio = convenios.find((c: Convenio) => String(c.id) === String(paciente.convenio_id));
        this.convenio = convenio ? convenio.nome : 'Não informado';

        if (paciente.plano_id && paciente.convenio_id) {
          // Convert convenio_id to number if the method expects a number
          const convenioId = typeof paciente.convenio_id === 'string' 
            ? parseInt(paciente.convenio_id, 10) 
            : paciente.convenio_id;
          
          this.convenioService.listarPlanosPorConvenio(convenioId).subscribe({
            next: (planos: Plano[]) => {
              const planosMapeados = planos.map((p: Plano) => ({ id: String(p.id), nome: p.nome }));
              const plano = planosMapeados.find((p: { id: string; nome: string }) => p.id === String(paciente.plano_id));
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

  carregarPaciente(id: string): void {
    this.isLoading = true;
    this.error = null;
    
    console.log('Iniciando carregamento do paciente ID:', id);

    this.pacienteService.obterPacientePorId(id)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          console.log('Finalizou carregamento do paciente');
        })
      )
      .subscribe({
        next: (paciente) => {
          if (paciente) {
            console.log('Paciente recebido:', paciente.id);
            // Ensure the nome field is set (used in the template)
            if (paciente.nome_completo && !paciente.nome) {
              paciente.nome = paciente.nome_completo;
            }
            
            // Ensure we have both date fields properly set
            if (paciente.data_nascimento) {
              // Normalize into a standard date format
              try {
                const dateObj = new Date(paciente.data_nascimento);
                if (!isNaN(dateObj.getTime())) {
                  const isoDate = dateObj.toISOString().split('T')[0];
                  paciente.data_nascimento = isoDate;
                  paciente.dataNascimento = isoDate; // Set the alias field too
                }
              } catch (e) {
                console.error('Erro ao processar data de nascimento:', e);
              }
            } else if (paciente.dataNascimento) {
              // If we only have dataNascimento, copy it to data_nascimento
              paciente.data_nascimento = paciente.dataNascimento;
            }
            
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
          console.error('Erro ao carregar dados do paciente:', err);
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
  
  irParaEdicao(): void {
    if (this.paciente && this.paciente.id) {
      // Navegar para a rota de edição com o ID como parâmetro
      this.router.navigate(['/pacientes/editar'], {
        queryParams: { 
          pacienteId: this.paciente.id,
          autoLoad: 'true'  // Adicionar um parâmetro para sinalizar carregamento automático
        }
      });
    } else {
      console.error('Não é possível editar: paciente não encontrado ou sem ID');
    }
  }
  
  getStatusInfo(statusCode: string): {texto: string, classe: string} {
    return this.statusMap[statusCode] || { texto: statusCode, classe: 'bg-secondary' };
  }

  formatarData(data: string | undefined): string {
    if (!data) {
      // Check if this.paciente exists and has a dataNascimento field
      if (this.paciente?.dataNascimento) {
        data = this.paciente.dataNascimento;
      } else if (this.paciente?.data_nascimento) {
        data = this.paciente.data_nascimento;
      } else {
        return 'Não informado';
      }
    }
    
    try {
      // Remove any timezone information if present
      const cleanDate = data.toString().split('T')[0];
      const dataObj = new Date(cleanDate);
      
      // Check if date is valid
      if (isNaN(dataObj.getTime())) {
        console.warn('Data inválida:', data);
        return 'Não informado';
      }
      
      // Format the date to Brazilian format
      return dataObj.toLocaleDateString('pt-BR');
    } catch (e) {
      console.error('Erro ao formatar data:', e, data);
      return 'Não informado';
    }
  }

  formatarEndereco(endereco: Endereco): string {
    if (!endereco) return 'Não informado';

    const logradouro = endereco.logradouro || 'Logradouro não informado';
    
    let enderecoCompleto = `${logradouro}, ${endereco.numero || 'S/N'}`;

    if (endereco.complemento) {
      enderecoCompleto += ` - ${endereco.complemento}`;
    }

    enderecoCompleto += ` - ${endereco.bairro || 'Bairro não informado'}, ${endereco.localidade || 'Cidade não informada'}/${endereco.uf || 'UF não informado'} - ${this.formatarCep(endereco.cep || '')}`;

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