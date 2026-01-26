/**
 * User Entity
 */

import { BaseEntity } from '@/core/types';

export enum UserRole {
  ADMIN = 'ADMIN',
  DOCTOR = 'DOCTOR',
  NURSE = 'NURSE',
  RECEPTIONIST = 'RECEPTIONIST',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}

export interface User extends BaseEntity {
  name: string;
  email: string;
  cpf: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  lastLogin?: string;
  permissions: string[];
}

export interface UserFilters {
  search?: string;
  role?: UserRole;
  status?: UserStatus;
  page?: number;
  pageSize?: number;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  cpf: string;
  phone: string;
  role: UserRole;
  password: string;
  permissions?: string[];
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
  phone?: string;
  role?: UserRole;
  status?: UserStatus;
  permissions?: string[];
}

export interface ChangePasswordDTO {
  currentPassword: string;
  newPassword: string;
}
