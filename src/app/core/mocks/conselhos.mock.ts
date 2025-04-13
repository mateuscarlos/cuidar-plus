import { ConselhoProfissional } from '../../features/usuarios/models/conselhos-profissionais.model';

export interface ConselhoMock {
  sigla: ConselhoProfissional;
  nome: string;
  descricao: string;
}

export const CONSELHOS_MOCK: ConselhoMock[] = [
  {
    sigla: ConselhoProfissional.COREN,
    nome: 'Conselho Regional de Enfermagem',
    descricao: 'Registro para profissionais de enfermagem'
  },
  {
    sigla: ConselhoProfissional.CRM,
    nome: 'Conselho Regional de Medicina',
    descricao: 'Registro para médicos'
  },
  {
    sigla: ConselhoProfissional.CREFITO,
    nome: 'Conselho Regional de Fisioterapia e Terapia Ocupacional',
    descricao: 'Registro para fisioterapeutas e terapeutas ocupacionais'
  },
  {
    sigla: ConselhoProfissional.CREFONO,
    nome: 'Conselho Regional de Fonoaudiologia',
    descricao: 'Registro para fonoaudiólogos'
  },
  {
    sigla: ConselhoProfissional.CRN,
    nome: 'Conselho Regional de Nutrição',
    descricao: 'Registro para nutricionistas'
  },
  {
    sigla: ConselhoProfissional.CRP,
    nome: 'Conselho Regional de Psicologia',
    descricao: 'Registro para psicólogos'
  },
  {
    sigla: ConselhoProfissional.CRF,
    nome: 'Conselho Regional de Farmácia',
    descricao: 'Registro para farmacêuticos'
  }
];

export const MOCK_CONSELHO_CRM = CONSELHOS_MOCK[1];
export const MOCK_CONSELHO_COREN = CONSELHOS_MOCK[0];