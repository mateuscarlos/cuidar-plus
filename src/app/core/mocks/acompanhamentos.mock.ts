import { Acompanhamento, CondicaoPaciente, MotivoAtendimento, NivelDor, TipoAtendimento } from '../../features/pacientes/models/acompanhamento.model';

export const ACOMPANHAMENTOS_MOCK: Acompanhamento[] = [
  {
    id: 'acomp-001',
    paciente_id: 12345,
    data_hora_atendimento: '2023-08-10T14:30:00',
    tipo_atendimento: TipoAtendimento.PRESENCIAL,
    motivo_atendimento: MotivoAtendimento.ROTINA,
    condicao_paciente: CondicaoPaciente.ESTAVEL,
    nivel_dor: NivelDor.SEM_DOR,
    sinais_vitais: {
      pressao_arterial: '120/80',
      frequencia_cardiaca: 72,
      temperatura: 36.5,
      saturacao_oxigenio: 98,
      glicemia: 95
    },
    plano_acao: {
      data_proximo: '2023-08-24',
      hora_proximo: '15:00',
      profissional_responsavel: 'Dra. Ana Souza',
      necessidade_contato_outros: false,
      necessidade_exames: true,
      exames_consultas: 'Solicitar hemograma completo'
    },
    created_at: '2023-08-10T15:45:00'
  },
  {
    id: 'acomp-002',
    paciente_id: 12345,
    data_hora_atendimento: '2023-07-20T10:15:00',
    tipo_atendimento: TipoAtendimento.PRESENCIAL,
    motivo_atendimento: MotivoAtendimento.QUEIXA,
    descricao_motivo: 'Dor abdominal leve',
    condicao_paciente: CondicaoPaciente.ESTAVEL,
    nivel_dor: NivelDor.LEVE,
    localizacao_dor: 'Região epigástrica',
    sinais_vitais: {
      pressao_arterial: '130/85',
      frequencia_cardiaca: 80,
      temperatura: 36.8,
      saturacao_oxigenio: 97
    },
    intervencoes: {
      medicacao_administrada: 'Dipirona 1g - via oral',
      orientacoes_fornecidas: 'Dieta leve, repouso'
    },
    plano_acao: {
      data_proximo: '2023-07-27',
      hora_proximo: '11:00',
      profissional_responsavel: 'Dra. Ana Souza',
      necessidade_contato_outros: false,
      necessidade_exames: false
    },
    created_at: '2023-07-20T11:05:00'
  }
];