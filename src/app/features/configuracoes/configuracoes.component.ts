import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-configuracoes',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid py-4">
      <div class="card border-0 shadow-sm">
        <div class="card-header bg-light">
          <h5 class="card-title mb-0"><i class="bi bi-gear-fill me-2"></i>Configurações</h5>
        </div>
        <div class="card-body text-center py-5">
          <div class="mb-3">
            <i class="bi bi-wrench-adjustable display-1 text-secondary"></i>
          </div>
          <h3 class="mb-3">Módulo em Desenvolvimento</h3>
          <p class="text-muted mb-4">
            O módulo de configurações está em construção. Aqui você poderá personalizar preferências do sistema,
            gerenciar usuários e definir permissões.
          </p>
          <div class="progress mb-4" style="height: 8px;">
            <div class="progress-bar bg-info" role="progressbar" style="width: 15%;" 
                 aria-valuenow="15" aria-valuemin="0" aria-valuemax="100"></div>
          </div>
          <p class="text-muted small mb-0">Desenvolvimento: 15% concluído</p>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ConfiguracoesComponent {
}
