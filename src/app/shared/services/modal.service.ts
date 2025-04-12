import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

export interface ConfirmationDialogConfig {
  title: string;
  message: string | SafeHtml;
  detailMessage: string | SafeHtml;
  confirmText?: string;
  cancelText?: string;
  type?: 'primary' | 'success' | 'danger' | 'warning' | 'info';
  missingFields?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private isOpenSubject = new BehaviorSubject<boolean>(false);
  isOpen$ = this.isOpenSubject.asObservable();
  
  private confirmationSubject = new BehaviorSubject<boolean | null>(null);
  
  config: ConfirmationDialogConfig = {
    title: '',
    message: '',
    detailMessage: '',
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
    type: 'primary'
  };

  constructor(private sanitizer: DomSanitizer) {}

  confirm(config: ConfirmationDialogConfig): Observable<boolean> {
    this.config = {
      ...config,
      confirmText: config.confirmText || 'Confirmar',
      cancelText: config.cancelText || 'Cancelar',
      type: config.type || 'primary'
    };
    
    // Sanitizar campos HTML
    if (typeof this.config.message === 'string' && this.containsHtml(this.config.message)) {
      this.config.message = this.sanitizer.bypassSecurityTrustHtml(this.config.message);
    }
    
    // Formatar campos faltantes de forma segura
    if (this.config.missingFields && this.config.missingFields.length > 0) {
      const safeItems = this.config.missingFields.map(field => {
        // Remover possível HTML do campo para prevenir XSS
        const safeField = field.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return `<li>${safeField}</li>`;
      }).join('');
      
      const listHtml = `<ul class="mb-0 ps-3">${safeItems}</ul>`;
      
      // Combinar a mensagem original com a lista de campos faltantes
      const currentMessage = typeof this.config.message === 'string' 
        ? this.config.message 
        : this.config.message.toString();
        
      this.config.message = this.sanitizer.bypassSecurityTrustHtml(`${currentMessage} ${listHtml}`);
      this.config.missingFields = [];
    }
    
    this.confirmationSubject.next(null);
    this.isOpenSubject.next(true);
    
    return this.confirmationSubject.asObservable().pipe(
      filter(result => result !== null),
      take(1)
    ) as Observable<boolean>;
  }

  closeModal(confirmed: boolean): void {
    this.isOpenSubject.next(false);
    this.confirmationSubject.next(confirmed);
  }
  
  private containsHtml(text: string): boolean {
    return /<[a-z][\s\S]*>/i.test(text);
  }
}