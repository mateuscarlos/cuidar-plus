import { Funcao, Funcao_Com_Registro } from '../../features/usuarios/models/funcao.model';
import { FuncoesComRegistro } from '../../features/usuarios/models/conselhos-profissionais.model';

export const FUNCOES_MOCK: Funcao[] = [
  {
    id: FuncoesComRegistro.ESCALA_PLANTOES,
    setor_id: 1,
    nome: 'Escala de plantões',
    conselho_profissional: 'COREN'
  },
  {
    id: FuncoesComRegistro.SUPERVISAO_ENFERMAGEM,
    setor_id: 1,
    nome: 'Supervisão de enfermagem',
    conselho_profissional: 'COREN'
  },
  {
    id: FuncoesComRegistro.AVALIACAO_CLINICA,
    setor_id: 2,
    nome: 'Avaliação clínica',
    conselho_profissional: 'CRM'
  },
  {
    id: FuncoesComRegistro.PRESCRICAO_TRATAMENTOS,
    setor_id: 2,
    nome: 'Prescrição de tratamentos',
    conselho_profissional: 'CRM'
  },
  {
    id: FuncoesComRegistro.AVALIACAO_MOTORA,
    setor_id: 3,
    nome: 'Avaliação motora',
    conselho_profissional: 'CREFITO'
  },
  {
    id: FuncoesComRegistro.AVALIACAO_FONOAUDIOLOGICA,
    setor_id: 4,
    nome: 'Avaliação fonoaudiológica',
    conselho_profissional: 'CREFONO'
  },
  {
    id: FuncoesComRegistro.AVALIACAO_NUTRICIONAL,
    setor_id: 5,
    nome: 'Avaliação nutricional',
    conselho_profissional: 'CRN'
  },
  {
    id: FuncoesComRegistro.AVALIACAO_PSICOLOGICA,
    setor_id: 6,
    nome: 'Avaliação psicológica',
    conselho_profissional: 'CRP'
  },
  {
    id: FuncoesComRegistro.DISPENSACAO_MEDICAMENTOS,
    setor_id: 7,
    nome: 'Dispensação de medicamentos',
    conselho_profissional: 'CRF'
  },
  {
    id: 28,
    setor_id: 8,
    nome: 'Coordenação administrativa'
  },
  {
    id: 29,
    setor_id: 9,
    nome: 'Recepcionista'
  }
];

export const FUNCOES_COM_REGISTRO: Funcao_Com_Registro[] = FUNCOES_MOCK
  .filter(f => f.conselho_profissional)
  .map(f => ({
    id: f.id,
    nome: f.nome
  }));

export const MOCK_FUNCAO_MEDICA = FUNCOES_MOCK[2];
export const MOCK_FUNCAO_ENFERMAGEM = FUNCOES_MOCK[0];
export const MOCK_FUNCAO_ADMIN = FUNCOES_MOCK[9];