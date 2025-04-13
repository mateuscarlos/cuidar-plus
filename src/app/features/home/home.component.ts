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
      
      color: 'primary',
      inConstruction: false
    },
    {
      title: 'Farmácia',
      description: 'Controle de medicamentos e prescrições',
      icon: 'bi-capsule',
      route: '/farmacia',
      
      color: 'success',
      inConstruction: true
    },
    {
      title: 'Relatórios',
      description: 'Visualize estatísticas e relatórios detalhados',
      icon: 'bi-file-earmark-bar-graph',
      route: '/relatorios',
      
      color: 'info',
      inConstruction: true
    },
    {
      title: 'Configurações',
      description: 'Personalize o sistema de acordo com suas necessidades',
      icon: 'bi-gear-fill',
      route: '/configuracoes',
      
      color: 'secondary',
      inConstruction: false
    }
  ];
}
