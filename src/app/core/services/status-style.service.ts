import { Injectable } from '@angular/core';
import { StatusPaciente, STATUS_BOOTSTRAP_CLASSES } from '../../features/pacientes/models/paciente.model';

@Injectable({
  providedIn: 'root'
})
export class StatusStyleService {
  
  constructor() {}
  
  /**
   * Retorna as classes Bootstrap para estilizar elementos baseados no status do paciente
   * @param status Status do paciente
   * @returns Objeto com classes Bootstrap 5.3
   */
  getStatusClasses(status: string): { bgColor: string, textColor: string, borderColor: string, icon: string } {
    // Verificar se o status existe no enum
    const statusKey = Object.entries(StatusPaciente)
      .find(([_, value]) => value === status)?.[0] as keyof typeof StatusPaciente;
    
    if (statusKey && StatusPaciente[statusKey]) {
      return STATUS_BOOTSTRAP_CLASSES[StatusPaciente[statusKey]];
    }
    
    // Retornar classes padrão se o status não for encontrado
    return {
      bgColor: 'bg-secondary-subtle',
      textColor: 'text-secondary',
      borderColor: 'border-secondary',
      icon: 'bi bi-question-circle-fill'
    };
  }
  
  /**
   * Retorna a classe para a cor de fundo do status
   */
  getBgClass(status: string): string {
    return this.getStatusClasses(status).bgColor;
  }
  
  /**
   * Retorna a classe para a cor do texto do status
   */
  getTextClass(status: string): string {
    return this.getStatusClasses(status).textColor;
  }
  
  /**
   * Retorna a classe para a cor da borda do status
   */
  getBorderClass(status: string): string {
    return this.getStatusClasses(status).borderColor;
  }
  
  /**
   * Retorna o ícone do Bootstrap para o status
   */
  getIcon(status: string): string {
    return this.getStatusClasses(status).icon;
  }
  
  /**
   * Retorna todas as classes combinadas (background, texto e borda)
   */
  getAllClasses(status: string): string {
    const classes = this.getStatusClasses(status);
    return `${classes.bgColor} ${classes.textColor} ${classes.borderColor}`;
  }
}