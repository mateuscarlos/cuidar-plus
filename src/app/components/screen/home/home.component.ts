import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <section class="row text-center">
      <article class="col-md-6 col-lg-3 mb-4">
        <div class="card h-100 shadow">
          <header class="card-header">
            <h2 class="card-title text-primary">Usuários</h2>
          </header>
          <div class="card-body">
            <p class="card-text">Gerencie o cadastro e edição de usuários do sistema.</p>
            <button class="btn btn-primary" (click)="navegarPara('usuarios')">Acessar</button>
          </div>
        </div>
      </article>
      <article class="col-md-6 col-lg-3 mb-4">
        <div class="card h-100 shadow">
          <header class="card-header">
            <h2 class="card-title text-success">Farmácia</h2>
          </header>
          <div class="card-body">
            <p class="card-text">Controle de insumos e medicamentos.</p>
            <button class="btn btn-success" (click)="navegarPara('farmacia')">Acessar</button>
          </div>
        </div>
      </article>
      <article class="col-md-6 col-lg-3 mb-4">
        <div class="card h-100 shadow">
          <header class="card-header">
            <h2 class="card-title text-danger">Pacientes</h2>
          </header>
          <div class="card-body">
            <p class="card-text">Gerencie informações dos pacientes.</p>
            <button class="btn btn-danger" (click)="navegarPara('pacientes')">Acessar</button>
          </div>
        </div>
      </article>
      <article class="col-md-6 col-lg-3 mb-4">
        <div class="card h-100 shadow">
          <header class="card-header">
            <h2 class="card-title text-warning">Relatórios</h2>
          </header>
          <div class="card-body">
            <p class="card-text">Visualize e gere relatórios de saúde.</p>
            <button class="btn btn-warning" (click)="navegarPara('relatorios')">Acessar</button>
          </div>
        </div>
      </article>
    </section>
  `,
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor(private router: Router) {}

  navegarPara(pagina: string): void {
    this.router.navigate([pagina]);
  }
}