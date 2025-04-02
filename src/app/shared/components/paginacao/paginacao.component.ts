import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-paginacao',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav aria-label="Navegação de páginas" *ngIf="totalItens > itensPorPagina">
      <ul class="pagination justify-content-center">
        <li class="page-item" [class.disabled]="paginaAtual === 1">
          <a class="page-link" href="javascript:void(0)" (click)="mudarPagina(paginaAtual - 1)" aria-label="Anterior">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        
        <ng-container *ngFor="let pagina of paginas">
          <li class="page-item" [class.active]="pagina === paginaAtual">
            <a class="page-link" href="javascript:void(0)" (click)="mudarPagina(pagina)">{{ pagina }}</a>
          </li>
        </ng-container>
        
        <li class="page-item" [class.disabled]="paginaAtual === totalPaginas">
          <a class="page-link" href="javascript:void(0)" (click)="mudarPagina(paginaAtual + 1)" aria-label="Próximo">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  `,
  styles: [`
    .pagination {
      margin-bottom: 0;
    }
  `]
})
export class PaginacaoComponent {
  @Input() paginaAtual: number = 1;
  @Input() itensPorPagina: number = 10;
  @Input() totalItens: number = 0;
  @Input() maxPaginas: number = 5;
  
  @Output() mudancaPagina = new EventEmitter<number>();
  
  get totalPaginas(): number {
    return Math.ceil(this.totalItens / this.itensPorPagina);
  }
  
  get paginas(): number[] {
    const meio = Math.floor(this.maxPaginas / 2);
    
    let inicio = this.paginaAtual - meio;
    if (inicio < 1) inicio = 1;
    
    let fim = inicio + this.maxPaginas - 1;
    if (fim > this.totalPaginas) {
      fim = this.totalPaginas;
      inicio = Math.max(1, fim - this.maxPaginas + 1);
    }
    
    const paginas: number[] = [];
    for (let i = inicio; i <= fim; i++) {
      paginas.push(i);
    }
    
    return paginas;
  }
  
  mudarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas && pagina !== this.paginaAtual) {
      this.mudancaPagina.emit(pagina);
    }
  }
}