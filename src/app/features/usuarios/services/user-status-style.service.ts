import { Injectable } from '@angular/core';
import { UserStatus } from '../models/user.model';

// Interface para classes de estilo de status
export interface UserStatusClasses {
  bgColor: string;
  textColor: string;
  borderColor: string;
  icon: string;
  badgeClass: string;
}

// Mapeamento de cada status para suas respectivas classes Bootstrap 5.3
export const USER_STATUS_BOOTSTRAP_CLASSES: Record<UserStatus, UserStatusClasses> = {
  [UserStatus.ATIVO]: {
    bgColor: 'bg-success-subtle',
    textColor: 'text-success',
    borderColor: 'border-success',
    icon: 'bi bi-check-circle-fill',
    badgeClass: 'bg-success'
  },
  [UserStatus.INATIVO]: {
    bgColor: 'bg-danger-subtle',
    textColor: 'text-danger',
    borderColor: 'border-danger',
    icon: 'bi bi-x-circle-fill',
    badgeClass: 'bg-secondary'
  },
  [UserStatus.AFASTADO_ACIDENTE_DE_TRABALHO]: {
    bgColor: 'bg-warning-subtle',
    textColor: 'text-warning',
    borderColor: 'border-warning',
    icon: 'bi bi-exclamation-triangle-fill',
    badgeClass: 'bg-warning text-dark'
  },
  [UserStatus.AFASTADO_OUTROS]: {
    bgColor: 'bg-warning-subtle',
    textColor: 'text-warning',
    borderColor: 'border-warning',
    icon: 'bi bi-exclamation-triangle-fill',
    badgeClass: 'bg-warning text-dark'
  },
  [UserStatus.FERIAS]: {
    bgColor: 'bg-info-subtle',
    textColor: 'text-info',
    borderColor: 'border-info',
    icon: 'bi bi-calendar2-check-fill',
    badgeClass: 'bg-info'
  },
  [UserStatus.LICENCA_MEDICA]: {
    bgColor: 'bg-danger-subtle',
    textColor: 'text-danger',
    borderColor: 'border-danger',
    icon: 'bi bi-hospital-fill',
    badgeClass: 'bg-danger'
  },
  [UserStatus.LICENCA_MATERNIDADE]: {
    bgColor: 'bg-pink-subtle',
    textColor: 'text-pink',
    borderColor: 'border-pink',
    icon: 'bi bi-heart-fill',
    badgeClass: 'bg-pink'
  },
  [UserStatus.LICENCA_PATERNIDADE]: {
    bgColor: 'bg-primary-subtle',
    textColor: 'text-primary',
    borderColor: 'border-primary',
    icon: 'bi bi-heart-fill',
    badgeClass: 'bg-primary'
  },
  [UserStatus.SUSPENSAO_CONTRTATUAL]: {
    bgColor: 'bg-dark-subtle',
    textColor: 'text-dark',
    borderColor: 'border-dark',
    icon: 'bi bi-pause-circle-fill',
    badgeClass: 'bg-dark'
  },
  [UserStatus.AFASTAMENTO_NAO_REMUNERADO]: {
    bgColor: 'bg-secondary-subtle',
    textColor: 'text-secondary',
    borderColor: 'border-secondary',
    icon: 'bi bi-slash-circle-fill',
    badgeClass: 'bg-secondary'
  },
  [UserStatus.APOSENTADO]: {
    bgColor: 'bg-success-subtle',
    textColor: 'text-success',
    borderColor: 'border-success',
    icon: 'bi bi-award-fill',
    badgeClass: 'bg-success'
  }
};

@Injectable({
  providedIn: 'root'
})
export class UserStatusStyleService {
  /**
   * Retorna as classes Bootstrap para estilizar elementos baseados no status do usuário
   * @param status Status do usuário
   * @returns Objeto com classes Bootstrap 5.3
   */
  getStatusClasses(status: string): UserStatusClasses {
    // Verificar se o status existe no enum
    const statusKey = Object.entries(UserStatus)
      .find(([_, value]) => value === status)?.[0] as keyof typeof UserStatus;
    
    if (statusKey && UserStatus[statusKey]) {
      return USER_STATUS_BOOTSTRAP_CLASSES[UserStatus[statusKey]];
    }
    
    // Retornar classes padrão se o status não for encontrado
    return {
      bgColor: 'bg-secondary-subtle',
      textColor: 'text-secondary',
      borderColor: 'border-secondary',
      icon: 'bi bi-question-circle-fill',
      badgeClass: 'bg-secondary'
    };
  }
  
  getBgClass(status: string): string {
    return this.getStatusClasses(status).bgColor;
  }
  
  getTextClass(status: string): string {
    return this.getStatusClasses(status).textColor;
  }
  
  getBorderClass(status: string): string {
    return this.getStatusClasses(status).borderColor;
  }
  
  getIcon(status: string): string {
    return this.getStatusClasses(status).icon;
  }
  
  getBadgeClass(status: string): string {
    return this.getStatusClasses(status).badgeClass;
  }
  
  getAllClasses(status: string): string {
    const classes = this.getStatusClasses(status);
    return `${classes.bgColor} ${classes.textColor} ${classes.borderColor}`;
  }
}