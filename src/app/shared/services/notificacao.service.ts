import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';

export type TipoNotificacao = 'success' | 'info' | 'warning' | 'error';

export interface Notificacao {
  tipo: TipoNotificacao;
  mensagem: string;
  duracao?: number; // em milissegundos
}

@Injectable({
  providedIn: 'root',
})
export class NotificacaoService {
  private notificacaoSubject = new Subject<Notificacao>();
  
  notificacao$ = this.notificacaoSubject.asObservable();

  constructor(private snackBar: MatSnackBar) {}

  mostrarSucesso(mensagem: string): void {
    this.exibirAlerta(mensagem, 'alert-success');
  }

  mostrarInfo(mensagem: string, duracao: number = 5000): void {
    this.mostrar('info', mensagem, duracao);
  }

  mostrarAviso(mensagem: string): void {
    this.exibirAlerta(mensagem, 'alert-warning');
  }

  mostrarErro(mensagem: string): void {
    this.exibirAlerta(mensagem, 'alert-danger');
  }

  private mostrar(tipo: TipoNotificacao, mensagem: string, duracao: number): void {
    this.notificacaoSubject.next({ tipo, mensagem, duracao });
  }

  private exibirAlerta(mensagem: string, tipo: string): void {
    const alertContainer = document.getElementById('alert-container');
    if (alertContainer) {
      const alertElement = document.createElement('div');
      alertElement.className = `alert ${tipo} alert-dismissible fade show`;
      alertElement.role = 'alert';
      alertElement.innerHTML = `
        ${mensagem}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      `;
      alertContainer.appendChild(alertElement);

      setTimeout(() => {
        alertElement.classList.remove('show');
        alertElement.classList.add('fade');
        setTimeout(() => alertElement.remove(), 300);
      }, 3000);
    }
  }
}