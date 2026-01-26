import apiClient from '@/core/config/api.config';
import { API_ENDPOINTS } from '@/core/constants/api';

/**
 * DTOs para Patient
 */
export interface CreatePatientRequest {
  name: string;
  cpf: string;
  birth_date: string;
  caregiver_id: string;
  phone?: string;
  address?: string;
  emergency_contact?: string;
  medical_info?: {
    allergies?: string[];
    chronic_conditions?: string[];
    observations?: string;
  };
}

export interface UpdatePatientRequest {
  name?: string;
  phone?: string;
  address?: string;
  emergency_contact?: string;
  medical_info?: {
    allergies?: string[];
    chronic_conditions?: string[];
    observations?: string;
  };
}

export interface PatientResponse {
  id: string;
  name: string;
  cpf: string;
  birth_date: string;
  age: number;
  caregiver_id: string;
  phone?: string;
  address?: string;
  emergency_contact?: string;
  medical_info?: {
    allergies?: string[];
    chronic_conditions?: string[];
    observations?: string;
  };
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ListPatientsResponse {
  patients: PatientResponse[];
  total: number;
  page: number;
  page_size: number;
}

/**
 * PatientService
 * Gerencia operações relacionadas a pacientes
 */
export class PatientService {
  /**
   * Cria um novo paciente
   * @param data - Dados do novo paciente
   * @returns Paciente criado
   */
  static async create(data: CreatePatientRequest): Promise<PatientResponse> {
    const response = await apiClient.post<PatientResponse>(
      API_ENDPOINTS.PATIENTS.BASE,
      data
    );
    return response.data;
  }

  /**
   * Busca paciente por ID
   * @param id - ID do paciente
   * @returns Dados do paciente
   */
  static async getById(id: string): Promise<PatientResponse> {
    const response = await apiClient.get<PatientResponse>(
      API_ENDPOINTS.PATIENTS.BY_ID.replace(':id', id)
    );
    return response.data;
  }

  /**
   * Lista pacientes de um cuidador
   * @param caregiverId - ID do cuidador
   * @param params - Parâmetros de paginação
   * @returns Lista de pacientes paginada
   */
  static async listByCaregiver(
    caregiverId: string,
    params?: { page?: number; pageSize?: number }
  ): Promise<ListPatientsResponse> {
    const response = await apiClient.get<ListPatientsResponse>(
      API_ENDPOINTS.PATIENTS.BY_CAREGIVER.replace(':caregiverId', caregiverId),
      { params }
    );
    return response.data;
  }

  /**
   * Lista todos os pacientes (admin only)
   * @param params - Parâmetros de paginação e filtros
   * @returns Lista de pacientes paginada
   */
  static async list(params?: {
    page?: number;
    pageSize?: number;
  }): Promise<ListPatientsResponse> {
    const response = await apiClient.get<ListPatientsResponse>(
      API_ENDPOINTS.PATIENTS.BASE,
      { params }
    );
    return response.data;
  }

  /**
   * Atualiza um paciente
   * @param id - ID do paciente
   * @param data - Dados para atualizar
   * @returns Paciente atualizado
   */
  static async update(id: string, data: UpdatePatientRequest): Promise<PatientResponse> {
    const response = await apiClient.put<PatientResponse>(
      API_ENDPOINTS.PATIENTS.BY_ID.replace(':id', id),
      data
    );
    return response.data;
  }

  /**
   * Deleta um paciente
   * @param id - ID do paciente
   */
  static async delete(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.PATIENTS.BY_ID.replace(':id', id));
  }

  /**
   * Ativa um paciente
   * @param id - ID do paciente
   * @returns Paciente ativado
   */
  static async activate(id: string): Promise<PatientResponse> {
    const response = await apiClient.patch<PatientResponse>(
      `${API_ENDPOINTS.PATIENTS.BY_ID.replace(':id', id)}/activate`
    );
    return response.data;
  }

  /**
   * Desativa um paciente
   * @param id - ID do paciente
   * @returns Paciente desativado
   */
  static async deactivate(id: string): Promise<PatientResponse> {
    const response = await apiClient.patch<PatientResponse>(
      `${API_ENDPOINTS.PATIENTS.BY_ID.replace(':id', id)}/deactivate`
    );
    return response.data;
  }
}
