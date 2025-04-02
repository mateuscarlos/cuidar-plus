import { Convenio, Plano } from '../../features/pacientes/models/convenio.model';

export const CONVENIOS_MOCK: Convenio[] = [
  { id: 1, nome: 'Amil' },
  { id: 2, nome: 'Bradesco Saúde' },
  { id: 3, nome: 'SulAmérica' },
  { id: 4, nome: 'Unimed' }
];

export const PLANOS_MOCK: Plano[] = [
  { id: 1, nome: 'Básico', convenio_id: 1 },
  { id: 2, nome: 'Intermediário', convenio_id: 1 },
  { id: 3, nome: 'Premium', convenio_id: 1 },
  { id: 4, nome: 'Essencial', convenio_id: 2 },
  { id: 5, nome: 'Exclusivo', convenio_id: 2 },
  { id: 6, nome: 'Total', convenio_id: 3 },
  { id: 7, nome: 'Nacional', convenio_id: 4 }
];