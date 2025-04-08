/**
 * Enum para conselhos profissionais
 */
export enum ConselhoProfissional {
  COREN = 'COREN',   // Conselho Regional de Enfermagem
  CRM = 'CRM',       // Conselho Regional de Medicina
  CREFITO = 'CREFITO', // Conselho Regional de Fisioterapia e Terapia Ocupacional
  CREFONO = 'CREFONO', // Conselho Regional de Fonoaudiologia
  CRN = 'CRN',       // Conselho Regional de Nutrição
  CRP = 'CRP',       // Conselho Regional de Psicologia
  CRF = 'CRF',       // Conselho Regional de Farmácia
}

/**
 * Enum para identificar setores que requerem conselhos profissionais
 */
export enum SetorProfissional {
  ENFERMAGEM = 1,    // ID do setor de enfermagem
  MEDICO = 2,        // ID do setor médico
  FISIOTERAPIA = 3,  // ID do setor de fisioterapia
  FONOAUDIOLOGIA = 4, // ID do setor de fonoaudiologia
  NUTRICAO = 5,      // ID do setor de nutrição
  PSICOLOGIA = 6,    // ID do setor de psicologia
  FARMACIA = 7,      // ID do setor de farmácia
}

/**
 * Mapeamento entre setores e conselhos profissionais
 */
export const SETOR_CONSELHO_MAP: Record<SetorProfissional, ConselhoProfissional> = {
  [SetorProfissional.ENFERMAGEM]: ConselhoProfissional.COREN,
  [SetorProfissional.MEDICO]: ConselhoProfissional.CRM,
  [SetorProfissional.FISIOTERAPIA]: ConselhoProfissional.CREFITO,
  [SetorProfissional.FONOAUDIOLOGIA]: ConselhoProfissional.CREFONO,
  [SetorProfissional.NUTRICAO]: ConselhoProfissional.CRN,
  [SetorProfissional.PSICOLOGIA]: ConselhoProfissional.CRP,
  [SetorProfissional.FARMACIA]: ConselhoProfissional.CRF,
};

/**
 * Enum para funções que exigem registro profissional, agrupadas por setor
 */
export enum FuncoesComRegistro {
  // Setor de Enfermagem - COREN
  ESCALA_PLANTOES = 101,
  SUPERVISAO_ENFERMAGEM = 102,
  TREINAMENTO_TECNICO = 103,
  AVALIACAO_PACIENTES_ENFERMAGEM = 104,
  
  // Setor Médico - CRM
  AVALIACAO_CLINICA = 201,
  PRESCRICAO_TRATAMENTOS = 202,
  ACOMPANHAMENTO_MEDICO = 203,
  EMISSAO_LAUDOS = 204,
  
  // Setor de Fisioterapia - CREFITO
  AVALIACAO_MOTORA = 301,
  PLANOS_TERAPEUTICOS = 302,
  SESSOES_DOMICILIARES = 303,
  REAVALIACAO_PERIODICA = 304,
  
  // Setor de Fonoaudiologia - CREFONO
  AVALIACAO_FONOAUDIOLOGICA = 401,
  SESSOES_REABILITACAO = 402,
  RELATORIOS_EVOLUCAO_FONO = 403,
  ORIENTACAO_FAMILIAR_FONO = 404,
  
  // Setor de Nutrição - CRN
  AVALIACAO_NUTRICIONAL = 501,
  ELABORACAO_DIETAS = 502,
  ACOMPANHAMENTO_NUTRICIONAL = 503,
  SUPORTE_CUIDADOR = 504,
  
  // Setor de Psicologia - CRP
  AVALIACAO_PSICOLOGICA = 601,
  APOIO_PACIENTE = 602,
  APOIO_FAMILIA = 603,
  RELATORIOS_EVOLUCAO_PSI = 604,
  
  // Setor de Farmácia - CRF
  DISPENSACAO_MEDICAMENTOS = 701,
  CONFERENCIA_PRESCRICOES = 702,
  ORIENTACAO_FARMACEUTICA = 703,
}

