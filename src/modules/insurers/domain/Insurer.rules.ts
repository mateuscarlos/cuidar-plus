/**
 * Business Rules for Insurer
 * Regras de negócio para Operadoras de Saúde
 */

import { Insurer, InsurerStatus, CreateInsurerDTO } from './Insurer.entity';

export class InsurerBusinessRules {
  /**
   * Valida se o CNPJ é válido
   */
  static validateCNPJ(cnpj: string): boolean {
    const cleanCNPJ = cnpj.replace(/[^\d]/g, '');
    return cleanCNPJ.length === 14;
  }

  /**
   * Valida se o registro ANS é válido
   */
  static validateANSRegistration(registrationNumber: string): boolean {
    const cleanNumber = registrationNumber.replace(/[^\d]/g, '');
    return cleanNumber.length === 6;
  }

  /**
   * Verifica se a operadora pode ser desativada
   */
  static canBeDeactivated(insurer: Insurer): boolean {
    // Não pode desativar se houver planos ativos
    const hasActivePlans = insurer.plans.some(plan => plan.active);
    return !hasActivePlans;
  }

  /**
   * Verifica se a operadora está ativa
   */
  static isActive(insurer: Insurer): boolean {
    return insurer.status === InsurerStatus.ACTIVE;
  }

  /**
   * Valida os dados antes de criar uma operadora
   */
  static validateBeforeCreate(dto: CreateInsurerDTO): string[] {
    const errors: string[] = [];

    if (!dto.name || dto.name.trim().length < 3) {
      errors.push('Nome da operadora deve ter no mínimo 3 caracteres');
    }

    if (!this.validateCNPJ(dto.cnpj)) {
      errors.push('CNPJ inválido');
    }

    if (!this.validateANSRegistration(dto.registrationNumber)) {
      errors.push('Número de registro ANS inválido (deve ter 6 dígitos)');
    }

    if (!dto.email || !dto.email.includes('@')) {
      errors.push('E-mail inválido');
    }

    if (!dto.phone || dto.phone.replace(/[^\d]/g, '').length < 10) {
      errors.push('Telefone inválido');
    }

    return errors;
  }

  /**
   * Verifica se a operadora pode ter novos planos adicionados
   */
  static canAddPlans(insurer: Insurer): boolean {
    return this.isActive(insurer);
  }

  /**
   * Verifica se um plano pode ser removido
   */
  static canRemovePlan(planId: string, insurer: Insurer): boolean {
    // Aqui você pode adicionar lógica para verificar se o plano está em uso
    // por pacientes, contratos, etc.
    return true;
  }
}
