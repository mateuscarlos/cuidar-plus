import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-paciente-avatar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="avatar-circle {{backgroundClass}} {{sizeClass}}" [ngStyle]="customStyle">
      <span>{{iniciais}}</span>
    </div>
  `,
  styles: [`
    .avatar-circle {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      color: #333;
      font-weight: 500;
      overflow: hidden;
    }
    
    .size-sm {
      width: 40px;
      height: 40px;
      font-size: 16px;
    }
    
    .size-md {
      width: 50px;
      height: 50px;
      font-size: 20px;
    }
    
    .size-lg {
      width: 60px;
      height: 60px;
      font-size: 24px;
    }
  `]
})
export class PacienteAvatarComponent {
  @Input() nome: string = '';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() backgroundClass: string = 'bg-light';
  @Input() customStyle: {[key: string]: string} = {};
  
  get iniciais(): string {
    if (!this.nome) return '';
    
    const partes = this.nome.split(' ');
    if (partes.length === 1) {
      return partes[0].charAt(0).toUpperCase();
    }
    
    return (partes[0].charAt(0) + partes[partes.length > 1 ? 1 : 0].charAt(0)).toUpperCase();
  }
  
  get sizeClass(): string {
    return `size-${this.size}`;
  }
}