// Mapeamento entre função e setor
export const FUNCAO_SETOR_MAP: Record<FuncoesComRegistro, SetorProfissional> = {
  // Enfermagem
  [FuncoesComRegistro.ESCALA_PLANTOES]: SetorProfissional.ENFERMAGEM,
  [FuncoesComRegistro.SUPERVISAO_ENFERMAGEM]: SetorProfissional.ENFERMAGEM,
  [FuncoesComRegistro.TREINAMENTO_TECNICO]: SetorProfissional.ENFERMAGEM,
  [FuncoesComRegistro.AVALIACAO_PACIENTES_ENFERMAGEM]: SetorProfissional.ENFERMAGEM,
  
  // Médico
  [FuncoesComRegistro.AVALIACAO_CLINICA]: SetorProfissional.MEDICO,
  [FuncoesComRegistro.PRESCRICAO_TRATAMENTOS]: SetorProfissional.MEDICO,
  [FuncoesComRegistro.ACOMPANHAMENTO_MEDICO]: SetorProfissional.MEDICO,
  [FuncoesComRegistro.EMISSAO_LAUDOS]: SetorProfissional.MEDICO,
  
  // Fisioterapia
  [FuncoesComRegistro.AVALIACAO_MOTORA]: SetorProfissional.FISIOTERAPIA,
  [FuncoesComRegistro.PLANOS_TERAPEUTICOS]: SetorProfissional.FISIOTERAPIA,
  [FuncoesComRegistro.SESSOES_DOMICILIARES]: SetorProfissional.FISIOTERAPIA,
  [FuncoesComRegistro.REAVALIACAO_PERIODICA]: SetorProfissional.FISIOTERAPIA,
  
  // Fonoaudiologia
  [FuncoesComRegistro.AVALIACAO_FONOAUDIOLOGICA]: SetorProfissional.FONOAUDIOLOGIA,
  [FuncoesComRegistro.SESSOES_REABILITACAO]: SetorProfissional.FONOAUDIOLOGIA,
  [FuncoesComRegistro.RELATORIOS_EVOLUCAO_FONO]: SetorProfissional.FONOAUDIOLOGIA,
  [FuncoesComRegistro.ORIENTACAO_FAMILIAR_FONO]: SetorProfissional.FONOAUDIOLOGIA,
  
  // Nutrição
  [FuncoesComRegistro.AVALIACAO_NUTRICIONAL]: SetorProfissional.NUTRICAO,
  [FuncoesComRegistro.ELABORACAO_DIETAS]: SetorProfissional.NUTRICAO,
  [FuncoesComRegistro.ACOMPANHAMENTO_NUTRICIONAL]: SetorProfissional.NUTRICAO,
  [FuncoesComRegistro.SUPORTE_CUIDADOR]: SetorProfissional.NUTRICAO,
  
  // Psicologia
  [FuncoesComRegistro.AVALIACAO_PSICOLOGICA]: SetorProfissional.PSICOLOGIA,
  [FuncoesComRegistro.APOIO_PACIENTE]: SetorProfissional.PSICOLOGIA,
  [FuncoesComRegistro.APOIO_FAMILIA]: SetorProfissional.PSICOLOGIA,
  [FuncoesComRegistro.RELATORIOS_EVOLUCAO_PSI]: SetorProfissional.PSICOLOGIA,
  
  // Farmácia
  [FuncoesComRegistro.DISPENSACAO_MEDICAMENTOS]: SetorProfissional.FARMACIA,
  [FuncoesComRegistro.CONFERENCIA_PRESCRICOES]: SetorProfissional.FARMACIA,
  [FuncoesComRegistro.ORIENTACAO_FARMACEUTICA]: SetorProfissional.FARMACIA,
};

/**
 * Configuração detalhada das funções que exigem registro, com informações adicionais
 */
