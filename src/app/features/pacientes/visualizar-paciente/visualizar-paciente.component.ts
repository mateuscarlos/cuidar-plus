import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { BuscaPacienteComponent } from '../busca-paciente/busca-paciente.component';
import { Paciente, StatusPaciente } from '../models/paciente.model';
import { Endereco } from '../models/endereco.model';
import { ResultadoBusca } from '../models/busca-paciente.model';
import { PacienteService } from '../services/paciente.service';
import { ConvenioService } from '../services/convenio.service';
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
    private convenioService: ConvenioService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['pacienteId']) {
        this.carregarPaciente(params['pacienteId']);
      } else {
        this.isLoading = false;
      }
    });
  }

  carregarPaciente(id: string): void {
    this.isLoading = true;
    this.error = null;
    
    this.pacienteService.getPaciente(id)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (paciente) => {
          if (paciente) {
            this.paciente = paciente;
            this.modoVisualizacao = true;
            
            // Carregar informações de convênio e plano, se disponíveis
            if (paciente.convenio_id) {
              this.convenioService.getConvenios().subscribe(convenios => {
                const convenio = convenios.find(c => c.id === paciente.convenio_id);
                this.convenio = convenio ? convenio.nome : 'Não informado';
                
                if (paciente.plano_id) {
                  this.convenioService.getTodosPlanos().subscribe(planos => {
                    const plano = planos.find(p => p.id === paciente.plano_id);
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
    this.carregarPaciente(paciente.id);
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
    
    let enderecoCompleto = `${endereco.logradouro}, ${endereco.numero}`;
    
    if (endereco.complemento) {
      enderecoCompleto += ` - ${endereco.complemento}`;
    }
    
    enderecoCompleto += ` - ${endereco.bairro}, ${endereco.cidade}/${endereco.estado} - ${this.formatarCep(endereco.cep)}`;
    
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