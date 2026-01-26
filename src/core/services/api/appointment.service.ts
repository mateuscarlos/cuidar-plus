import apiClient from '@/core/config/api.config';
import { API_ENDPOINTS } from '@/core/constants/api';

/**
 * DTOs para Appointment
 */
export interface CreateAppointmentRequest {
  patient_id: string;
  title: string;
  description?: string;
  appointment_type: 'consultation' | 'exam' | 'procedure' | 'therapy' | 'other';
  scheduled_date: string;
  duration_minutes?: number;
  location?: string;
  doctor_name?: string;
  notes?: string;
}

export interface UpdateAppointmentRequest {
  title?: string;
  description?: string;
  appointment_type?: 'consultation' | 'exam' | 'procedure' | 'therapy' | 'other';
  scheduled_date?: string;
  duration_minutes?: number;
  location?: string;
  doctor_name?: string;
  notes?: string;
  status?: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
}

export interface AppointmentResponse {
  id: string;
  patient_id: string;
  title: string;
  description?: string;
  appointment_type: 'consultation' | 'exam' | 'procedure' | 'therapy' | 'other';
  scheduled_date: string;
  duration_minutes?: number;
  location?: string;
  doctor_name?: string;
  notes?: string;
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface ListAppointmentsResponse {
  appointments: AppointmentResponse[];
  total: number;
  page: number;
  page_size: number;
}

/**
 * AppointmentService
 * Gerencia operações relacionadas a consultas e compromissos
 */
export class AppointmentService {
  /**
   * Cria um novo compromisso
   * @param data - Dados do novo compromisso
   * @returns Compromisso criado
   */
  static async create(data: CreateAppointmentRequest): Promise<AppointmentResponse> {
    const response = await apiClient.post<AppointmentResponse>(
      API_ENDPOINTS.APPOINTMENTS.BASE,
      data
    );
    return response.data;
  }

  /**
   * Busca compromisso por ID
   * @param id - ID do compromisso
   * @returns Dados do compromisso
   */
  static async getById(id: string): Promise<AppointmentResponse> {
    const response = await apiClient.get<AppointmentResponse>(
      API_ENDPOINTS.APPOINTMENTS.BY_ID.replace(':id', id)
    );
    return response.data;
  }

  /**
   * Lista compromissos de um paciente
   * @param patientId - ID do paciente
   * @param params - Parâmetros de paginação e filtros
   * @returns Lista de compromissos paginada
   */
  static async listByPatient(
    patientId: string,
    params?: {
      page?: number;
      pageSize?: number;
      status?: string;
      start_date?: string;
      end_date?: string;
    }
  ): Promise<ListAppointmentsResponse> {
    const response = await apiClient.get<ListAppointmentsResponse>(
      API_ENDPOINTS.APPOINTMENTS.BY_PATIENT.replace(':patientId', patientId),
      { params }
    );
    return response.data;
  }

  /**
   * Lista próximos compromissos de um paciente
   * @param patientId - ID do paciente
   * @param days - Número de dias para buscar (default: 7)
   * @returns Lista de próximos compromissos
   */
  static async getUpcoming(
    patientId: string,
    days?: number
  ): Promise<AppointmentResponse[]> {
    const response = await apiClient.get<AppointmentResponse[]>(
      API_ENDPOINTS.APPOINTMENTS.UPCOMING.replace(':patientId', patientId),
      { params: { days } }
    );
    return response.data;
  }

  /**
   * Atualiza um compromisso
   * @param id - ID do compromisso
   * @param data - Dados para atualizar
   * @returns Compromisso atualizado
   */
  static async update(
    id: string,
    data: UpdateAppointmentRequest
  ): Promise<AppointmentResponse> {
    const response = await apiClient.put<AppointmentResponse>(
      API_ENDPOINTS.APPOINTMENTS.BY_ID.replace(':id', id),
      data
    );
    return response.data;
  }

  /**
   * Deleta um compromisso
   * @param id - ID do compromisso
   */
  static async delete(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.APPOINTMENTS.BY_ID.replace(':id', id));
  }

  /**
   * Cancela um compromisso
   * @param id - ID do compromisso
   * @returns Compromisso cancelado
   */
  static async cancel(id: string): Promise<AppointmentResponse> {
    const response = await apiClient.patch<AppointmentResponse>(
      `${API_ENDPOINTS.APPOINTMENTS.BY_ID.replace(':id', id)}/cancel`
    );
    return response.data;
  }

  /**
   * Confirma um compromisso
   * @param id - ID do compromisso
   * @returns Compromisso confirmado
   */
  static async confirm(id: string): Promise<AppointmentResponse> {
    const response = await apiClient.patch<AppointmentResponse>(
      `${API_ENDPOINTS.APPOINTMENTS.BY_ID.replace(':id', id)}/confirm`
    );
    return response.data;
  }

  /**
   * Marca compromisso como completo
   * @param id - ID do compromisso
   * @returns Compromisso completo
   */
  static async complete(id: string): Promise<AppointmentResponse> {
    const response = await apiClient.patch<AppointmentResponse>(
      `${API_ENDPOINTS.APPOINTMENTS.BY_ID.replace(':id', id)}/complete`
    );
    return response.data;
  }
}
