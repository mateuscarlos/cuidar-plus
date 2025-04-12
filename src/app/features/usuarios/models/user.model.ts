export interface Usuario {
  id?: number | string;
  nome: string;
  email: string;
  cpf?: string;
  document?: string; // Campo alternativo para CPF
  telefone?: string;
  setor?: string | number;
  funcao?: string | number;
  funcaoNome?: string;
  setorNome?: string;
  registroCategoria?: string;
  registro_categoria?: string; // Nome do campo usado pelo backend
  especialidade?: string;
  cep?: string;
  endereco?: {
    logradouro?: string;
    rua?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    localidade?: string;
    cidade?: string;
    estado?: string;
    uf?: string;
    cep?: string;
  };
  dataAdmissao?: Date | string;
  data_admissao?: Date | string; // Nome do campo usado pelo backend
  tipoContratacao?: string;
  tipo_contratacao?: string; // Nome do campo usado pelo backend
  tipoAcesso?: string;
  tipo_acesso?: string; // Nome do campo usado pelo backend
  status?: string;
  ativo?: boolean;
  password_hash?: string;
  permissions?: string[];
  cargo?: string | null;
  created_at?: string;
  updated_at?: string;
}

// Enumeração para os status possíveis de um usuário
export enum UserStatus {
  ATIVO = 'Ativo',
  INATIVO = 'Inativo',
  FERIAS = 'Férias',
  LICENCA_MEDICA = 'Licença Médica',
  LICENCA_MATERNIDADE = 'Licença Maternidade',
  LICENCA_PATERNIDADE = 'Licença Paternidade',
  AFASTADO_ACIDENTE_DE_TRABALHO = 'Afastado por Acidente de Trabalho',
  AFASTAMENTO_NAO_REMUNERADO = 'Afastamento Não Remunerado',
  SUSPENSAO_CONTRTATUAL = 'Suspensão Contratual',
  APOSENTADO = 'Aposentado',
  AFASTADO_OUTROS = 'Afastado por Outros Motivos',
}

export enum TipoContratacao {
  contratada = 'Contratação Direta',
  terceirizada = 'Terceirizado',
  pj = 'Pessoa Jurídica'
}

export enum TipoAcesso {
  admin = 'Administrador',
  gestor = 'Gestor',
  padrao = 'Padrão',
  restrito = 'Restrito'
}

export interface Endereco {
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  localidade?: string;
  estado?: string;
  uf?: string;
  cep?: string;
}

import { ConselhoProfissional, SetorProfissional, SETOR_CONSELHO_MAP, FuncoesComRegistro, FUNCAO_SETOR_MAP, FUNCOES_DETALHES } from './conselhos-profissionais.model';

export class UsuarioAdapter {
  static adapt(usuario: Usuario): Usuario {
    if (!usuario) return usuario;
    
    // Verificamos se há detalhes da função
    const detalhesFuncao = this.obterDetalhesFuncao(usuario.funcao);
    
    return {
      ...usuario,
      tipo_contratacao: this.formatarTipoContratacao(usuario.tipo_contratacao),
      tipo_acesso: this.formatarTipoAcesso(usuario.tipo_acesso),
      status: this.formatarStatus(usuario.status || (usuario.ativo ? 'ATIVO' : 'INATIVO')),
      // Se temos detalhes da função, usamos o nome dela
      funcaoNome: usuario.funcaoNome || (detalhesFuncao ? detalhesFuncao.nome : undefined)
    };
  }
  
  static formatarTipoContratacao(tipo?: string): string {
    if (!tipo) return 'Não informado';
    
    // Verifica nos valores do enum
    const tipoLower = tipo.toLowerCase();
    
    // Verificar se é um código ou valor direto
    switch(tipoLower) {
      case 'c': return TipoContratacao.contratada;
      case 't': return TipoContratacao.terceirizada;
      case 'p': return TipoContratacao.pj;
      case 'contratada': return TipoContratacao.contratada;
      case 'terceirizada': return TipoContratacao.terceirizada;
      case 'pj': return TipoContratacao.pj;
      default:
        // Tenta encontrar no enum
        for (const key in TipoContratacao) {
          if (tipoLower === key.toLowerCase()) {
            return TipoContratacao[key as keyof typeof TipoContratacao];
          }
        }
        return tipo;
    }
  }
  
