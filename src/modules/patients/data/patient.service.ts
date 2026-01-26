/**
 * Patient Service
 * Serviço responsável por comunicação com a API de pacientes
 */

import { apiClient } from '@/core/config/api.config';
import { PaginatedResponse } from '@/core/types';
import { Patient, PatientFilters, CreatePatientDTO, UpdatePatientDTO } from '../domain';

/**
 * Endpoints da API de pacientes
 */
const ENDPOINTS = {
  BASE: '/patients',
  BY_ID: (id: string) => `/patients/${id}`,
  STATS: '/patients/stats',
  SEARCH: '/patients/search',
} as const;

/**
 * Patient Service
 */
export class PatientService {
  /**
   * Buscar todos os pacientes com filtros e paginação
   */
  static async fetchPatients(
    filters: PatientFilters = {}
  ): Promise<PaginatedResponse<Patient>> {
    const { data } = await apiClient.get<PaginatedResponse<Patient>>(
      ENDPOINTS.BASE,
      { params: filters }
    );
    return data;
  }

  /**
   * Buscar paciente por ID
   */
  static async getPatientById(id: string): Promise<Patient> {
    const { data } = await apiClient.get<Patient>(ENDPOINTS.BY_ID(id));
    return data;
  }

  /**
   * Criar novo paciente
   */
  static async createPatient(patient: CreatePatientDTO): Promise<Patient> {
    const { data } = await apiClient.post<Patient>(ENDPOINTS.BASE, patient);
    return data;
  }

  /**
   * Atualizar paciente existente
   */
  static async updatePatient(id: string, updates: UpdatePatientDTO): Promise<Patient> {
    const { data } = await apiClient.patch<Patient>(
      ENDPOINTS.BY_ID(id),
      updates
    );
    return data;
  }

  /**
   * Deletar paciente
   */
  static async deletePatient(id: string): Promise<void> {
    await apiClient.delete(ENDPOINTS.BY_ID(id));
  }

  /**
   * Dar alta ao paciente
   */
  static async dischargePatient(id: string, dischargeNotes?: string): Promise<Patient> {
    const { data } = await apiClient.post<Patient>(
      `${ENDPOINTS.BY_ID(id)}/discharge`,
      { notes: dischargeNotes }
    );
    return data;
  }

  /**
   * Transferir paciente
   */
  static async transferPatient(
    id: string,
    destination: string,
    reason?: string
  ): Promise<Patient> {
    const { data } = await apiClient.post<Patient>(
      `${ENDPOINTS.BY_ID(id)}/transfer`,
      { destination, reason }
    );
    return data;
  }

  /**
   * Buscar estatísticas de pacientes
   */
  static async getPatientStats(): Promise<{
    total: number;
    active: number;
    discharged: number;
    pending: number;
  }> {
    const { data } = await apiClient.get(ENDPOINTS.STATS);
    return data;
  }

  /**
   * Buscar pacientes por termo de busca
   */
  static async searchPatients(query: string): Promise<Patient[]> {
    const { data } = await apiClient.get<Patient[]>(ENDPOINTS.SEARCH, {
      params: { q: query },
    });
    return data;
  }
}

export default PatientService;
