import { Setor } from '../../features/usuarios/models/setor.model';
import { SetorProfissional } from '../../features/usuarios/models/conselhos-profissionais.model';

export const SETORES_MOCK: Setor[] = [
  {
    id: SetorProfissional.ENFERMAGEM,
    nome: 'Enfermagem'
  },
  {
    id: SetorProfissional.MEDICO,
    nome: 'Médico'
  },
  {
    id: SetorProfissional.FISIOTERAPIA,
    nome: 'Fisioterapia'
  },
  {
    id: SetorProfissional.FONOAUDIOLOGIA,
    nome: 'Fonoaudiologia'
  },
  {
    id: SetorProfissional.NUTRICAO,
    nome: 'Nutrição'
  },
  {
    id: SetorProfissional.PSICOLOGIA,
    nome: 'Psicologia'
  },
  {
    id: SetorProfissional.FARMACIA,
    nome: 'Farmácia'
  },
  {
    id: 8,
    nome: 'Administrativo'
  },
  {
    id: 9,
    nome: 'Recepção'
  }
];

export const MOCK_SETOR_ENFERMAGEM = SETORES_MOCK[0];
export const MOCK_SETOR_MEDICO = SETORES_MOCK[1];
export const MOCK_SETOR_FISIOTERAPIA = SETORES_MOCK[2];