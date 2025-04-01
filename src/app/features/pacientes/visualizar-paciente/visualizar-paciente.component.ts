import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { BuscaPacienteComponent } from '../busca-paciente/busca-paciente.component';

interface Endereco {
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

interface Paciente {
  id: string;
  nome_completo: string;
  cpf: string;
  convenio_id?: number;
  plano_id?: number;
  numero_carteirinha?: string;
  data_validade?: string;
  acomodacao: string;
  telefone: string;
  telefone_secundario?: string;
  alergias?: string;
  cid_primario: string;
  cid_secundario?: string;
  data_nascimento: string;
  endereco: Endereco;
  status: string;
  created_at: string;
  updated_at: string;
  email?: string;
  telefone_emergencia?: string;
  contato_emergencia?: string;
  case_responsavel?: string;
  medico_responsavel?: string;
  genero?: string;
  estado_civil?: string;
  profissao?: string;
  nacionalidade?: string;
}

interface Convenio {
  id: number;
  nome: string;
}

interface Plano {
  id: number;
  nome: string;
  convenio_id: number;
}

@Component({
  selector: 'app-visualizar-paciente',
  standalone: true,
  imports: [CommonModule, BuscaPacienteComponent],
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
  
  // Mock de dados para convenios e planos
  conveniosMock: Convenio[] = [
    { id: 1, nome: 'Amil' },
    { id: 2, nome: 'Bradesco Saúde' },
    { id: 3, nome: 'SulAmérica' },
    { id: 4, nome: 'Unimed' }
  ];
  
  planosMock: Plano[] = [
    { id: 1, nome: 'Básico', convenio_id: 1 },
    { id: 2, nome: 'Intermediário', convenio_id: 1 },
    { id: 3, nome: 'Premium', convenio_id: 1 },
    { id: 4, nome: 'Essencial', convenio_id: 2 },
    { id: 5, nome: 'Exclusivo', convenio_id: 2 },
    { id: 6, nome: 'Total', convenio_id: 3 },
    { id: 7, nome: 'Nacional', convenio_id: 4 }
  ];
  
  // Mapeamento de status para texto amigável
  statusMap: {[key: string]: {texto: string, classe: string}} = {
    'em-avaliacao': { texto: 'Em Avaliação', classe: 'bg-warning' },
    'ativo': { texto: 'Ativo', classe: 'bg-success' },
    'inativo': { texto: 'Inativo', classe: 'bg-secondary' },
    'alta': { texto: 'Alta', classe: 'bg-info' },
    'obito': { texto: 'Óbito', classe: 'bg-danger' }
  };
  
  // Pacientes mockados para teste
  pacientesMock: Paciente[] = [
    {
      id: '12345',
      nome_completo: 'Maria Rodrigues Silva',
      cpf: '12345678901',
      data_nascimento: '1980-05-15',
      telefone: '(11) 99999-8888',
      telefone_secundario: '(11) 99999-7777',
      email: 'maria.rodrigues@email.com',
      endereco: {
        logradouro: 'Rua das Flores',
        numero: '123',
        complemento: 'Apto 45',
        bairro: 'Jardim Primavera',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01234-567'
      },
      acomodacao: 'Apartamento',
      alergias: 'Penicilina, Dipirona',
      cid_primario: 'I10',
      cid_secundario: 'E11',
      status: 'ativo',
      created_at: '2023-01-15T10:30:00',
      updated_at: '2023-03-22T14:45:00',
      contato_emergencia: 'João Rodrigues',
      telefone_emergencia: '(11) 98765-4321',
      case_responsavel: 'Dr. Carlos Mendes',
      medico_responsavel: 'Dra. Ana Souza',
      genero: 'Feminino',
      estado_civil: 'Casado(a)',
      profissao: 'Professora',
      nacionalidade: 'Brasileira',
      convenio_id: 1,
      plano_id: 2,
      numero_carteirinha: '987654321',
      data_validade: '2024-12-31'
    },
    {
      id: '12346',
      nome_completo: 'João Silva Pereira',
      cpf: '98765432101',
      data_nascimento: '1975-08-22',
      telefone: '(11) 99888-7777',
      endereco: {
        logradouro: 'Av. Paulista',
        numero: '1500',
        bairro: 'Bela Vista',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '04123-000'
      },
      acomodacao: 'Enfermaria',
      cid_primario: 'K29',
      status: 'em-avaliacao',
      created_at: '2023-02-10T08:15:00',
      updated_at: '2023-02-10T08:15:00',
      genero: 'Masculino',
      estado_civil: 'Solteiro(a)',
      nacionalidade: 'Brasileira',
      convenio_id: 3
    },
    {
      id: '12347',
      nome_completo: 'Maria Santos Costa',
      cpf: '45678912301',
      data_nascimento: '1990-03-10',
      telefone: '(11) 97777-6666',
      email: 'maria.santos@email.com',
      endereco: {
        logradouro: 'Rua Augusta',
        numero: '789',
        complemento: 'Bloco B',
        bairro: 'Consolação',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01305-000'
      },
      acomodacao: 'Quarto Privativo',
      alergias: 'Nenhuma',
      cid_primario: 'J45',
      status: 'ativo',
      created_at: '2023-03-05T14:20:00',
      updated_at: '2023-03-18T09:30:00',
      contato_emergencia: 'Carlos Santos',
      telefone_emergencia: '(11) 96666-5555',
      case_responsavel: 'Dra. Márcia Lima',
      medico_responsavel: 'Dr. Roberto Oliveira',
      genero: 'Feminino',
      estado_civil: 'Divorciado(a)',
      profissao: 'Advogada',
      nacionalidade: 'Brasileira',
      convenio_id: 4,
      plano_id: 7,
      numero_carteirinha: '123456789',
      data_validade: '2025-06-30'
    }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Inicialmente não exibe loader
    this.isLoading = false;
    
    // Verificar se recebeu um ID de paciente pela rota
    this.route.queryParams.subscribe(params => {
      const pacienteId = params['pacienteId'];
      
      if (pacienteId) {
        this.isLoading = true;
        setTimeout(() => {
          this.carregarPaciente(pacienteId);
        }, 800); // Simular um pequeno delay
      } else {
        // Se não recebeu ID, mostra interface de busca
        this.error = null;
        this.modoVisualizacao = false;
      }
    });
  }

  carregarPaciente(id: string): void {
    this.paciente = this.pacientesMock.find(p => p.id === id) || null;
    
    if (this.paciente) {
      this.modoVisualizacao = true;
      // Carregar informações de convênio e plano, se disponíveis
      if (this.paciente.convenio_id) {
        const convenio = this.conveniosMock.find(c => c.id === this.paciente?.convenio_id);
        this.convenio = convenio ? convenio.nome : 'Não informado';
        
        if (this.paciente.plano_id) {
          const plano = this.planosMock.find(p => p.id === this.paciente?.plano_id);
          this.plano = plano ? plano.nome : 'Não informado';
        }
      }
      this.error = null;
    } else {
      this.error = 'Paciente não encontrado';
      this.modoVisualizacao = false;
    }
    
    this.isLoading = false;
  }
  
  buscarPaciente(resultado: {tipo: 'cpf' | 'id' | 'nome', valor: string}): void {
    this.isLoading = true;
    this.error = null;
    this.modoVisualizacao = false;
    
    // Simular delay de busca
    setTimeout(() => {
      this.resultadosBusca = [];
      
      if (resultado.tipo === 'cpf') {
        this.resultadosBusca = this.pacientesMock.filter(p => 
          p.cpf.includes(resultado.valor)
        );
      } else if (resultado.tipo === 'id') {
        this.resultadosBusca = this.pacientesMock.filter(p => 
          p.id.includes(resultado.valor)
        );
      } else if (resultado.tipo === 'nome') {
        this.resultadosBusca = this.pacientesMock.filter(p => 
          p.nome_completo.toLowerCase().includes(resultado.valor.toLowerCase())
        );
      }
      
      if (this.resultadosBusca.length === 0) {
        this.error = 'Nenhum paciente encontrado com os critérios informados.';
      }
      
      this.isLoading = false;
    }, 500);
  }
  
  selecionarPaciente(paciente: Paciente): void {
    this.carregarPaciente(paciente.id);
  }

  voltarParaBusca(): void {
    this.modoVisualizacao = false;
    this.paciente = null;
    this.error = null;
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

  // Formatar a data para exibição
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
    let enderecoFormatado = endereco.logradouro + ', ' + endereco.numero;
    if (endereco.complemento) {
      enderecoFormatado += ' - ' + endereco.complemento;
    }
    enderecoFormatado += ' - ' + endereco.bairro + ', ' + endereco.cidade + ' - ' + endereco.estado;
    enderecoFormatado += ' - CEP: ' + this.formatarCep(endereco.cep);
    
    return enderecoFormatado;
  }

  formatarCep(cep: string): string {
    if (cep.length === 8) {
      return cep.substring(0, 5) + '-' + cep.substring(5);
    }
    return cep;
  }
}