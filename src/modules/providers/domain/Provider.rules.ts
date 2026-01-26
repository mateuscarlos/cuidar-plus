/**
 * Business Rules for Provider
 * Regras de negócio para Prestadoras de Serviço
 */

import { Provider, ProviderStatus, CreateProviderDTO } from './Provider.entity';

export class ProviderBusinessRules {
  /**
   * Valida se o documento (CNPJ ou CPF) é válido
   */
  static validateDocument(document: string): boolean {
    const cleanDoc = document.replace(/[^\d]/g, '');
    return cleanDoc.length === 11 || cleanDoc.length === 14;
  }

  /**
   * Verifica se a prestadora pode ser desativada
   */
  static canBeDeactivated(provider: Provider): boolean {
    // Não pode desativar se houver atendimentos agendados
    // TODO: Implementar verificação de agendamentos ativos
    return provider.status !== ProviderStatus.PENDING_APPROVAL;
  }

  /**
   * Verifica se a prestadora está ativa
   */
  static isActive(provider: Provider): boolean {
    return provider.status === ProviderStatus.ACTIVE;
  }

  /**
   * Verifica se pode atender uma operadora específica
   */
  static acceptsInsurer(provider: Provider, insurerId: string): boolean {
    return provider.acceptedInsurers.includes(insurerId);
  }

  /**
   * Valida os dados antes de criar uma prestadora
   */
  static validateBeforeCreate(dto: CreateProviderDTO): string[] {
    const errors: string[] = [];

    if (!dto.name || dto.name.trim().length < 3) {
      errors.push('Nome da prestadora deve ter no mínimo 3 caracteres');
    }

    if (!this.validateDocument(dto.document)) {
      errors.push('Documento inválido (CPF ou CNPJ)');
    }

    if (!dto.email || !dto.email.includes('@')) {
      errors.push('E-mail inválido');
    }

    if (!dto.phone || dto.phone.replace(/[^\d]/g, '').length < 10) {
      errors.push('Telefone inválido');
    }

    if (!dto.specialties || dto.specialties.length === 0) {
      errors.push('Deve ter pelo menos uma especialidade');
    }

    if (!dto.credentials || dto.credentials.length === 0) {
      errors.push('Deve ter pelo menos uma credencial (CNES, CRM, etc)');
    }

    return errors;
  }

  /**
   * Verifica se a prestadora pode adicionar serviços
   */
  static canAddServices(provider: Provider): boolean {
    return this.isActive(provider);
  }

  /**
   * Verifica se a prestadora tem atendimento de emergência
   */
  static hasEmergencyService(provider: Provider): boolean {
    return provider.hasEmergency === true;
  }

  /**
   * Calcula a disponibilidade de horários
   */
  static calculateAvailability(provider: Provider): number {
    if (!provider.workingHours) return 0;
    
    const days = Object.values(provider.workingHours).filter(Boolean);
    return (days.length / 7) * 100;
  }

  /**
   * Verifica se a prestadora está com credenciais válidas
   */
  static hasValidCredentials(provider: Provider): boolean {
    const today = new Date();
    
    return provider.credentials.every(credential => {
      if (!credential.expirationDate) return true;
      return new Date(credential.expirationDate) > today;
    });
  }
}
