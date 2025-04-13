import { Paciente, StatusPaciente } from '../../features/pacientes/models/paciente.model';

interface Endereco {
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade?: string;
  estado?: string;
  localidade?: string;
  uf?: string;
  cep: string;
}

const enderecoMock: Endereco = {
  logradouro: 'Rua Teste',
  numero: '123',
  complemento: 'Apto 101',
  bairro: 'Centro',
  localidade: 'São Paulo',
  uf: 'SP',
  cep: '12345-678'
};

export const PACIENTES_MOCK: Paciente[] = [
  {
    id: 12345,
    nome_completo: 'Maria Rodrigues Silva',
    cpf: '12345678901',
    data_nascimento: '1980-05-15',
    genero: 'Feminino',
    estado_civil: 'Casado(a)',
    profissao: 'Professora',
    nacionalidade: 'Brasileira',
    telefone: '(11) 99999-8888',
    telefone_secundario: '(11) 99999-7777',
    email: 'maria.rodrigues@email.com',
    endereco: {
      logradouro: 'Rua das Flores',
      numero: '123',
      complemento: 'Apto 45',
      bairro: 'Jardim Primavera',
      cidade: 'São Paulo',
      estado: 'SP',
      localidade: 'São Paulo',
      uf: 'SP',
      cep: '01234-567'
    },
    status: StatusPaciente.ATIVO,
    cid_primario: 'I10',
    cid_secundario: 'E11',
    acomodacao: 'Apartamento',
    alergias: 'Penicilina, Dipirona',
    convenio_id: 1,
    plano_id: 2,
    numero_carteirinha: '987654321',
    data_validade: '2024-12-31',
    contato_emergencia: 'João Rodrigues',
    telefone_emergencia: '(11) 98765-4321',
    case_responsavel: 'Dr. Carlos Mendes',
    medico_responsavel: 'Dra. Ana Souza',
    created_at: '2023-01-15T10:30:00',
    updated_at: '2023-03-22T14:45:00'
  },
  {
    id: 12346,
    nome_completo: 'João Silva Pereira',
    cpf: '98765432101',
    data_nascimento: '1975-08-22',
    genero: 'Masculino',
    estado_civil: 'Solteiro(a)',
    profissao: 'Engenheiro',
    nacionalidade: 'Brasileira',
    telefone: '(11) 98888-7777',
    endereco: {
      logradouro: 'Av. Paulista',
      numero: '1500',
      bairro: 'Bela Vista',
      cidade: 'São Paulo',
      estado: 'SP',
      localidade: 'São Paulo',
      uf: 'SP',
      cep: '04123-000'
    },
    status: StatusPaciente.EM_AVALIACAO,
    cid_primario: 'K29',
    cid_secundario: undefined,
    acomodacao: 'Enfermaria',
    alergias: 'Nenhuma',
    convenio_id: undefined,
    plano_id: undefined,
    numero_carteirinha: undefined,
    data_validade: undefined,
    contato_emergencia: undefined,
    telefone_emergencia: undefined,
    case_responsavel: undefined,
    medico_responsavel: 'Dra. Marina Costa',
    created_at: '2023-02-10T08:15:00',
    updated_at: '2023-02-10T08:15:00'
  },
  {
    id: 12347,
    nome_completo: 'Maria Santos Costa',
    cpf: '45678912301',
    data_nascimento: '1990-03-10',
    genero: 'Feminino',
    estado_civil: 'Divorciado(a)',
    profissao: 'Designer',
    nacionalidade: 'Brasileira',
    telefone: '(11) 97777-6666',
    endereco: {
      logradouro: 'Rua Augusta',
      numero: '789',
      complemento: 'Bloco B',
      bairro: 'Consolação',
      cidade: 'São Paulo',
      estado: 'SP',
      localidade: 'São Paulo',
      uf: 'SP',
      cep: '01305-000'
    },
    status: StatusPaciente.ATIVO,
    cid_primario: 'J45',
    cid_secundario: undefined,
    acomodacao: 'Apartamento',
    alergias: 'Nenhuma',
    convenio_id: 4,
    plano_id: 7,
    numero_carteirinha: '123456789',
    data_validade: '2025-06-30',
    contato_emergencia: 'Carlos Santos',
    telefone_emergencia: '(11) 96666-5555',
    case_responsavel: 'Dra. Márcia Lima',
    medico_responsavel: 'Dr. Roberto Oliveira',
    created_at: '2023-03-05T14:20:00',
    updated_at: '2023-03-18T09:30:00'
  }
];

//gere mais pacientes em todos os cenários possiveis de testes de validação

// Exportação de um paciente específico para testes
export const MOCK_PACIENTE_ATIVO = PACIENTES_MOCK[0];
export const MOCK_PACIENTE_EM_AVALIACAO = PACIENTES_MOCK[1];
export const MOCK_PACIENTE_SEM_CONVENIO = PACIENTES_MOCK[1];