import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
  
  userName: string = 'João Silva';
  hasNotifications: boolean = true;
  
  logout() {
    // Implement logout logic here
    console.log('Logout clicked');
  }
  
  onToggleSidebar() {
    this.toggleSidebar.emit();
  }
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-4">
      <!-- Hero section -->
      <div class="row mb-5">
        <div class="col-12">
          <div class="card bg-light">
            <div class="card-body p-5">
              <h1 class="display-5 fw-bold">Bem-vindo ao Cuidar+</h1>
              <p class="fs-4">Seu parceiro para cuidados de saúde inteligentes e personalizados.</p>
              <button class="btn btn-primary btn-lg mt-3">Saiba mais</button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Content sections -->
      <div class="row g-4 mb-5">
        <div class="col-md-4">
          <div class="card h-100">
            <div class="card-body">
              <h3 class="card-title">Nossos Serviços</h3>
              <p class="card-text">Conheça nossa ampla gama de serviços de saúde e bem-estar.</p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card h-100">
            <div class="card-body">
              <h3 class="card-title">Agendar Consulta</h3>
              <p class="card-text">Agende consultas rapidamente com nossos profissionais certificados.</p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card h-100">
            <div class="card-body">
              <h3 class="card-title">Planos de Saúde</h3>
              <p class="card-text">Descubra nossos planos personalizados para você e sua família.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class HomeComponent {}
