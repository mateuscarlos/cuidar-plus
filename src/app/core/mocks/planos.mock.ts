import { Plano } from '../../features/pacientes/models/plano.model';

export const PLANOS_MOCK: Plano[] = [
  {
    id: 1,
    convenio_id: 1,
    nome: 'Unimed Essencial',
    codigo: 'UE001',
    tipo_acomodacao: 'Enfermaria',
    ativo: true,
    created_at: '2023-01-12T08:30:00',
    updated_at: '2023-01-12T08:30:00',
    convenio: {
      id: 1,
      nome: 'Unimed'
    }
  },
  {
    id: 2,
    convenio_id: 1,
    nome: 'Unimed Premium',
    codigo: 'UP002',
    tipo_acomodacao: 'Apartamento',
    ativo: true,
    created_at: '2023-01-12T09:15:00',
    updated_at: '2023-01-12T09:15:00',
    convenio: {
      id: 1,
      nome: 'Unimed'
    }
  },
  {
    id: 3,
    convenio_id: 2,
    nome: 'Bradesco Saúde Nacional',
    codigo: 'BSN003',
    tipo_acomodacao: 'Enfermaria',
    ativo: true,
    created_at: '2023-01-18T10:20:00',
    updated_at: '2023-01-18T10:20:00',
    convenio: {
      id: 2,
      nome: 'Bradesco Saúde'
    }
  },
  {
    id: 4,
    convenio_id: 2,
    nome: 'Bradesco Saúde Top',
    codigo: 'BST004',
    tipo_acomodacao: 'Apartamento',
    ativo: true,
    created_at: '2023-01-18T10:45:00',
    updated_at: '2023-03-10T14:30:00',
    convenio: {
      id: 2,
      nome: 'Bradesco Saúde'
    }
  },
  {
    id: 5,
    convenio_id: 3,
    nome: 'Amil 400',
    codigo: 'A400',
    tipo_acomodacao: 'Enfermaria',
    ativo: true,
    created_at: '2023-01-25T13:10:00',
    updated_at: '2023-01-25T13:10:00',
    convenio: {
      id: 3,
      nome: 'Amil'
    }
  },
  {
    id: 6,
    convenio_id: 3,
    nome: 'Amil 700',
    codigo: 'A700',
    tipo_acomodacao: 'Apartamento',
    ativo: false,
    created_at: '2023-01-25T13:30:00',
    updated_at: '2023-03-05T09:45:00',
    convenio: {
      id: 3,
      nome: 'Amil'
    }
  },
  {
    id: 7,
    convenio_id: 4,
    nome: 'SulAmérica Especial 100',
    codigo: 'SAE100',
    tipo_acomodacao: 'Apartamento',
    ativo: true,
    created_at: '2023-02-08T11:20:00',
    updated_at: '2023-02-08T11:20:00',
    convenio: {
      id: 4,
      nome: 'SulAmérica'
    }
  }
];

export const MOCK_PLANO_ATIVO = PLANOS_MOCK[0];
export const MOCK_PLANO_INATIVO = PLANOS_MOCK[5];
export const MOCK_PLANO_APARTAMENTO = PLANOS_MOCK[1];
export const MOCK_PLANO_ENFERMARIA = PLANOS_MOCK[0];