export const FUNCOES_DETALHES: Record<FuncoesComRegistro, {
  nome: string;
  setorId: SetorProfissional;
  conselho: ConselhoProfissional;
}> = {
  // Enfermagem - COREN
  [FuncoesComRegistro.ESCALA_PLANTOES]: {
    nome: 'Escala de plantões',
    setorId: SetorProfissional.ENFERMAGEM,
    conselho: ConselhoProfissional.COREN,
  },
  [FuncoesComRegistro.SUPERVISAO_ENFERMAGEM]: {
    nome: 'Supervisão de enfermagem',
    setorId: SetorProfissional.ENFERMAGEM,
    conselho: ConselhoProfissional.COREN,
  },
  [FuncoesComRegistro.TREINAMENTO_TECNICO]: {
    nome: 'Treinamento técnico',
    setorId: SetorProfissional.ENFERMAGEM,
    conselho: ConselhoProfissional.COREN,
  },
  [FuncoesComRegistro.AVALIACAO_PACIENTES_ENFERMAGEM]: {
    nome: 'Avaliação de pacientes',
    setorId: SetorProfissional.ENFERMAGEM,
    conselho: ConselhoProfissional.COREN,
  },
  
  // Médico - CRM
  [FuncoesComRegistro.AVALIACAO_CLINICA]: {
    nome: 'Avaliação clínica',
    setorId: SetorProfissional.MEDICO,
    conselho: ConselhoProfissional.CRM,
  },
  [FuncoesComRegistro.PRESCRICAO_TRATAMENTOS]: {
    nome: 'Prescrição de tratamentos',
    setorId: SetorProfissional.MEDICO,
    conselho: ConselhoProfissional.CRM,
  },
  [FuncoesComRegistro.ACOMPANHAMENTO_MEDICO]: {
    nome: 'Acompanhamento médico',
    setorId: SetorProfissional.MEDICO,
    conselho: ConselhoProfissional.CRM,
  },
  [FuncoesComRegistro.EMISSAO_LAUDOS]: {
    nome: 'Emissão de laudos',
    setorId: SetorProfissional.MEDICO,
    conselho: ConselhoProfissional.CRM,
  },
  
  // Fisioterapia - CREFITO
  [FuncoesComRegistro.AVALIACAO_MOTORA]: {
    nome: 'Avaliação motora',
    setorId: SetorProfissional.FISIOTERAPIA,
    conselho: ConselhoProfissional.CREFITO,
  },
  [FuncoesComRegistro.PLANOS_TERAPEUTICOS]: {
    nome: 'Planos terapêuticos',
    setorId: SetorProfissional.FISIOTERAPIA,
    conselho: ConselhoProfissional.CREFITO,
  },
  [FuncoesComRegistro.SESSOES_DOMICILIARES]: {
    nome: 'Sessões domiciliares',
    setorId: SetorProfissional.FISIOTERAPIA,
    conselho: ConselhoProfissional.CREFITO,
  },
  [FuncoesComRegistro.REAVALIACAO_PERIODICA]: {
    nome: 'Reavaliação periódica',
    setorId: SetorProfissional.FISIOTERAPIA,
    conselho: ConselhoProfissional.CREFITO,
  },
  
  // Fonoaudiologia - CREFONO
  [FuncoesComRegistro.AVALIACAO_FONOAUDIOLOGICA]: {
    nome: 'Avaliação fonoaudiológica',
    setorId: SetorProfissional.FONOAUDIOLOGIA,
    conselho: ConselhoProfissional.CREFONO,
  },
  [FuncoesComRegistro.SESSOES_REABILITACAO]: {
    nome: 'Sessões de reabilitação',
    setorId: SetorProfissional.FONOAUDIOLOGIA,
    conselho: ConselhoProfissional.CREFONO,
  },
  [FuncoesComRegistro.RELATORIOS_EVOLUCAO_FONO]: {
    nome: 'Relatórios de evolução',
    setorId: SetorProfissional.FONOAUDIOLOGIA,
    conselho: ConselhoProfissional.CREFONO,
  },
  [FuncoesComRegistro.ORIENTACAO_FAMILIAR_FONO]: {
    nome: 'Orientação familiar',
    setorId: SetorProfissional.FONOAUDIOLOGIA,
    conselho: ConselhoProfissional.CREFONO,
  },
  
  // Nutrição - CRN
  [FuncoesComRegistro.AVALIACAO_NUTRICIONAL]: {
    nome: 'Avaliação nutricional',
    setorId: SetorProfissional.NUTRICAO,
    conselho: ConselhoProfissional.CRN,
  },
  [FuncoesComRegistro.ELABORACAO_DIETAS]: {
    nome: 'Elaboração de dietas',
    setorId: SetorProfissional.NUTRICAO,
    conselho: ConselhoProfissional.CRN,
  },
  [FuncoesComRegistro.ACOMPANHAMENTO_NUTRICIONAL]: {
    nome: 'Acompanhamento nutricional',
    setorId: SetorProfissional.NUTRICAO,
    conselho: ConselhoProfissional.CRN,
  },
  [FuncoesComRegistro.SUPORTE_CUIDADOR]: {
    nome: 'Suporte ao cuidador',
    setorId: SetorProfissional.NUTRICAO,
    conselho: ConselhoProfissional.CRN,
  },
  
  // Psicologia - CRP
  [FuncoesComRegistro.AVALIACAO_PSICOLOGICA]: {
    nome: 'Avaliação psicológica',
    setorId: SetorProfissional.PSICOLOGIA,
    conselho: ConselhoProfissional.CRP,
  },
  [FuncoesComRegistro.APOIO_PACIENTE]: {
    nome: 'Apoio ao paciente',
    setorId: SetorProfissional.PSICOLOGIA,
    conselho: ConselhoProfissional.CRP,
  },
  [FuncoesComRegistro.APOIO_FAMILIA]: {
    nome: 'Apoio à família',
    setorId: SetorProfissional.PSICOLOGIA,
    conselho: ConselhoProfissional.CRP,
  },
  [FuncoesComRegistro.RELATORIOS_EVOLUCAO_PSI]: {
    nome: 'Relatórios de evolução',
    setorId: SetorProfissional.PSICOLOGIA,
    conselho: ConselhoProfissional.CRP,
  },
  
  // Farmácia - CRF
  [FuncoesComRegistro.DISPENSACAO_MEDICAMENTOS]: {
    nome: 'Dispensação de medicamentos',
    setorId: SetorProfissional.FARMACIA,
    conselho: ConselhoProfissional.CRF,
  },
  [FuncoesComRegistro.CONFERENCIA_PRESCRICOES]: {
    nome: 'Conferência de prescrições',
    setorId: SetorProfissional.FARMACIA,
    conselho: ConselhoProfissional.CRF,
  },
  [FuncoesComRegistro.ORIENTACAO_FARMACEUTICA]: {
    nome: 'Orientação farmacêutica',
    setorId: SetorProfissional.FARMACIA,
    conselho: ConselhoProfissional.CRF,
  },
};