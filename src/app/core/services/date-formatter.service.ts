import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateFormatterService {
  // Constantes para os formatos padrões
  readonly DISPLAY_FORMAT = 'DD/MM/YYYY HH:mm';
  readonly DISPLAY_DATE_ONLY = 'DD/MM/YYYY';
  readonly DISPLAY_TIME_ONLY = 'HH:mm';
  readonly BACKEND_FORMAT = 'DD/MM/YYYY HH:mm';
  readonly BACKEND_DATE_ONLY = 'DD/MM/YYYY';
  readonly HTML_DATE_FORMAT = 'YYYY-MM-DD';
  readonly HTML_DATETIME_FORMAT = 'YYYY-MM-DDThh:mm';
  readonly TIMEZONE = 'America/Sao_Paulo';

  /**
   * Verifica se a data está em formato do backend (DD/MM/YYYY ou DD/MM/YYYY HH:mm)
   */
  isBackendFormat(date: string | null | undefined): boolean {
    if (!date) return false;
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}(?: \d{2}:\d{2})?$/;
    return dateRegex.test(date);
  }

  /**
   * Converte para formato de exibição completo (DD/MM/YYYY HH:mm)
   */
  toDisplayFormat(date: string | Date | null | undefined): string {
    if (!date) return '';
    const dateObj = this.parseToDate(date);
    if (!this.isValidDate(dateObj)) return '';
    
    // Usamos UTC methods para evitar problemas de timezone
    const day = String(dateObj.getUTCDate()).padStart(2, '0');
    const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
    const year = dateObj.getUTCFullYear();
    const hours = String(dateObj.getUTCHours()).padStart(2, '0');
    const minutes = String(dateObj.getUTCMinutes()).padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  /**
   * Converte para formato de exibição apenas data (DD/MM/YYYY)
   */
  toDisplayDateOnly(date: string | Date | null | undefined): string {
    if (!date) return '';
    const dateObj = this.parseToDate(date);
    if (!this.isValidDate(dateObj)) return '';
    
    // Usamos UTC methods para evitar problemas de timezone
    const day = String(dateObj.getUTCDate()).padStart(2, '0');
    const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
    const year = dateObj.getUTCFullYear();
    
    return `${day}/${month}/${year}`;
  }

  /**
   * Converte para formato de exibição apenas hora (HH:mm)
   */
  toDisplayTimeOnly(date: string | Date | null | undefined): string {
    if (!date) return '';
    const dateObj = this.parseToDate(date);
    if (!this.isValidDate(dateObj)) return '';
    
    // Usamos UTC methods para evitar problemas de timezone
    const hours = String(dateObj.getUTCHours()).padStart(2, '0');
    const minutes = String(dateObj.getUTCMinutes()).padStart(2, '0');
    
    return `${hours}:${minutes}`;
  }

  /**
   * Converte para formato do backend completo (DD/MM/YYYY HH:mm)
   */
  toBackendFormat(date: string | Date | null | undefined): string {
    // Se já estiver no formato do backend, retorna diretamente
    if (typeof date === 'string' && this.isBackendFormat(date)) return date;
    
    if (!date) return '';
    const dateObj = this.parseToDate(date);
    if (!this.isValidDate(dateObj)) return '';
    
    // Usamos UTC methods para evitar problemas de timezone
    const day = String(dateObj.getUTCDate()).padStart(2, '0');
    const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
    const year = dateObj.getUTCFullYear();
    const hours = String(dateObj.getUTCHours()).padStart(2, '0');
    const minutes = String(dateObj.getUTCMinutes()).padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  /**
   * Converte para formato do backend apenas data (DD/MM/YYYY)
   */
  toBackendDateOnlyFormat(date: string | Date | null | undefined): string {
    if (!date) return '';
    
    // Se já estiver no formato do backend, retorna apenas a parte da data
    if (typeof date === 'string' && this.isBackendFormat(date)) {
      return date.split(' ')[0];
    }
    
    const dateObj = this.parseToDate(date);
    if (!this.isValidDate(dateObj)) return '';
    
    // Usamos UTC methods para evitar problemas de timezone
    const day = String(dateObj.getUTCDate()).padStart(2, '0');
    const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
    const year = dateObj.getUTCFullYear();
    
    return `${day}/${month}/${year}`;
  }

  /**
   * Converte para formato HTML para inputs (YYYY-MM-DD)
   */
  toHtmlDateFormat(date: string | Date | null | undefined): string {
    if (!date) return '';
    const dateObj = this.parseToDate(date);
    if (!this.isValidDate(dateObj)) return '';
    
    // Usamos UTC methods para evitar problemas de timezone
    const year = dateObj.getUTCFullYear();
    const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getUTCDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }

  /**
   * Converte para formato HTML datetime-local (YYYY-MM-DDThh:mm)
   */
  toHtmlDateTimeFormat(date: string | Date | null | undefined): string {
    if (!date) return '';
    const dateObj = this.parseToDate(date);
    if (!this.isValidDate(dateObj)) return '';
    
    // Usamos UTC methods para evitar problemas de timezone
    const year = dateObj.getUTCFullYear();
    const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getUTCDate()).padStart(2, '0');
    const hours = String(dateObj.getUTCHours()).padStart(2, '0');
    const minutes = String(dateObj.getUTCMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  /**
   * Analisa uma string ou objeto Date para um objeto Date
   * Mantém a data exata sem ajustes de timezone
   */
  public parseToDate(date: string | Date | null | undefined): Date {
    if (!date) return new Date(0);
    
    if (date instanceof Date) {
      // Criamos uma data UTC a partir dos componentes da data local para preservar os valores exatos
      return new Date(Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds()
      ));
    }
    
    // Se for uma string no formato do backend brasileiro (DD/MM/YYYY ou DD/MM/YYYY HH:mm)
    if (this.isBackendFormat(date)) {
      const parts = date.split(/[\/\s:]/);
      
      if (parts.length >= 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Mês em JS é 0-indexed
        const year = parseInt(parts[2], 10);
        
        if (parts.length >= 5) {
          const hours = parseInt(parts[3], 10);
          const minutes = parseInt(parts[4], 10);
          // Usamos UTC para preservar os valores exatos
          return new Date(Date.UTC(year, month, day, hours, minutes));
        }
        
        return new Date(Date.UTC(year, month, day));
      }
    }
    
    // Se for uma string no formato HTML (YYYY-MM-DD ou YYYY-MM-DDThh:mm)
    if (typeof date === 'string' && (date.includes('-') || date.includes('T'))) {
      if (date.includes('T')) {
        // Formato YYYY-MM-DDThh:mm
        const [datePart, timePart] = date.split('T');
        const [year, month, day] = datePart.split('-').map(Number);
        let hours = 0, minutes = 0;
        
        if (timePart) {
          [hours, minutes] = timePart.split(':').map(Number);
        }
        
        // Usamos UTC para preservar os valores exatos
        return new Date(Date.UTC(year, month - 1, day, hours, minutes));
      } else {
        // Formato YYYY-MM-DD
        const [year, month, day] = date.split('-').map(Number);
        return new Date(Date.UTC(year, month - 1, day));
      }
    }
    
    // Para outros formatos, criamos data UTC e depois ajustamos
    try {
      const tempDate = new Date(date);
      return new Date(Date.UTC(
        tempDate.getFullYear(),
        tempDate.getMonth(),
        tempDate.getDate(),
        tempDate.getHours(),
        tempDate.getMinutes(),
        tempDate.getSeconds()
      ));
    } catch (error) {
      console.error('Erro ao analisar data:', error);
      return new Date(0);
    }
  }

  /**
   * Verifica se uma data é válida
   */
  private isValidDate(date: Date): boolean {
    return !isNaN(date.getTime());
  }

  /**
   * Formata datas para uso em formulários
   */
  formatarDataParaFormulario(data: any, campo: string): any {
    if (!data) return data;
    
    // Se o campo for uma data, formatar corretamente
    if (campo.includes('data_')) {
      return this.toBackendDateOnlyFormat(data);
    }
    
    // Se for um campo que inclui data e hora
    if (campo.includes('_hora') || campo.includes('created_at') || campo.includes('updated_at')) {
      return this.toBackendFormat(data);
    }
    
    return data;
  }

  /**
   * Calcula a idade a partir da data de nascimento
   */
  calculateAge(birthDate: Date | string | null): number | null {
    if (!birthDate) return null;
    
    const birth = this.parseToDate(birthDate);
    
    // Verificar se é uma data válida
    if (!this.isValidDate(birth)) {
      return null;
    }
    
    const today = new Date();
    const birthYear = birth.getUTCFullYear();
    const birthMonth = birth.getUTCMonth();
    const birthDay = birth.getUTCDate();
    
    let age = today.getFullYear() - birthYear;
    const currentMonth = today.getMonth();
    
    if (currentMonth < birthMonth || (currentMonth === birthMonth && today.getDate() < birthDay)) {
      age--;
    }
    
    return age;
  }
}