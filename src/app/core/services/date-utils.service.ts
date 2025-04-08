import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateUtilsService {
  
  /**
   * Formata uma data para o formato de input HTML (YYYY-MM-DD)
   */
  formatDateForInput(dateString: string | Date | null): string {
    if (!dateString) return '';
    
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    
    // Verificar se é uma data válida
    if (isNaN(date.getTime())) {
      return '';
    }
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }
  
  /**
   * Converte uma string de data no formato de input HTML (YYYY-MM-DD) para um objeto Date
   */
  parseInputDate(dateString: string | null): Date | null {
    if (!dateString) return null;
    
    const parts = dateString.split('-');
    if (parts.length !== 3) return null;
    
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    
    const date = new Date(year, month, day);
    
    // Verificar se é uma data válida
    if (isNaN(date.getTime())) {
      return null;
    }
    
    return date;
  }
  
  /**
   * Formata uma data para exibição no formato brasileiro (DD/MM/YYYY)
   */
  formatDateForDisplay(dateString: string | Date | null): string {
    if (!dateString) return '';
    
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    
    // Verificar se é uma data válida
    if (isNaN(date.getTime())) {
      return '';
    }
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  }
  
  /**
   * Calcula a idade a partir da data de nascimento
   */
  calculateAge(birthDate: Date | string | null): number | null {
    if (!birthDate) return null;
    
    const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
    
    // Verificar se é uma data válida
    if (isNaN(birth.getTime())) {
      return null;
    }
    
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }
}