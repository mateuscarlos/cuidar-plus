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
  ATIVO = 'Ativo',
  EM_AVALIACAO = 'Em Avaliação',
  INATIVO = 'Inativo',
  ALTA_ADMINISTRATIVA = 'Alta Administrativa',
  ALTA_MEDICA = 'Alta Médica',
  OBITO = 'Óbito'
}

// Interface para mapear status para classes Bootstrap 5.3
export interface StatusClasses {
  bgColor: string;
  textColor: string;
  borderColor: string;
  icon: string;
}

// Mapeamento de cada status para suas respectivas classes Bootstrap 5.3
export const STATUS_BOOTSTRAP_CLASSES: Record<StatusPaciente, StatusClasses> = {
  [StatusPaciente.ATIVO]: {
    bgColor: 'bg-success-subtle',
    textColor: 'text-success',
    borderColor: 'border-success',
    icon: 'bi bi-check-circle-fill'
  },
  [StatusPaciente.EM_AVALIACAO]: {
    bgColor: 'bg-warning-subtle',
    textColor: 'text-warning',
    borderColor: 'border-warning',
    icon: 'bi bi-exclamation-triangle-fill'
  },
  [StatusPaciente.INATIVO]: {
    bgColor: 'bg-danger-subtle',
    textColor: 'text-danger',
    borderColor: 'border-danger',
    icon: 'bi bi-x-circle-fill'
  },
  [StatusPaciente.ALTA_ADMINISTRATIVA]: {
    bgColor: 'bg-info-subtle',
    textColor: 'text-info',
    borderColor: 'border-info',
    icon: 'bi bi-clipboard-check-fill'
  },
  [StatusPaciente.ALTA_MEDICA]: {
    bgColor: 'bg-primary-subtle',
    textColor: 'text-primary',
    borderColor: 'border-primary',
    icon: 'bi bi-clipboard2-pulse-fill'
  },
  [StatusPaciente.OBITO]: {
    bgColor: 'bg-dark-subtle',
    textColor: 'text-dark',
    borderColor: 'border-dark',
    icon: 'bi bi-heart-fill'
  }
};