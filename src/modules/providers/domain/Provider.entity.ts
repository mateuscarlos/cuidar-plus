/**
 * Provider Entity (Prestadora de Serviços)
 * Representa cooperativas ou prestadores de serviços de saúde
 */

import { BaseEntity } from '@/core/types';

export enum ProviderStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
}

export enum ProviderType {
  HOSPITAL = 'HOSPITAL',
  CLINICA = 'CLINICA',
  LABORATORIO = 'LABORATORIO',
  COOPERATIVA = 'COOPERATIVA',
  CONSULTORIO = 'CONSULTORIO',
  CENTRO_DIAGNOSTICO = 'CENTRO_DIAGNOSTICO',
  HOME_CARE = 'HOME_CARE',
}

export enum ProviderSpecialty {
  CARDIOLOGIA = 'CARDIOLOGIA',
  ORTOPEDIA = 'ORTOPEDIA',
  PEDIATRIA = 'PEDIATRIA',
  GINECOLOGIA = 'GINECOLOGIA',
  NEUROLOGIA = 'NEUROLOGIA',
  PSIQUIATRIA = 'PSIQUIATRIA',
  DERMATOLOGIA = 'DERMATOLOGIA',
  OFTALMOLOGIA = 'OFTALMOLOGIA',
  ONCOLOGIA = 'ONCOLOGIA',
  GERAL = 'GERAL',
}

export interface ProviderService {
  id: string;
  name: string;
  code: string;
  description?: string;
  price: number;
  duration?: number; // em minutos
  active: boolean;
}

export interface ProviderCredential {
  type: 'CRM' | 'CNES' | 'CNPJ' | 'CPF' | 'OUTROS';
  number: string;
  state?: string;
  expirationDate?: string;
}

export interface Provider extends BaseEntity {
  name: string;
  tradeName: string;
  type: ProviderType;
  status: ProviderStatus;
  
  // Identificação
  document: string; // CNPJ ou CPF
  credentials: ProviderCredential[];
  
  // Especialidades
  specialties: ProviderSpecialty[];
  
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
  
  // Horário de Funcionamento
  workingHours?: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
  };
  
  // Serviços prestados
  services: ProviderService[];
  
  // Convênios aceitos
  acceptedInsurers: string[]; // IDs das operadoras
  
  // Informações adicionais
  logo?: string;
  capacity?: number; // capacidade de atendimento
  hasEmergency?: boolean;
  rating?: number;
  notes?: string;
}

export interface ProviderFilters {
  search?: string;
  type?: ProviderType;
  status?: ProviderStatus;
  specialty?: ProviderSpecialty;
  city?: string;
  state?: string;
  acceptsInsurer?: string; // ID da operadora
  hasEmergency?: boolean;
  page?: number;
  pageSize?: number;
}

export interface CreateProviderDTO {
  name: string;
  tradeName: string;
  type: ProviderType;
  document: string;
  credentials: ProviderCredential[];
  specialties: ProviderSpecialty[];
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
  workingHours?: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
  };
  services?: ProviderService[];
  acceptedInsurers?: string[];
  logo?: string;
  capacity?: number;
  hasEmergency?: boolean;
  notes?: string;
}

export interface UpdateProviderDTO {
  name?: string;
  tradeName?: string;
  phone?: string;
  email?: string;
  website?: string;
  status?: ProviderStatus;
  specialties?: ProviderSpecialty[];
  address?: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  workingHours?: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
  };
  services?: ProviderService[];
  acceptedInsurers?: string[];
  logo?: string;
  capacity?: number;
  hasEmergency?: boolean;
  rating?: number;
  notes?: string;
}
