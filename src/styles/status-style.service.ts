import { Injectable } from '@angular/core';
import { StatusPaciente } from '../app/features/pacientes/models/paciente.model';
import { UserStatus } from '../app/features/usuarios/models/user.model';

export interface StatusStyle {
  textClass: string;
  badgeClass: string;
  icon: string;
  label?: string;
  bgClass?: string;
  borderClass?: string;
}

@Injectable({
  providedIn: 'root'
})
export class StatusStyleService {
  private statusStyleMap: Map<string, StatusStyle> = new Map([
    // Status comuns/genéricos
    ['active', { 
      textClass: 'text-success', 
      badgeClass: 'bg-success',
      icon: 'check-circle',
      label: 'Ativo'
    }],
    ['inactive', { 
      textClass: 'text-secondary', 
      badgeClass: 'bg-secondary',
      icon: 'dash-circle',
      label: 'Inativo'
    }],
    ['pending', { 
      textClass: 'text-warning', 
      badgeClass: 'bg-warning',
      icon: 'clock',
      label: 'Pendente'
    }],
    ['approved', { 
      textClass: 'text-success', 
      badgeClass: 'bg-success',
      icon: 'check-circle',
      label: 'Aprovado'
    }],
    ['rejected', { 
      textClass: 'text-danger', 
      badgeClass: 'bg-danger',
      icon: 'x-circle',
      label: 'Rejeitado'
    }],
    ['completed', { 
      textClass: 'text-success', 
      badgeClass: 'bg-success',
      icon: 'check2-all',
      label: 'Concluído'
    }],
    ['canceled', { 
      textClass: 'text-danger', 
      badgeClass: 'bg-danger',
      icon: 'x-octagon',
      label: 'Cancelado'
    }],
    ['scheduled', { 
      textClass: 'text-info', 
      badgeClass: 'bg-info',
      icon: 'calendar-event',
      label: 'Agendado'
    }],
    ['in-progress', { 
      textClass: 'text-primary', 
      badgeClass: 'bg-primary',
      icon: 'hourglass-split',
      label: 'Em andamento'
    }],
    
    // Status específicos de pacientes
    [StatusPaciente.ATIVO, { 
      textClass: 'text-success', 
      badgeClass: 'bg-success',
      icon: 'check-circle',
      label: 'Ativo',
      bgClass: 'bg-success-subtle',
      borderClass: 'border-success'
    }],
    [StatusPaciente.INATIVO, { 
      textClass: 'text-secondary', 
      badgeClass: 'bg-secondary',
      icon: 'dash-circle',
      label: 'Inativo',
      bgClass: 'bg-danger-subtle',
      borderClass: 'border-danger'
    }],
    [StatusPaciente.EM_AVALIACAO, { 
      textClass: 'text-warning', 
      badgeClass: 'bg-warning',
      icon: 'exclamation-triangle',
      label: 'Em Avaliação',
      bgClass: 'bg-warning-subtle',
      borderClass: 'border-warning'
    }],
    [StatusPaciente.ALTA_ADMINISTRATIVA, { 
      textClass: 'text-info', 
      badgeClass: 'bg-info',
      icon: 'clipboard-check',
      label: 'Alta Administrativa',
      bgClass: 'bg-info-subtle',
      borderClass: 'border-info'
    }],
    [StatusPaciente.ALTA_MEDICA, { 
      textClass: 'text-primary', 
      badgeClass: 'bg-primary',
      icon: 'clipboard2-pulse',
      label: 'Alta Médica',
      bgClass: 'bg-primary-subtle',
      borderClass: 'border-primary'
    }],
    [StatusPaciente.OBITO, { 
      textClass: 'text-dark', 
      badgeClass: 'bg-dark',
      icon: 'heart',
      label: 'Óbito',
      bgClass: 'bg-dark-subtle',
      borderClass: 'border-dark'
    }],
    
    // Status específicos de usuários
    [UserStatus.ATIVO, { 
      textClass: 'text-success', 
      badgeClass: 'bg-success',
      icon: 'check-circle',
      label: 'Ativo'
    }],
    [UserStatus.INATIVO, { 
      textClass: 'text-secondary', 
      badgeClass: 'bg-secondary',
      icon: 'dash-circle',
      label: 'Inativo'
    }],
    [UserStatus.FERIAS, { 
      textClass: 'text-info', 
      badgeClass: 'bg-info',
      icon: 'sun',
      label: 'Férias'
    }],
    [UserStatus.LICENCA_MEDICA, { 
      textClass: 'text-warning', 
      badgeClass: 'bg-warning',
      icon: 'bandaid',
      label: 'Licença Médica'
    }],
    [UserStatus.LICENCA_MATERNIDADE, { 
      textClass: 'text-pink', 
      badgeClass: 'bg-pink',
      icon: 'heart',
      label: 'Licença Maternidade'
    }],
    [UserStatus.LICENCA_PATERNIDADE, { 
      textClass: 'text-blue', 
      badgeClass: 'bg-blue',
      icon: 'heart',
      label: 'Licença Paternidade'
    }],
    [UserStatus.AFASTADO_ACIDENTE_DE_TRABALHO, { 
      textClass: 'text-danger', 
      badgeClass: 'bg-danger',
      icon: 'exclamation-triangle',
      label: 'Afastado por Acidente de Trabalho'
    }],
    [UserStatus.AFASTAMENTO_NAO_REMUNERADO, { 
      textClass: 'text-muted', 
      badgeClass: 'bg-light text-dark',
      icon: 'calendar-x',
      label: 'Afastamento Não Remunerado'
    }],
    [UserStatus.SUSPENSAO_CONTRTATUAL, { 
      textClass: 'text-danger', 
      badgeClass: 'bg-danger',
      icon: 'file-earmark-x',
      label: 'Suspensão Contratual'
    }],
    [UserStatus.APOSENTADO, { 
      textClass: 'text-primary', 
      badgeClass: 'bg-primary',
      icon: 'person-check',
      label: 'Aposentado'
    }],
    [UserStatus.AFASTADO_OUTROS, { 
      textClass: 'text-warning', 
      badgeClass: 'bg-warning',
      icon: 'exclamation-circle',
      label: 'Afastado por Outros Motivos'
    }]
  ]);

