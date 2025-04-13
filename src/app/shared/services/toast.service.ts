import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export interface ToastInfo {
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  autoClose?: boolean;
  delay?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSubject = new Subject<ToastInfo>();
  private defaultDelay = 5000; // 5 segundos por padrão

  constructor() { }

  /**
   * Obtém o observable de toasts para que os componentes possam se inscrever
   */
  public getToasts(): Observable<ToastInfo> {
    return this.toastSubject.asObservable();
  }

  /**
   * Exibe uma mensagem toast
   * @param title Título da mensagem
   * @param message Conteúdo da mensagem
   * @param type Tipo da mensagem (success, error, info, warning)
   * @param autoClose Indica se o toast deve ser fechado automaticamente
   * @param delay Tempo em milissegundos antes de fechar automaticamente
   */
  public show(
    title: string, 
    message: string, 
    type: 'success' | 'error' | 'info' | 'warning' = 'info',
    autoClose: boolean = true,
    delay: number = this.defaultDelay
  ): void {
    this.toastSubject.next({
      title,
      message,
      type,
      autoClose,
      delay
    });
  }

  /**
   * Atalho para exibir mensagem de sucesso
   * @param message Mensagem a ser exibida
   * @param title Título da mensagem (opcional)
   */
  public success(message: string, title: string = 'Sucesso'): void {
    this.show(title, message, 'success');
  }

  /**
   * Atalho para exibir mensagem de erro
   * @param message Mensagem a ser exibida
   * @param title Título da mensagem (opcional)
   */
  public error(message: string, title: string = 'Erro'): void {
    this.show(title, message, 'error');
  }

  /**
   * Atalho para exibir mensagem de informação
   * @param message Mensagem a ser exibida
   * @param title Título da mensagem (opcional)
   */
  public info(message: string, title: string = 'Informação'): void {
    this.show(title, message, 'info');
  }

  /**
   * Atalho para exibir mensagem de alerta
   * @param message Mensagem a ser exibida
   * @param title Título da mensagem (opcional)
   */
  public warning(message: string, title: string = 'Atenção'): void {
    this.show(title, message, 'warning');
  }

  showError(message: string): void {
    console.error('Toast Error:', message);
    // Implement toast notification logic here
  }
}