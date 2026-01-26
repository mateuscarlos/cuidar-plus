/**
 * Patient Business Rules
 * Regras de negócio e validações do domínio de pacientes
 */

import { Patient, PatientStatus, PatientPriority } from './Patient.entity';
import { isValidCPF } from '@/core/lib/validators';

/**
 * Validar dados do paciente
 */
export class PatientValidator {
  static validate(patient: Partial<Patient>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Nome
    if (!patient.name || patient.name.trim().length < 3) {
      errors.push('Nome deve ter pelo menos 3 caracteres');
    }

    // CPF
    if (patient.cpf && !isValidCPF(patient.cpf)) {
      errors.push('CPF inválido');
    }

    // Data de nascimento
    if (patient.birthDate) {
      const birthDate = new Date(patient.birthDate);
      const today = new Date();
      if (birthDate >= today) {
        errors.push('Data de nascimento não pode ser futura');
      }
    }

    // Telefone de contato
    if (patient.contact?.phone && patient.contact.phone.replace(/\D/g, '').length < 10) {
      errors.push('Telefone de contato inválido');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Verificar se paciente pode receber alta
   */
  static canBeDischarged(patient: Patient): boolean {
    return patient.status === PatientStatus.ACTIVE;
  }

  /**
   * Verificar se paciente está em situação crítica
   */
  static isCritical(patient: Patient): boolean {
    return patient.priority === PatientPriority.URGENT;
  }

  /**
   * Calcular idade do paciente
   */
  static calculateAge(birthDate: Date | string): number {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }

  /**
   * Verificar se é paciente pediátrico
   */
  static isPediatric(birthDate: Date | string): boolean {
    return this.calculateAge(birthDate) < 18;
  }

  /**
   * Verificar se paciente precisa de acompanhante
   */
  static requiresCompanion(patient: Patient): boolean {
    const age = this.calculateAge(patient.birthDate);
    return age < 18 || age >= 65 || patient.priority === PatientPriority.URGENT;
  }
}

/**
 * Value Object: Nome do Paciente
 */
export class PatientName {
  private constructor(private readonly value: string) {}

  static create(name: string): PatientName {
    const trimmed = name.trim();
    if (trimmed.length < 3) {
      throw new Error('Nome deve ter pelo menos 3 caracteres');
    }
    if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(trimmed)) {
      throw new Error('Nome deve conter apenas letras');
    }
    return new PatientName(trimmed);
  }

  toString(): string {
    return this.value;
  }

  getFirstName(): string {
    return this.value.split(' ')[0];
  }

  getLastName(): string {
    const parts = this.value.split(' ');
    return parts[parts.length - 1];
  }

  getFullName(): string {
    return this.value;
  }
}

/**
 * Helper para obter cor do status
 */
export function getStatusColor(status: PatientStatus): string {
  const colors: Record<PatientStatus, string> = {
    [PatientStatus.ACTIVE]: 'bg-green-100 text-green-800',
    [PatientStatus.DISCHARGED]: 'bg-gray-100 text-gray-800',
    [PatientStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
    [PatientStatus.TRANSFERRED]: 'bg-blue-100 text-blue-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

/**
 * Helper para obter cor da prioridade
 */
export function getPriorityColor(priority: PatientPriority): string {
  const colors: Record<PatientPriority, string> = {
    [PatientPriority.LOW]: 'bg-gray-100 text-gray-800',
    [PatientPriority.MEDIUM]: 'bg-blue-100 text-blue-800',
    [PatientPriority.HIGH]: 'bg-orange-100 text-orange-800',
    [PatientPriority.URGENT]: 'bg-red-100 text-red-800',
  };
  return colors[priority] || 'bg-gray-100 text-gray-800';
}
