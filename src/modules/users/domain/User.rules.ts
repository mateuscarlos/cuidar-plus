/**
 * User Business Rules
 */

import { User, UserRole, UserStatus } from './User.entity';
import { isValidCPF, isValidEmail, isStrongPassword } from '@/core/lib/validators';

export class UserValidator {
  static validate(user: Partial<User>): string[] {
    const errors: string[] = [];

    if (!user.name?.trim()) {
      errors.push('Nome obrigatório');
    }

    if (!user.email) {
      errors.push('E-mail obrigatório');
    } else if (!isValidEmail(user.email)) {
      errors.push('E-mail inválido');
    }

    if (!user.cpf) {
      errors.push('CPF obrigatório');
    } else if (!isValidCPF(user.cpf)) {
      errors.push('CPF inválido');
    }

    if (!user.role) {
      errors.push('Cargo obrigatório');
    }

    return errors;
  }

  static validatePassword(password: string): string[] {
    const errors: string[] = [];

    if (!password) {
      errors.push('Senha obrigatória');
    } else {
      const validation = isStrongPassword(password);
      if (!validation.isValid) {
        errors.push(...validation.errors);
      }
    }

    return errors;
  }

  static canManageUsers(role: UserRole): boolean {
    return role === UserRole.ADMIN;
  }

  static canAccessModule(user: User, module: string): boolean {
    if (user.role === UserRole.ADMIN) return true;
    return user.permissions.includes(module);
  }

  static getAvailablePermissions(role: UserRole): string[] {
    const allPermissions = [
      'patients.view',
      'patients.create',
      'patients.edit',
      'patients.delete',
      'inventory.view',
      'inventory.create',
      'inventory.edit',
      'inventory.delete',
      'reports.view',
      'reports.generate',
      'users.view',
      'users.create',
      'users.edit',
      'users.delete',
    ];

    if (role === UserRole.ADMIN) {
      return allPermissions;
    }

    if (role === UserRole.DOCTOR) {
      return allPermissions.filter(p => !p.startsWith('users.'));
    }

    if (role === UserRole.NURSE) {
      return allPermissions.filter(p => 
        p.startsWith('patients.') || 
        p.startsWith('inventory.')
      );
    }

    // RECEPTIONIST
    return ['patients.view', 'patients.create', 'reports.view'];
  }
}

export function getUserRoleLabel(role: UserRole): string {
  const labels = {
    [UserRole.ADMIN]: 'Administrador',
    [UserRole.DOCTOR]: 'Médico',
    [UserRole.NURSE]: 'Enfermeiro',
    [UserRole.RECEPTIONIST]: 'Recepcionista',
  };
  return labels[role];
}

export function getUserRoleColor(role: UserRole): string {
  const colors = {
    [UserRole.ADMIN]: 'bg-purple-100 text-purple-800',
    [UserRole.DOCTOR]: 'bg-blue-100 text-blue-800',
    [UserRole.NURSE]: 'bg-green-100 text-green-800',
    [UserRole.RECEPTIONIST]: 'bg-gray-100 text-gray-800',
  };
  return colors[role];
}

export function getUserStatusColor(status: UserStatus): string {
  const colors = {
    [UserStatus.ACTIVE]: 'bg-green-100 text-green-800',
    [UserStatus.INACTIVE]: 'bg-gray-100 text-gray-800',
    [UserStatus.SUSPENDED]: 'bg-red-100 text-red-800',
  };
  return colors[status];
}
