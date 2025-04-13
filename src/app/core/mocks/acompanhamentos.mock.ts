import {
  Acompanhamento,
  TipoAtendimento,
  MotivoAtendimento,
  CondicaoPaciente,
  NivelDor
} from '../../features/pacientes/models/acompanhamento.model';

export const ACOMPANHAMENTOS_MOCK: Acompanhamento[] = [
  {
    id: '1',
    created_at: '2023-05-10T14:30:00',
    paciente_id: 12345,
    data_hora_atendimento: '2023-05-10T14:00:00',
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
      data_proximo: '2023-06-10',
      hora_proximo: '14:00',
      profissional_responsavel: 'Dr. Carlos Silva',
      necessidade_contato_outros: false,
      necessidade_exames: true,
      exames_consultas: 'Exames de sangue completo e urina'
    }
  },
  {
    id: '2',
    created_at: '2023-05-20T10:15:00',
    paciente_id: 12345,
    data_hora_atendimento: '2023-05-20T10:00:00',
    tipo_atendimento: TipoAtendimento.PRESENCIAL,
    motivo_atendimento: MotivoAtendimento.QUEIXA,
    descricao_motivo: 'Dor abdominal moderada',
    condicao_paciente: CondicaoPaciente.ESTAVEL,
    nivel_dor: NivelDor.MODERADA,
    localizacao_dor: 'Região epigástrica',
    sinais_vitais: {
      pressao_arterial: '130/85',
      frequencia_cardiaca: 80,
      temperatura: 36.8,
      saturacao_oxigenio: 97
    },
    intervencoes: {
      medicacao_administrada: 'Buscopan 10mg',
      orientacoes_fornecidas: 'Alimentação leve, evitar alimentos gordurosos'
    },
    plano_acao: {
      data_proximo: '2023-05-25',
      hora_proximo: '14:00',
      profissional_responsavel: 'Dr. Carlos Silva',
      necessidade_contato_outros: false,
      necessidade_exames: true,
      exames_consultas: 'Ultrassonografia abdominal'
    }
  },
  {
    id: '3',
    created_at: '2023-05-25T14:45:00',
    paciente_id: 12346,
    data_hora_atendimento: '2023-05-25T14:30:00',
    tipo_atendimento: TipoAtendimento.TELEFONE,
    motivo_atendimento: MotivoAtendimento.DUVIDA_MEDICACAO,
    descricao_motivo: 'Dúvida sobre efeitos colaterais da medicação',
    condicao_paciente: CondicaoPaciente.ESTAVEL,
    nivel_dor: NivelDor.SEM_DOR,
    intervencoes: {
      orientacoes_fornecidas: 'Esclarecido sobre os possíveis efeitos colaterais e quando procurar atendimento médico'
    },
    plano_acao: {
      necessidade_contato_outros: false,
      necessidade_exames: false,
      outras_recomendacoes: 'Manter medicação conforme prescrito e monitorar sintomas'
    },
    comunicacao_cuidador: {
      nome_cuidador: 'Maria Santos',
      informacoes_repassadas: 'Orientações sobre efeitos colaterais da medicação',
      orientacoes_fornecidas: 'Como lidar com possíveis efeitos colaterais',
      duvidas_esclarecidas: 'Quando procurar atendimento médico'
    }
  },
  {
    id: '4',
    created_at: '2023-06-02T09:30:00',
    paciente_id: 12347,
    data_hora_atendimento: '2023-06-02T09:00:00',
    tipo_atendimento: TipoAtendimento.PRESENCIAL,
    motivo_atendimento: MotivoAtendimento.ROTINA,
    condicao_paciente: CondicaoPaciente.ESTAVEL,
    nivel_dor: NivelDor.LEVE,
    localizacao_dor: 'Articulação do joelho',
    sinais_vitais: {
      pressao_arterial: '125/80',
      frequencia_cardiaca: 70,
      temperatura: 36.5,
      saturacao_oxigenio: 99
    },
    avaliacao_feridas: {
      aspecto: 'Cicatrização adequada',
      sinais_infeccao: false,
      tipo_curativo: 'Curativo simples'
    },
    intervencoes: {
      curativo_realizado: 'Limpeza e troca de curativo',
      orientacoes_fornecidas: 'Cuidados com a ferida operatória'
    },
    plano_acao: {
      data_proximo: '2023-06-16',
      hora_proximo: '09:00',
      profissional_responsavel: 'Dr. Roberto Oliveira',
      necessidade_contato_outros: false,
      necessidade_exames: false
    }
  },
  {
    id: '5',
    created_at: '2023-06-15T11:00:00',
    paciente_id: 12346,
    data_hora_atendimento: '2023-06-15T10:30:00',
    tipo_atendimento: TipoAtendimento.INTERNET,
    motivo_atendimento: MotivoAtendimento.AGENDAMENTO,
    descricao_motivo: 'Agendamento de consulta de retorno',
    condicao_paciente: CondicaoPaciente.ESTAVEL,
    nivel_dor: NivelDor.SEM_DOR,
    plano_acao: {
      data_proximo: '2023-06-30',
      hora_proximo: '14:30',
      profissional_responsavel: 'Dra. Marina Costa',
      necessidade_contato_outros: false,
      necessidade_exames: false,
      outras_recomendacoes: 'Trazer resultados de exames anteriores'
    }
  }
];

export const MOCK_ACOMPANHAMENTO_PRESENCIAL = ACOMPANHAMENTOS_MOCK[0];
export const MOCK_ACOMPANHAMENTO_COM_DOR = ACOMPANHAMENTOS_MOCK[1];
export const MOCK_ACOMPANHAMENTO_TELEFONE = ACOMPANHAMENTOS_MOCK[2];
export const MOCK_ACOMPANHAMENTO_COM_FERIDA = ACOMPANHAMENTOS_MOCK[3];