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
  C = 'Contratação Direta',
  T = 'Terceirizado',
  P = 'Pessoa Jurídica'
}

export enum TipoAcesso {
  Administrador = 'Administrador',
  Usuario = 'Usuário',
  Gestor = 'Gestor',
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