  static formatarTipoAcesso(tipo?: string): string {
    if (!tipo) return 'Não informado';
    
    const tipoLower = tipo.toLowerCase();
    
    // Verificar mapeamento direto
    switch(tipoLower) {
      case 'admin': return TipoAcesso.admin;
      case 'gestor': return TipoAcesso.gestor;
      case 'padrao': return TipoAcesso.padrao;
      case 'restrito': return TipoAcesso.restrito;
      default:
        // Tenta encontrar no enum
        for (const key in TipoAcesso) {
          if (tipoLower === key.toLowerCase()) {
            return TipoAcesso[key as keyof typeof TipoAcesso];
          }
        }
        return tipo;
    }
  }
  
  static formatarStatus(status?: string): string {
    if (!status) return 'Não informado';
    
    switch(status.toUpperCase()) {
      case 'ATIVO': return 'Ativo';
      case 'INATIVO': return 'Inativo';
      case 'FERIAS': return 'Férias';
      case 'LICENCA_MEDICA': return 'Licença Médica';
      case 'LICENCA_MATERNIDADE': return 'Licença Maternidade';
      case 'LICENCA_PATERNIDADE': return 'Licença Paternidade';
      case 'AFASTADO_ACIDENTE_DE_TRABALHO': return 'Afastado por Acidente de Trabalho';
      case 'AFASTAMENTO_NAO_REMUNERADO': return 'Afastamento Não Remunerado';
      case 'SUSPENSAO_CONTRTATUAL': return 'Suspensão Contratual';
      case 'APOSENTADO': return 'Aposentado';
      case 'AFASTADO_OUTROS': return 'Afastado por Outros Motivos';
      // Adicione outros casos conforme necessário
      default: return status;
    }
  }
  
  // Método para determinar o nome do conselho com base na função e/ou setor
  static obterNomeConselho(funcaoId?: string | number, setorId?: string | number): string {
    // Se temos uma função com ID numérico, verificamos se está no mapeamento
    if (funcaoId && !isNaN(Number(funcaoId))) {
      const funcaoNumerica = Number(funcaoId);
      
      // Verifica se a função está no mapeamento de funções
      if (funcaoNumerica in FUNCAO_SETOR_MAP) {
        const setorAssociado = FUNCAO_SETOR_MAP[funcaoNumerica as FuncoesComRegistro];
        return SETOR_CONSELHO_MAP[setorAssociado] || 'Registro Profissional';
      }
    }
    
    // Se temos um setor com ID numérico, verificamos se está no mapeamento
    if (setorId && !isNaN(Number(setorId))) {
      const setorNumerico = Number(setorId);
      
      if (setorNumerico in SETOR_CONSELHO_MAP) {
        return SETOR_CONSELHO_MAP[setorNumerico as SetorProfissional] || 'Registro Profissional';
      }
    }
    
    // Fallback para análise de texto da função (para compatibilidade)
    if (typeof funcaoId === 'string') {
      const funcaoLower = funcaoId.toLowerCase();
      
      if (funcaoLower.includes('enferm')) return ConselhoProfissional.COREN;
      if (funcaoLower.includes('medic') || funcaoLower.includes('médic')) return ConselhoProfissional.CRM;
      if (funcaoLower.includes('nutricion')) return ConselhoProfissional.CRN;
      if (funcaoLower.includes('fisioter')) return ConselhoProfissional.CREFITO;
      if (funcaoLower.includes('fonoaudi')) return ConselhoProfissional.CREFONO;
      if (funcaoLower.includes('psicolog')) return ConselhoProfissional.CRP;
      if (funcaoLower.includes('farmac')) return ConselhoProfissional.CRF;
    }
    
    return 'Registro Profissional';
  }
  
  // Método para obter detalhes completos da função
  static obterDetalhesFuncao(funcaoId?: string | number): {
    nome: string;
    setorId: SetorProfissional;
    conselho: ConselhoProfissional;
  } | null {
    if (funcaoId && !isNaN(Number(funcaoId))) {
      const funcaoNumerica = Number(funcaoId) as FuncoesComRegistro;
      
      if (funcaoNumerica in FUNCOES_DETALHES) {
        return FUNCOES_DETALHES[funcaoNumerica];
      }
    }
    
    return null;
  }
}