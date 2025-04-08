export interface Usuario {
  id?: number | string;
  nome: string;
  email: string;
  cpf: string;
  telefone?: string;
  setorNome?: string;
  funcaoNome?: string;
  setor?: string;
  funcao?: string;
  registroCategoria?: string;
  registroNumero?: string;
  numeroRegistro?: string; // Adicionado para corrigir o erro
  especialidade?: string;
  cep?: string;
  endereco?: Endereco;
  dataAdmissao?: Date | string;
  tipoContratacao?: string;
  tipoAcesso?: string;
  status?: string;
  ativo?: boolean;
  password_hash?: string;
  created_at?: Date | string;
  updated_at?: Date | string;
  permissions?: string[];
  tipo_contratacao?: string; // Adicionado para suportar o formato da API
  
  // Campos adicionais para a UI (não serão enviados para o backend)
  
  setor_id?: number;
  funcao_id?: number;
}

export interface Endereco {
  logradouro?: string;
  rua?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  localidade?: string;
  estado?: string;
  uf?: string;
  cep?: string;
  ddd?: string;
  ibge?: string;
  gia?: string;
  siafi?: string;
  regiao?: string;
  unidade?: string;
}

export enum UserStatus {
  ATIVO = 'Ativo',
  INATIVO = 'Inativo',
  AFASTADO_ACIDENTE_DE_TRABALHO = 'Afastado Por Acidente de Trabalho',
  AFASTADO_OUTROS = 'Afastado Por Outros Motivos',
  FERIAS = 'Férias',
  LICENCA_MEDICA = 'Licença médica',
  LICENCA_MATERNIDADE = 'Licença maternidade',
  LICENCA_PATERNIDADE = 'Licença paternidade',
  SUSPENSAO_CONTRTATUAL = 'Suspensão Contratual',
  AFASTAMENTO_NAO_REMUNERADO = 'Afastamento Não Remunerado',
  APOSENTADO = 'Aposentado',
}

export enum TipoContratacao {
  CLT = 'CLT',
  PJ = 'PJ',
  ESTAGIO = 'Estágio',
  APOSENTADO = 'Aposentado',
  OUTROS = 'Outros',
}

export enum TipoAcesso {
  ADMINISTRADOR = 'Administrador',
  USUARIO = 'Usuário',
  VISITANTE = 'Visitante',
}