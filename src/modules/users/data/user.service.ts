/**
 * User Service
 */

import { apiClient } from '@/core/config';
import { API_ENDPOINTS } from '@/core/constants/api';
import { User, UserFilters, CreateUserDTO, UpdateUserDTO, ChangePasswordDTO } from '../domain';

export class UserService {
  static async fetchUsers(filters: UserFilters = {}) {
    const response = await apiClient.get(API_ENDPOINTS.USERS.BASE, { params: filters });
    return response.data;
  }

  static async getUserById(id: string): Promise<User> {
    const response = await apiClient.get(API_ENDPOINTS.USERS.BY_ID(id));
    return response.data;
  }

  static async createUser(data: CreateUserDTO): Promise<User> {
    const response = await apiClient.post(API_ENDPOINTS.USERS.BASE, data);
    return response.data;
  }

  static async updateUser(id: string, data: UpdateUserDTO): Promise<User> {
    const response = await apiClient.put(API_ENDPOINTS.USERS.BY_ID(id), data);
    return response.data;
  }

  static async deleteUser(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.USERS.BY_ID(id));
  }

  static async changePassword(id: string, data: ChangePasswordDTO): Promise<void> {
    await apiClient.put(API_ENDPOINTS.USERS.PASSWORD(id), data);
  }

  static async toggleUserStatus(id: string): Promise<User> {
    const response = await apiClient.patch(API_ENDPOINTS.USERS.TOGGLE_STATUS(id));
    return response.data;
  }

  static async getCurrentUser(): Promise<User> {
    const response = await apiClient.get(API_ENDPOINTS.USERS.ME);
    return response.data;
  }
}
