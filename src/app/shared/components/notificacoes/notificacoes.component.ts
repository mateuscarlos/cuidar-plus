import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { trigger, style, transition, animate, state } from '@angular/animations';
import { NotificacaoService, Notificacao } from '../../services/notificacao.service';

@Component({
  selector: 'app-notificacoes',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notificacoes-container">
      <div *ngFor="let notificacao of notificacoes; let i = index" 
           class="notificacao-toast" 
           [ngClass]="getNotificacaoClass(notificacao)"
           [@toastAnimation]="notificacao.visible ? 'visible' : 'hidden'">
        <div class="toast-header">
          <i class="bi me-2" [ngClass]="getIconClass(notificacao)"></i>
          <strong class="me-auto">{{ getTitle(notificacao) }}</strong>
          <button type="button" class="btn-close" (click)="removerNotificacao(i)"></button>
        </div>
        <div class="toast-body">
          {{ notificacao.mensagem }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .notificacoes-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1050;
      max-width: 350px;
    }
    
    .notificacao-toast {
      margin-bottom: 10px;
      box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.1);
      opacity: 0.95;
    }
    
    .toast-success {
      background-color: #d4edda;
      color: #155724;
      border-color: #c3e6cb;
    }
    
    .toast-info {
      background-color: #d1ecf1;
      color: #0c5460;
      border-color: #bee5eb;
    }
    
    .toast-warning {
      background-color: #fff3cd;
      color: #856404;
      border-color: #ffeeba;
    }
    
    .toast-error {
      background-color: #f8d7da;
      color: #721c24;
      border-color: #f5c6cb;
    }
    
    .toast-header {
      background-color: rgba(255, 255, 255, 0.85);
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    }
  `],
  animations: [
    trigger('toastAnimation', [
      state('hidden', style({
        opacity: 0,
        transform: 'translateX(100%)'
      })),
      state('visible', style({
        opacity: 1,
        transform: 'translateX(0)'
      })),
      transition('hidden => visible', animate('300ms ease-in')),
      transition('visible => hidden', animate('300ms ease-out'))
    ])
  ]
})
export class NotificacoesComponent implements OnInit, OnDestroy {
  notificacoes: (Notificacao & { visible: boolean })[] = [];
  private destroy$ = new Subject<void>();
  
  constructor(private notificacaoService: NotificacaoService) {}
  
  ngOnInit(): void {
    this.notificacaoService.notificacao$
      .pipe(takeUntil(this.destroy$))
      .subscribe(notificacao => {
        this.adicionarNotificacao(notificacao);
      });
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  private adicionarNotificacao(notificacao: Notificacao): void {
    const novaNot = { ...notificacao, visible: true };
    this.notificacoes.unshift(novaNot);
    
    setTimeout(() => {
      const index = this.notificacoes.indexOf(novaNot);
      if (index !== -1) {
        this.notificacoes[index].visible = false;
        
        // Remover após a animação
        setTimeout(() => {
          this.notificacoes = this.notificacoes.filter(n => n !== novaNot);
        }, 300);
      }
    }, notificacao.duracao || 5000);
  }
  
  removerNotificacao(index: number): void {
    if (index >= 0 && index < this.notificacoes.length) {
      this.notificacoes[index].visible = false;
      
      // Remover após a animação
      setTimeout(() => {
        this.notificacoes.splice(index, 1);
      }, 300);
    }
  }
  
  getNotificacaoClass(notificacao: Notificacao): string {
    return `toast-${notificacao.tipo}`;
  }
  
  getIconClass(notificacao: Notificacao): string {
    switch (notificacao.tipo) {
      case 'success':
        return 'bi-check-circle-fill';
      case 'info':
        return 'bi-info-circle-fill';
      case 'warning':
        return 'bi-exclamation-triangle-fill';
      case 'error':
        return 'bi-exclamation-octagon-fill';
      default:
        return 'bi-info-circle-fill';
    }
  }
  
  getTitle(notificacao: Notificacao): string {
    switch (notificacao.tipo) {
      case 'success':
        return 'Sucesso';
      case 'info':
        return 'Informação';
      case 'warning':
        return 'Aviso';
      case 'error':
        return 'Erro';
      default:
        return 'Notificação';
    }
  }
}