export interface User {
  id: string;
  nome: string;
  email: string;
  cargo?: string;
  cpf: string;
  endereco?: Endereco;
  setor: string;
  funcao: string;
  especialidade?: string;
  registroCategoria?: string;
  telefone?: string;
  dataAdmissao?: Date;
  status?: string;
  tipoAcesso?: string;
  permissions?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  tipoContratacao?: string;
  tipoContratacaoExtenso?: string; // Pode vir do backend, se quiser enviar já traduzido
  ativo?: boolean;
}

export interface Endereco {
  rua?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
}