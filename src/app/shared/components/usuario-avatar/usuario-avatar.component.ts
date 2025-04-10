import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-usuario-avatar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="avatar-container" [ngClass]="avatarSizeClass">
      <div class="avatar-circle" [ngStyle]="{ 'background-color': backgroundColor }">
        {{ iniciais }}
      </div>
    </div>
  `,
  styles: [`
    .avatar-container {
      display: inline-block;
    }
    
    .avatar-circle {
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 500;
      text-transform: uppercase;
    }
    
    .avatar-sm .avatar-circle {
      width: 32px;
      height: 32px;
      font-size: 14px;
    }
    
    .avatar-md .avatar-circle {
      width: 48px;
      height: 48px;
      font-size: 18px;
    }
    
    .avatar-lg .avatar-circle {
      width: 64px;
      height: 64px;
      font-size: 24px;
    }
  `]
})
export class UsuarioAvatarComponent implements OnInit {
  @Input() nome: string = '';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  
  iniciais: string = '';
  backgroundColor: string = '#6c757d';
  avatarSizeClass: string = 'avatar-md';
  
  ngOnInit(): void {
    this.gerarIniciais();
    this.gerarCorBackground();
    this.definirTamanho();
  }
  
  private gerarIniciais(): void {
    if (!this.nome) {
      this.iniciais = '?';
      return;
    }
    
    const nomes = this.nome.trim().split(' ');
    
    if (nomes.length === 1) {
      // Se tiver apenas um nome, pegamos as duas primeiras letras
      this.iniciais = nomes[0].substring(0, 2);
    } else {
      // Se tiver mais nomes, pegamos a primeira letra do primeiro e último nome
      this.iniciais = nomes[0].charAt(0) + nomes[nomes.length - 1].charAt(0);
    }
  }
  
  private gerarCorBackground(): void {
    if (!this.nome) return;
    
    // Hash simples do nome para gerar uma cor consistente
    let hash = 0;
    for (let i = 0; i < this.nome.length; i++) {
      hash = this.nome.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Converter para cores hexadecimais
    const colors = [
      '#0d6efd', // blue
      '#6f42c1', // indigo
      '#6610f2', // purple
      '#d63384', // pink
      '#dc3545', // red
      '#fd7e14', // orange
      '#198754', // green
      '#20c997', // teal
      '#0dcaf0', // cyan
      '#6c757d'  // gray
    ];
    
    // Usar o hash para selecionar uma cor do array
    const index = Math.abs(hash) % colors.length;
    this.backgroundColor = colors[index];
  }
  
  private definirTamanho(): void {
    switch (this.size) {
      case 'sm': this.avatarSizeClass = 'avatar-sm'; break;
      case 'lg': this.avatarSizeClass = 'avatar-lg'; break;
      default: this.avatarSizeClass = 'avatar-md';
    }
  }
}