  constructor() { }

  /**
   * Retorna o estilo associado ao status especificado
   * @param status O status para o qual obter o estilo
   * @returns O objeto StatusStyle ou undefined se o status não existir
   */
  getStatusStyle(status: string): StatusStyle | undefined {
    if (!status) return undefined;
    
    // Tenta encontrar o status exato
    let result = this.statusStyleMap.get(status);
    
    // Se não encontrou, tenta normalizar e procurar de novo
    if (!result) {
      result = this.statusStyleMap.get(this.normalizeStatus(status));
    }
    
    // Se ainda não encontrou, tenta encontrar uma correspondência parcial
    if (!result) {
      const normalizedStatus = this.normalizeStatus(status);
      
      for (const [key, value] of this.statusStyleMap.entries()) {
        const normalizedKey = this.normalizeStatus(key);
        
        if (normalizedKey.includes(normalizedStatus) || 
            normalizedStatus.includes(normalizedKey)) {
          return value;
        }
      }
    }
    
    return result;
  }

  /**
   * Verifica se um status existe
   * @param status O status a ser verificado
   * @returns true se o status existir, false caso contrário
   */
  hasStatus(status: string): boolean {
    if (!status) return false;
    return !!this.getStatusStyle(status);
  }

  /**
   * Retorna as classes associadas ao status especificado
   * @param status O status para o qual obter as classes
   * @returns O objeto com as classes ou valores padrão se o status não existir
   */
  getStatusClasses(status: string): StatusStyle {
    return this.getStatusStyle(status) || {
      textClass: 'text-secondary',
      badgeClass: 'bg-secondary',
      icon: 'question-circle',
      label: status || 'Desconhecido'
    };
  }

  /**
   * Retorna todas as classes CSS associadas a um status
   * @param status O status para o qual obter as classes
   * @returns Uma string com todas as classes CSS concatenadas
   */
  getAllClasses(status: string): string {
    const style = this.getStatusStyle(status);
    if (!style) {
      return 'text-secondary bg-secondary-subtle border-secondary';
    }

    let classes = [];
    
    if (style.textClass) classes.push(style.textClass);
    if (style.bgClass) classes.push(style.bgClass);
    if (style.borderClass) classes.push(style.borderClass);
    
    return classes.join(' ');
  }

  /**
   * Normaliza um status para comparação
   * @private
   */
  private normalizeStatus(status: string): string {
    if (!status) return '';
    
    return status
      .toLowerCase()
      .replace(/[_\s-]/g, '')
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");  // Remove acentos
  }
}