import { Injectable } from '@angular/core';
import { StatusPaciente, STATUS_BOOTSTRAP_CLASSES } from '../../features/pacientes/models/paciente.model';

@Injectable({
  providedIn: 'root'
})
export class StatusStyleService {
  /**
   * Retorna a classe CSS para a cor de fundo com base no status
   */
  getBgClass(status: string | undefined | null): string {
    if (!status) return '';
    const statusKey = this.getStatusKey(status);
    return statusKey ? STATUS_BOOTSTRAP_CLASSES[statusKey].bgColor : '';
  }

  /**
   * Retorna a classe CSS para a cor de texto com base no status
   */
  getTextClass(status: string | undefined | null): string {
    if (!status) return '';
    const statusKey = this.getStatusKey(status);
    return statusKey ? STATUS_BOOTSTRAP_CLASSES[statusKey].textColor : '';
  }

  /**
   * Retorna a classe CSS para a cor de borda com base no status
   */
  getBorderClass(status: string | undefined | null): string {
    if (!status) return '';
    const statusKey = this.getStatusKey(status);
    return statusKey ? STATUS_BOOTSTRAP_CLASSES[statusKey].borderColor : '';
  }

  /**
   * Retorna a classe de ícone para o status
   */
  getIcon(status: string | undefined | null): string {
    if (!status) return 'bi bi-question-circle';
    const statusKey = this.getStatusKey(status);
    return statusKey ? STATUS_BOOTSTRAP_CLASSES[statusKey].icon : 'bi bi-question-circle';
  }

  /**
   * Retorna todas as classes CSS para um status (background, texto e borda)
   */
  getAllClasses(status: string | undefined | null): string {
    if (!status) return '';
    return `${this.getBgClass(status)} ${this.getTextClass(status)}`;
  }

  /**
   * Retorna a chave do enum StatusPaciente com base no valor de texto
   * @private
   */
  private getStatusKey(status: string): StatusPaciente | undefined {
    // Verificar se o status já é uma chave válida do enum
    if (Object.values(StatusPaciente).includes(status as StatusPaciente)) {
      return status as StatusPaciente;
    }
    
    // Caso contrário, tentar encontrar uma correspondência parcial
    const statusLower = status.toLowerCase();
    
    for (const key of Object.values(StatusPaciente)) {
      if (key.toLowerCase().includes(statusLower) || 
          statusLower.includes(key.toLowerCase())) {
        return key;
      }
    }
    
    return undefined;
  }
}