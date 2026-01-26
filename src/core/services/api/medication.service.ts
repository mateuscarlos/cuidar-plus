import apiClient from '@/core/config/api.config';
import { API_ENDPOINTS } from '@/core/constants/api';

/**
 * DTOs para Medication
 */
export interface CreateMedicationRequest {
  patient_id: string;
  name: string;
  dosage: string;
  frequency: string;
  start_date: string;
  end_date?: string;
  instructions?: string;
  schedule_times?: string[];
}

export interface UpdateMedicationRequest {
  name?: string;
  dosage?: string;
  frequency?: string;
  start_date?: string;
  end_date?: string;
  instructions?: string;
  schedule_times?: string[];
}

export interface MedicationResponse {
  id: string;
  patient_id: string;
  name: string;
  dosage: string;
  frequency: string;
  start_date: string;
  end_date?: string;
  instructions?: string;
  schedule_times?: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MedicationScheduleItem {
  medication_id: string;
  medication_name: string;
  dosage: string;
  scheduled_time: string;
  is_taken: boolean;
}

export interface ListMedicationsResponse {
  medications: MedicationResponse[];
  total: number;
  page: number;
  page_size: number;
}

/**
 * MedicationService
 * Gerencia operações relacionadas a medicamentos
 */
export class MedicationService {
  /**
   * Cria um novo medicamento
   * @param data - Dados do novo medicamento
   * @returns Medicamento criado
   */
  static async create(data: CreateMedicationRequest): Promise<MedicationResponse> {
    const response = await apiClient.post<MedicationResponse>(
      API_ENDPOINTS.MEDICATIONS.BASE,
      data
    );
    return response.data;
  }

  /**
   * Busca medicamento por ID
   * @param id - ID do medicamento
   * @returns Dados do medicamento
   */
  static async getById(id: string): Promise<MedicationResponse> {
    const response = await apiClient.get<MedicationResponse>(
      API_ENDPOINTS.MEDICATIONS.BY_ID.replace(':id', id)
    );
    return response.data;
  }

  /**
   * Lista medicamentos de um paciente
   * @param patientId - ID do paciente
   * @param params - Parâmetros de paginação e filtros
   * @returns Lista de medicamentos paginada
   */
  static async listByPatient(
    patientId: string,
    params?: {
      page?: number;
      pageSize?: number;
      active_only?: boolean;
    }
  ): Promise<ListMedicationsResponse> {
    const response = await apiClient.get<ListMedicationsResponse>(
      API_ENDPOINTS.MEDICATIONS.BY_PATIENT.replace(':patientId', patientId),
      { params }
    );
    return response.data;
  }

  /**
   * Obtém horário de medicamentos para um paciente
   * @param patientId - ID do paciente
   * @param date - Data para consulta (formato: YYYY-MM-DD)
   * @returns Lista de medicamentos agendados
   */
  static async getSchedule(
    patientId: string,
    date?: string
  ): Promise<MedicationScheduleItem[]> {
    const response = await apiClient.get<MedicationScheduleItem[]>(
      API_ENDPOINTS.MEDICATIONS.SCHEDULE.replace(':patientId', patientId),
      { params: { date } }
    );
    return response.data;
  }

  /**
   * Atualiza um medicamento
   * @param id - ID do medicamento
   * @param data - Dados para atualizar
   * @returns Medicamento atualizado
   */
  static async update(
    id: string,
    data: UpdateMedicationRequest
  ): Promise<MedicationResponse> {
    const response = await apiClient.put<MedicationResponse>(
      API_ENDPOINTS.MEDICATIONS.BY_ID.replace(':id', id),
      data
    );
    return response.data;
  }

  /**
   * Deleta um medicamento
   * @param id - ID do medicamento
   */
  static async delete(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.MEDICATIONS.BY_ID.replace(':id', id));
  }

  /**
   * Ativa um medicamento
   * @param id - ID do medicamento
   * @returns Medicamento ativado
   */
  static async activate(id: string): Promise<MedicationResponse> {
    const response = await apiClient.patch<MedicationResponse>(
      `${API_ENDPOINTS.MEDICATIONS.BY_ID.replace(':id', id)}/activate`
    );
    return response.data;
  }

  /**
   * Desativa um medicamento
   * @param id - ID do medicamento
   * @returns Medicamento desativado
   */
  static async deactivate(id: string): Promise<MedicationResponse> {
    const response = await apiClient.patch<MedicationResponse>(
      `${API_ENDPOINTS.MEDICATIONS.BY_ID.replace(':id', id)}/deactivate`
    );
    return response.data;
  }

  /**
   * Marca medicamento como tomado
   * @param medicationId - ID do medicamento
   * @param scheduledTime - Horário agendado
   */
  static async markAsTaken(medicationId: string, scheduledTime: string): Promise<void> {
    await apiClient.post(
      `${API_ENDPOINTS.MEDICATIONS.BASE}/${medicationId}/mark-taken`,
      { scheduled_time: scheduledTime }
    );
  }
}
