import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  cards = [
    {
      title: 'Pacientes',
      description: 'Gerencie informações dos pacientes e histórico médico',
      icon: 'bi-people-fill',
      route: '/pacientes',
      count: 158,
      color: 'primary'
    },
    {
      title: 'Farmácia',
      description: 'Controle de medicamentos e prescrições',
      icon: 'bi-capsule',
      route: '/farmacia',
      count: 72,
      color: 'success'
    },
    {
      title: 'Relatórios',
      description: 'Visualize estatísticas e relatórios detalhados',
      icon: 'bi-file-earmark-bar-graph',
      route: '/relatorios',
      count: 25,
      color: 'info'
    },
    {
      title: 'Configurações',
      description: 'Personalize o sistema de acordo com suas necessidades',
      icon: 'bi-gear-fill',
      route: '/configuracoes',
      count: null,
      color: 'secondary'
    }
  ];
}
