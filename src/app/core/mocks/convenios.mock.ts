import { Convenio } from '../../features/pacientes/models/convenio.model';
import { Plano } from '../../features/pacientes/models/plano.model';

export const CONVENIOS_MOCK: Convenio[] = [
  {
    id: 1,
    nome: 'Unimed',
    codigo: 'UN001',
    tipo: 'Privado',
    ativo: true,
    created_at: '2023-01-10T08:00:00',
    updated_at: '2023-01-10T08:00:00'
  },
  {
    id: 2,
    nome: 'Bradesco Saúde',
    codigo: 'BR002',
    tipo: 'Privado',
    ativo: true,
    created_at: '2023-01-15T09:30:00',
    updated_at: '2023-02-20T14:15:00'
  },
  {
    id: 3,
    nome: 'Amil',
    codigo: 'AM003',
    tipo: 'Privado',
    ativo: true,
    created_at: '2023-01-20T10:45:00',
    updated_at: '2023-01-20T10:45:00'
  },
  {
    id: 4,
    nome: 'SulAmérica',
    codigo: 'SA004',
    tipo: 'Privado',
    ativo: true,
    created_at: '2023-02-05T11:20:00',
    updated_at: '2023-02-05T11:20:00'
  },
  {
    id: 5,
    nome: 'NotreDame Intermédica',
    codigo: 'ND005',
    tipo: 'Privado',
    ativo: false,
    created_at: '2023-02-10T13:40:00',
    updated_at: '2023-03-01T08:30:00'
  }
];

export const PLANOS_MOCK: Plano[] = [
  { id: 1, nome: 'Básico', convenio_id: 1, ativo: true },
  { id: 2, nome: 'Intermediário', convenio_id: 1, ativo: true },
  { id: 3, nome: 'Premium', convenio_id: 1, ativo: true },
  { id: 4, nome: 'Essencial', convenio_id: 2, ativo: true },
  { id: 5, nome: 'Exclusivo', convenio_id: 2, ativo: true },
  { id: 6, nome: 'Total', convenio_id: 3, ativo: true },
  { id: 7, nome: 'Nacional', convenio_id: 4, ativo: true }
];

export const MOCK_CONVENIO_ATIVO = CONVENIOS_MOCK[0];
export const MOCK_CONVENIO_INATIVO = CONVENIOS_MOCK[4];