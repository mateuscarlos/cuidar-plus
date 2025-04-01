import { Endereco } from './endereco.model';

export interface Paciente {
  id: string;
  nome_completo: string;
  cpf: string;
  data_nascimento: string;
  genero?: string;
  estado_civil?: string;
  profissao?: string;
  nacionalidade?: string;
  telefone: string;
  telefone_secundario?: string;
  email?: string;
  endereco: Endereco;
  status: string;
  cid_primario: string;
  cid_secundario?: string;
  acomodacao: string;
  medico_responsavel?: string;
  alergias?: string;
  convenio_id?: number;
  plano_id?: number;
  numero_carteirinha?: string;
  data_validade?: string;
  contato_emergencia?: string;
  telefone_emergencia?: string;
  case_responsavel?: string;
  created_at: string;
  updated_at: string;
}

export enum StatusPaciente {
  ATIVO = 'ativo',
  EM_AVALIACAO = 'em-avaliacao',
  EM_TRATAMENTO = 'em-tratamento',
  INATIVO = 'inativo',
  ALTA = 'alta',
  OBITO = 'obito'
}