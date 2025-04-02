import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="badge rounded-pill {{statusInfo.classe}}">
      {{statusInfo.texto}}
    </span>
  `,
  styles: []
})
export class StatusBadgeComponent implements OnInit {
  @Input() status: string = '';
  
  statusInfo: {texto: string, classe: string} = { texto: '', classe: '' };
  
  private statusMap: {[key: string]: {texto: string, classe: string}} = {
    'em-avaliacao': { texto: 'Em Avaliação', classe: 'bg-warning' },
    'ativo': { texto: 'Ativo', classe: 'bg-success' },
    'inativo': { texto: 'Inativo', classe: 'bg-secondary' },
    'alta': { texto: 'Alta', classe: 'bg-info' },
    'em-tratamento': { texto: 'Em Tratamento', classe: 'bg-warning text-dark' },
    'obito': { texto: 'Óbito', classe: 'bg-danger' }
  };
  
  ngOnInit() {
    this.statusInfo = this.getStatusInfo(this.status);
  }
  
  private getStatusInfo(statusCode: string): {texto: string, classe: string} {
    return this.statusMap[statusCode] || { texto: statusCode, classe: 'bg-secondary' };
  }
}