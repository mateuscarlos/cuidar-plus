/**
 * Insurer Entity (Operadora de Saúde)
 * Representa operadoras como SulAmerica, Amil, Unimed, etc
 */

import { BaseEntity } from '@/core/types';

export enum InsurerStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}

export enum InsurerType {
  MEDICINA_GRUPO = 'MEDICINA_GRUPO', // Medicina de Grupo
  COOPERATIVA = 'COOPERATIVA', // Cooperativa Médica
  AUTOGESTAO = 'AUTOGESTAO', // Autogestão
  FILANTROPIA = 'FILANTROPIA', // Filantropia
}

export interface InsurerPlan {
  id: string;
  name: string;
  code: string;
  type: 'INDIVIDUAL' | 'EMPRESARIAL' | 'COLETIVO_ADESAO';
  coverage: string[];
  active: boolean;
  monthlyPrice?: number;
}

export interface Insurer extends BaseEntity {
  name: string;
  tradeName: string;
  cnpj: string;
  registrationNumber: string; // Número de registro na ANS
  type: InsurerType;
  status: InsurerStatus;
  
  // Dados de Contato
  phone: string;
  email: string;
  website?: string;
  
  // Endereço
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  
  // Planos oferecidos
  plans: InsurerPlan[];
  
  // Informações adicionais
  logo?: string;
  contractStartDate?: string;
  contractEndDate?: string;
  notes?: string;
}

export interface InsurerFilters {
  search?: string;
  type?: InsurerType;
  status?: InsurerStatus;
  hasActivePlans?: boolean;
  page?: number;
  pageSize?: number;
}

export interface CreateInsurerDTO {
  name: string;
  tradeName: string;
  cnpj: string;
  registrationNumber: string;
  type: InsurerType;
  phone: string;
  email: string;
  website?: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  plans?: InsurerPlan[];
  logo?: string;
  notes?: string;
}

export interface UpdateInsurerDTO {
  name?: string;
  tradeName?: string;
  phone?: string;
  email?: string;
  website?: string;
  status?: InsurerStatus;
  address?: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  plans?: InsurerPlan[];
  logo?: string;
  contractStartDate?: string;
  contractEndDate?: string;
  notes?: string;
}
