import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export type TipoNotificacao = 'success' | 'info' | 'warning' | 'error';

export interface Notificacao {
  tipo: TipoNotificacao;
  mensagem: string;
  duracao?: number; // em milissegundos
}

@Injectable({
  providedIn: 'root'
})
export class NotificacaoService {
  private notificacaoSubject = new Subject<Notificacao>();
  
  notificacao$ = this.notificacaoSubject.asObservable();
  
  mostrarSucesso(mensagem: string, duracao: number = 5000): void {
    this.mostrar('success', mensagem, duracao);
  }
  
  mostrarInfo(mensagem: string, duracao: number = 5000): void {
    this.mostrar('info', mensagem, duracao);
  }
  
  mostrarAviso(mensagem: string, duracao: number = 5000): void {
    this.mostrar('warning', mensagem, duracao);
  }
  
  mostrarErro(mensagem: string, duracao: number = 5000): void {
    this.mostrar('error', mensagem, duracao);
  }
  
  private mostrar(tipo: TipoNotificacao, mensagem: string, duracao: number): void {
    this.notificacaoSubject.next({ tipo, mensagem, duracao });
  }
}