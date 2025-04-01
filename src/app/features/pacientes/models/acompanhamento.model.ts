export interface SinaisVitais {
  pressao_arterial?: string;
  frequencia_cardiaca?: number;
  temperatura?: number;
  saturacao_oxigenio?: number;
  glicemia?: number;
}

export interface AvaliacaoFerida {
  aspecto?: string;
  sinais_infeccao?: boolean;
  tipo_curativo?: string;
}

export interface AvaliacaoDispositivo {
  funcionamento_adequado?: boolean;
  sinais_complicacao?: string;
}

export interface PlanoAcao {
  data_proximo?: string;
  hora_proximo?: string;
  profissional_responsavel?: string;
  necessidade_contato_outros?: boolean;
  profissionais_contatar?: string;
  necessidade_exames?: boolean;
  exames_consultas?: string;
  outras_recomendacoes?: string;
}

export enum TipoAtendimento {
  PRESENCIAL = 'Presencial',
  TELEFONE = 'Telefone',
  INTERNET = 'Internet',
  MENSAGEM = 'Mensagem'
}

export enum MotivoAtendimento {
  ROTINA = 'Rotina de acompanhamento',
  QUEIXA = 'Queixa/sintoma específico',
  DUVIDA_MEDICACAO = 'Dúvida sobre medicação',
  AGENDAMENTO = 'Agendamento/reagendamento',
  ORIENTACAO = 'Orientação sobre cuidados',
  OUTROS = 'Outros'
}

export enum NivelDor {
  SEM_DOR = 'Sem dor',
  LEVE = 'Leve',
  MODERADA = 'Moderada',
  INTENSA = 'Intensa'
}

export enum CondicaoPaciente {
  ESTAVEL = 'Estável',
  INSTAVEL = 'Instável'
}

export interface Acompanhamento {
  id?: number;
  paciente_id: number;
  data_hora_atendimento: string;
  profissional: {
    nome: string;
    cargo: string;
  };
  tipo_atendimento: TipoAtendimento;
  motivo_atendimento: MotivoAtendimento;
  descricao_motivo?: string;
  sinais_vitais?: SinaisVitais;
  condicao_paciente: CondicaoPaciente;
  descricao_condicao?: string;
  nivel_dor?: NivelDor;
  localizacao_dor?: string;
  avaliacao_feridas?: AvaliacaoFerida;
  avaliacao_dispositivos?: AvaliacaoDispositivo;
  intervencoes: {
    medicacao_administrada?: string;
    curativo_realizado?: string;
    orientacoes_fornecidas?: string;
    procedimentos_realizados?: string;
    outras_intervencoes?: string;
  };
  plano_acao: PlanoAcao;
  comunicacao_cuidador: {
    nome_cuidador?: string;
    informacoes_repassadas?: string;
    duvidas_questionamentos?: string;
  };
  observacoes_gerais?: string;
  created_at?: string;
  updated_at?: string;
}