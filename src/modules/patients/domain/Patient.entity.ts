/**
 * Patient Entity
 * Representa um paciente no domínio da aplicação
 */

import { BaseEntity } from '@/core/types';

/**
 * Status do Paciente
 */
export enum PatientStatus {
  EVALUATION = 'Avaliação',
  ACTIVE = 'Ativo',
  ADMINISTRATIVE_DISCHARGE = 'Alta Administrativa',
  DEATH_DISCHARGE = 'Alta Óbito',
  IMPROVEMENT_DISCHARGE = 'Alta Melhora',
  HOSPITAL_DISCHARGE = 'Alta Hospitalar',
  CANCELED = 'Cancelado',
}

/**
 * Prioridade do Paciente
 */
export enum PatientPriority {
  LOW = 'Baixa',
  MEDIUM = 'Média',
  HIGH = 'Alta',
  URGENT = 'Urgente',
}

/**
 * Tipo Sanguíneo
 */
export enum BloodType {
  A_POSITIVE = 'A+',
  A_NEGATIVE = 'A-',
  B_POSITIVE = 'B+',
  B_NEGATIVE = 'B-',
  AB_POSITIVE = 'AB+',
  AB_NEGATIVE = 'AB-',
  O_POSITIVE = 'O+',
  O_NEGATIVE = 'O-',
}

/**
 * Informações de Contato
 */
export interface ContactInfo {
  phone: string;
  email?: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
}

/**
 * Endereço
 */
export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

/**
 * Informações Médicas
 */
export interface MedicalInfo {
  allergies: string[];
  medications: string[];
  conditions: string[];
  bloodType?: BloodType;
  observations?: string;
}

/**
 * Entidade Patient
 */
export interface Patient extends BaseEntity {
  // Informações Básicas
  name: string;
  cpf: string;
  birthDate: Date | string;
  gender: 'Masculino' | 'Feminino' | 'Outro';
  
  // Informações de Contato
  contact: ContactInfo;
  address: Address;
  
  // Informações Médicas
  medicalInfo: MedicalInfo;
  
  // Status e Controle
  status: PatientStatus;
  priority?: PatientPriority;
  medicalRecordNumber: string;
  admissionDate?: Date | string;
  dischargeDate?: Date | string;
  
  // Diagnóstico e Observações
  diagnosis?: string;
  room?: string;
  bed?: string;
  attendingPhysician?: string;
  
  // Última Visita
  lastVisit?: Date | string;
}
