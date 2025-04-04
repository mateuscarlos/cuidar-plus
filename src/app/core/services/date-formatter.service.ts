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
    
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  /**
   * Converte para formato de exibição apenas data (DD/MM/YYYY)
   */
  toDisplayDateOnly(date: string | Date | null | undefined): string {
    if (!date) return '';
    const dateObj = this.parseToDate(date);
    if (!this.isValidDate(dateObj)) return '';
    
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    
    return `${day}/${month}/${year}`;
  }

  /**
   * Converte para formato de exibição apenas hora (HH:mm)
   */
  toDisplayTimeOnly(date: string | Date | null | undefined): string {
    if (!date) return '';
    const dateObj = this.parseToDate(date);
    if (!this.isValidDate(dateObj)) return '';
    
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    
    return `${hours}:${minutes}`;
  }

  /**
   * Converte para formato do backend completo (DD/MM/YYYY HH:mm)
   * Garante que a data está na timezone correta para o Brasil
   */
  toBackendFormat(date: string | Date | null | undefined): string {
    // Se já estiver no formato do backend, retorna diretamente
    if (typeof date === 'string' && this.isBackendFormat(date)) return date;
    
    if (!date) return '';
    const dateObj = this.parseToDate(date);
    if (!this.isValidDate(dateObj)) return '';
    
    // Garante que a data está na timezone de São Paulo antes de formatar
    const options = { timeZone: this.TIMEZONE };
    const formatter = new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: this.TIMEZONE
    });
    
    return formatter.format(dateObj).replace(',', '');
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
    
    // Garante que a data está na timezone de São Paulo antes de formatar
    const formatter = new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: this.TIMEZONE
    });
    
    return formatter.format(dateObj);
  }

  /**
   * Converte para formato HTML para inputs (YYYY-MM-DD)
   */
  toHtmlDateFormat(date: string | Date | null | undefined): string {
    if (!date) return '';
    const dateObj = this.parseToDate(date);
    if (!this.isValidDate(dateObj)) return '';
    
    // Ajustamos para a timezone do Brasil
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }

  /**
   * Converte para formato HTML datetime-local (YYYY-MM-DDThh:mm)
   */
  toHtmlDateTimeFormat(date: string | Date | null | undefined): string {
    if (!date) return '';
    const dateObj = this.parseToDate(date);
    if (!this.isValidDate(dateObj)) return '';
    
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  /**
   * Analisa uma string ou objeto Date para um objeto Date
   * respeitando a timezone de São Paulo
   */
  public parseToDate(date: string | Date): Date {
    if (date instanceof Date) {
      return date;
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
          // Cria a data com timezone local
          const newDate = new Date(year, month, day, hours, minutes);
          return newDate;
        }
        
        return new Date(year, month, day);
      }
    }
    
    // Tentativa de análise padrão
    try {
      return new Date(date);
    } catch (error) {
      console.error('Erro ao analisar data:', error);
      return new Date();
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
   * Garante que as datas estejam sempre no formato correto para as APIs
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
   * Ajusta o fuso horário para a data gerada pelo input datetime-local
   * para garantir que a data não mude ao ser enviada ao backend
   */
  ajustarFusoHorarioInput(dateStr: string): Date {
    if (!dateStr) return new Date();
    
    // O formato do input é YYYY-MM-DDThh:mm
    const [datePart, timePart] = dateStr.split('T');
    const [year, month, day] = datePart.split('-').map(Number);
    const [hours, minutes] = timePart ? timePart.split(':').map(Number) : [0, 0];
    
    // Cria data usando a data/hora informada diretamente
    return new Date(year, month - 1, day, hours, minutes);
  }

  /**
   * Converte a data para ISO string mantendo o fuso horário correto
   */
  toISOWithTimezone(date: Date | string): string {
    if (!date) return '';
    const dateObj = date instanceof Date ? date : this.parseToDate(date);
    if (!this.isValidDate(dateObj)) return '';
    
    return dateObj.toISOString();
  }
}