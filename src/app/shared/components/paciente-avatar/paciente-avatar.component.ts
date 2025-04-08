import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-paciente-avatar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="avatar-circle" [style.background-color]="backgroundColor">
      {{ initials }}
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
export class PacienteAvatarComponent implements OnInit {
  @Input() nome: string = '';
  @Input() size: 'sm' | 'md' | 'lg' = 'lg';
  @Input() backgroundClass: string = 'bg-light';
  @Input() customStyle: {[key: string]: string} = {};
  initials: string = '';
  backgroundColor: string = '#f0f0f0';

  ngOnInit() {
    this.initials = this.getInitials(this.nome);
  }

  getInitials(name: string): string {
    if (!name) return '?';
    
    return name
      .split(' ')
      .map(part => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  }
}