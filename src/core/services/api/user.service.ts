import apiClient from '@/core/config/api.config';
import { API_ENDPOINTS } from '@/core/constants/api';

/**
 * DTOs para User
 */
export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: 'caregiver' | 'family' | 'admin';
  phone?: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  phone?: string;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: 'caregiver' | 'family' | 'admin';
  phone?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_login?: string;
}

export interface ListUsersResponse {
  users: UserResponse[];
  total: number;
  page: number;
  page_size: number;
}

/**
 * UserService
 * Gerencia operações relacionadas a usuários
 */
export class UserService {
  /**
   * Cria um novo usuário
   * @param data - Dados do novo usuário
   * @returns Usuário criado
   */
  static async create(data: CreateUserRequest): Promise<UserResponse> {
    const response = await apiClient.post<UserResponse>(
      API_ENDPOINTS.USERS.BASE,
      data
    );
    return response.data;
  }

  /**
   * Busca usuário por ID
   * @param id - ID do usuário
   * @returns Dados do usuário
   */
  static async getById(id: string): Promise<UserResponse> {
    const response = await apiClient.get<UserResponse>(
      API_ENDPOINTS.USERS.BY_ID.replace(':id', id)
    );
    return response.data;
  }

  /**
   * Lista todos os usuários
   * @param params - Parâmetros de paginação e filtros
   * @returns Lista de usuários paginada
   */
  static async list(params?: {
    page?: number;
    pageSize?: number;
    role?: string;
  }): Promise<ListUsersResponse> {
    const response = await apiClient.get<ListUsersResponse>(
      API_ENDPOINTS.USERS.BASE,
      { params }
    );
    return response.data;
  }

  /**
   * Atualiza um usuário
   * @param id - ID do usuário
   * @param data - Dados para atualizar
   * @returns Usuário atualizado
   */
  static async update(id: string, data: UpdateUserRequest): Promise<UserResponse> {
    const response = await apiClient.put<UserResponse>(
      API_ENDPOINTS.USERS.BY_ID.replace(':id', id),
      data
    );
    return response.data;
  }

  /**
   * Deleta um usuário
   * @param id - ID do usuário
   */
  static async delete(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.USERS.BY_ID.replace(':id', id));
  }

  /**
   * Ativa um usuário
   * @param id - ID do usuário
   * @returns Usuário ativado
   */
  static async activate(id: string): Promise<UserResponse> {
    const response = await apiClient.patch<UserResponse>(
      `${API_ENDPOINTS.USERS.BY_ID.replace(':id', id)}/activate`
    );
    return response.data;
  }

  /**
   * Desativa um usuário
   * @param id - ID do usuário
   * @returns Usuário desativado
   */
  static async deactivate(id: string): Promise<UserResponse> {
    const response = await apiClient.patch<UserResponse>(
      `${API_ENDPOINTS.USERS.BY_ID.replace(':id', id)}/deactivate`
    );
    return response.data;
  }
}
