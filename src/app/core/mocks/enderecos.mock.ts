import { Endereco } from '../../features/pacientes/models/endereco.model';

export const ENDERECOS_MOCK: Endereco[] = [
  {
    logradouro: 'Avenida Paulista',
    numero: '1000',
    complemento: 'Apto 501',
    bairro: 'Bela Vista',
    cidade: 'São Paulo',
    localidade: 'São Paulo',
    estado: 'São Paulo',
    uf: 'SP',
    cep: '01310-100',
    ddd: '11'
  },
  {
    logradouro: 'Rua Oscar Freire',
    numero: '123',
    complemento: 'Sala 205',
    bairro: 'Jardins',
    cidade: 'São Paulo',
    localidade: 'São Paulo',
    estado: 'São Paulo',
    uf: 'SP',
    cep: '01426-001',
    ddd: '11'
  },
  {
    logradouro: 'Avenida Atlântica',
    numero: '500',
    complemento: 'Cobertura 1',
    bairro: 'Copacabana',
    cidade: 'Rio de Janeiro',
    localidade: 'Rio de Janeiro',
    estado: 'Rio de Janeiro',
    uf: 'RJ',
    cep: '22010-000',
    ddd: '21'
  },
  {
    logradouro: 'Rua Padre Chagas',
    numero: '342',
    bairro: 'Moinhos de Vento',
    cidade: 'Porto Alegre',
    localidade: 'Porto Alegre',
    estado: 'Rio Grande do Sul',
    uf: 'RS',
    cep: '90570-080',
    ddd: '51'
  },
  {
    logradouro: 'Avenida do Contorno',
    numero: '6500',
    complemento: 'Bloco B, Sala 301',
    bairro: 'Savassi',
    cidade: 'Belo Horizonte',
    localidade: 'Belo Horizonte',
    estado: 'Minas Gerais',
    uf: 'MG',
    cep: '30110-017',
    ddd: '31'
  }
];

export const MOCK_ENDERECO_SP = ENDERECOS_MOCK[0];
export const MOCK_ENDERECO_RJ = ENDERECOS_MOCK[2];
export const MOCK_ENDERECO_COMERCIAL = ENDERECOS_MOCK[1];
export const MOCK_ENDERECO_RESIDENCIAL = ENDERECOS_MOCK[0];