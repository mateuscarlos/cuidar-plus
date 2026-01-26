/**
 * Patient DTOs (Data Transfer Objects)
 * Define os contratos para transferência de dados do Patient
 * 
 * @layer Domain
 */

import { Patient, PatientStatus, PatientPriority } from './Patient.entity';

/**
 * DTO para criação de paciente
 * Omite campos gerados automaticamente pelo sistema
 */
export type CreatePatientDTO = Omit<
  Patient,
  'id' | 'createdAt' | 'updatedAt' | 'medicalRecordNumber'
>;

/**
 * DTO para atualização de paciente
 * Permite atualização parcial, exceto campos imutáveis
 */
export type UpdatePatientDTO = Partial<
  Omit<Patient, 'id' | 'createdAt' | 'updatedAt' | 'cpf' | 'medicalRecordNumber'>
>;

/**
 * Filtros de busca de pacientes
 * Utilizado para queries com paginação e filtros
 */
export interface PatientFilters {
  search?: string;
  status?: PatientStatus;
  priority?: PatientPriority;
  attendingPhysician?: string;
  admissionDateFrom?: Date | string;
  admissionDateTo?: Date | string;
  page?: number;
  pageSize?: number;
}

/**
 * DTO para alta de paciente
 */
export interface DischargePatientDTO {
  patientId: string;
  dischargeDate: Date | string;
  dischargeReason: string;
  status: PatientStatus;
  notes?: string;
}

/**
 * DTO para transferência de paciente
 */
export interface TransferPatientDTO {
  patientId: string;
  fromRoom: string;
  toRoom: string;
  fromBed?: string;
  toBed?: string;
  transferDate: Date | string;
  reason: string;
}

/**
 * DTO para estatísticas de pacientes
 */
export interface PatientStatsDTO {
  total: number;
  active: number;
  evaluation: number;
  discharged: number;
  byPriority: Record<PatientPriority, number>;
  byStatus: Record<PatientStatus, number>;
  averageStayDays: number;
}
