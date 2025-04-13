import { Usuario, TipoAcesso, TipoContratacao } from '../../features/usuarios/models/user.model';
import { ConselhoProfissional } from '../../features/usuarios/models/conselhos-profissionais.model';

export const USUARIOS_MOCK: Usuario[] = [
  {
    id: 1,
    nome: 'Dr. Carlos Silva',
    email: 'carlos.silva@cuidarplus.com',
    cpf: '12345678900',
    telefone: '(11) 98765-4321',
    setor: 2, // Médico
    setorNome: 'Médico',
    funcao: 5, // Avaliação Clínica
    funcaoNome: 'Avaliação Clínica',
    registro_categoria: 'CRM 54321',
    especialidade: 'Clínico Geral',
    endereco: {
      logradouro: 'Avenida Paulista',
      numero: '1500',
      complemento: 'Conjunto 1010',
      bairro: 'Bela Vista',
      localidade: 'São Paulo',
      uf: 'SP',
      cep: '01310-100'
    },
    data_admissao: '2022-03-15',
    tipo_contratacao: 'c',
    tipoContratacao: 'Contratada',
    tipo_acesso: 'gestor',
    tipoAcesso: 'Gestor',
    status: 'ATIVO',
    ativo: true,
    statusFormatado: 'Ativo',
    created_at: '2022-03-15T10:30:00',
    updated_at: '2023-05-20T14:15:00'
  },
  {
    id: 2,
    nome: 'Enf. Ana Oliveira',
    email: 'ana.oliveira@cuidarplus.com',
    cpf: '98765432100',
    telefone: '(11) 91234-5678',
    setor: 1, // Enfermagem
    setorNome: 'Enfermagem',
    funcao: 1, // Escala de Plantões
    funcaoNome: 'Escala de Plantões',
    registro_categoria: 'COREN 12345',
    endereco: {
      logradouro: 'Rua Augusta',
      numero: '678',
      bairro: 'Consolação',
      localidade: 'São Paulo',
      uf: 'SP',
      cep: '01305-000'
    },
    data_admissao: '2022-02-10',
    tipo_contratacao: 'c',
    tipoContratacao: 'Contratada',
    tipo_acesso: 'padrao',
    tipoAcesso: 'Padrão',
    status: 'ATIVO',
    ativo: true,
    statusFormatado: 'Ativo',
    created_at: '2022-02-10T09:15:00',
    updated_at: '2023-01-05T11:30:00'
  },
  {
    id: 3,
    nome: 'Dr. Roberto Almeida',
    email: 'roberto.almeida@cuidarplus.com',
    cpf: '45678912300',
    telefone: '(11) 99876-5432',
    setor: 2, // Médico
    setorNome: 'Médico',
    funcao: 6, // Prescrição de Tratamentos
    funcaoNome: 'Prescrição de Tratamentos',
    registro_categoria: 'CRM 67890',
    especialidade: 'Neurologia',
    endereco: {
      logradouro: 'Alameda Santos',
      numero: '1200',
      complemento: 'Sala 502',
      bairro: 'Jardim Paulista',
      localidade: 'São Paulo',
      uf: 'SP',
      cep: '01419-001'
    },
    data_admissao: '2022-04-01',
    tipo_contratacao: 'p',
    tipoContratacao: 'Pessoa Jurídica',
    tipo_acesso: 'padrao',
    tipoAcesso: 'Padrão',
    status: 'FERIAS',
    ativo: true,
    statusFormatado: 'Férias',
    created_at: '2022-04-01T08:00:00',
    updated_at: '2023-06-10T16:45:00'
  },
  {
    id: 4,
    nome: 'Natália Costa',
    email: 'natalia.costa@cuidarplus.com',
    cpf: '78912345600',
    telefone: '(11) 95555-9999',
    setor: 5, // Nutrição
    setorNome: 'Nutrição',
    funcao: 17, // Avaliação Nutricional
    funcaoNome: 'Avaliação Nutricional',
    registro_categoria: 'CRN 9876',
    endereco: {
      logradouro: 'Rua Haddock Lobo',
      numero: '595',
      bairro: 'Cerqueira César',
      localidade: 'São Paulo',
      uf: 'SP',
      cep: '01414-001'
    },
    data_admissao: '2022-05-15',
    tipo_contratacao: 't',
    tipoContratacao: 'Terceirizado',
    tipo_acesso: 'padrao',
    tipoAcesso: 'Padrão',
    status: 'INATIVO',
    ativo: false,
    statusFormatado: 'Inativo',
    created_at: '2022-05-15T10:00:00',
    updated_at: '2023-04-20T13:10:00'
  },
  {
    id: 5,
    nome: 'Admin Sistema',
    email: 'admin@cuidarplus.com',
    cpf: '11122233344',
    telefone: '(11) 98888-7777',
    setor: undefined,
    funcao: undefined,
    endereco: {
      logradouro: 'Avenida Brigadeiro Faria Lima',
      numero: '3900',
      complemento: 'Andar 18',
      bairro: 'Itaim Bibi',
      localidade: 'São Paulo',
      uf: 'SP',
      cep: '04538-132'
    },
    tipo_acesso: 'admin',
    tipoAcesso: 'Administrador',
    status: 'ATIVO',
    ativo: true,
    statusFormatado: 'Ativo',
    created_at: '2022-01-01T00:00:00',
    updated_at: '2022-01-01T00:00:00'
  }
];

export const MOCK_USUARIO_MEDICO = USUARIOS_MOCK[0];
export const MOCK_USUARIO_ENFERMEIRO = USUARIOS_MOCK[1];
export const MOCK_USUARIO_FERIAS = USUARIOS_MOCK[2];
export const MOCK_USUARIO_INATIVO = USUARIOS_MOCK[3];
export const MOCK_USUARIO_ADMIN = USUARIOS_MOCK[4];