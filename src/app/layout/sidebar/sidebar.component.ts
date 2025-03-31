import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();
  
  menuItems = [
    { 
      title: 'Dashboard', 
      icon: 'bi-speedometer2', 
      route: '/dashboard',
      active: false
    },
    { 
      title: 'Pacientes', 
      icon: 'bi-people', 
      route: '/pacientes',
      active: false
    },
    { 
      title: 'Consultas', 
      icon: 'bi-calendar-check', 
      route: '/consultas',
      active: false
    },
    { 
      title: 'Exames', 
      icon: 'bi-clipboard2-plus', 
      route: '/exames',
      active: false
    },
    { 
      title: 'Medicamentos', 
      icon: 'bi-capsule', 
      route: '/medicamentos',
      active: false
    },
    { 
      title: 'Relatórios', 
      icon: 'bi-file-earmark-bar-graph', 
      route: '/relatorios',
      active: false
    },
    { 
      title: 'Configurações', 
      icon: 'bi-gear', 
      route: '/configuracoes',
      active: false
    }
  ];
  
  constructor(private router: Router) {}
  
  ngOnInit() {
    // Atualizar item ativo baseado na rota atual
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateActiveMenuItem();
    });
    
    // Inicializar item ativo
    this.updateActiveMenuItem();
  }
  
  updateActiveMenuItem() {
    const currentUrl = this.router.url;
    this.menuItems.forEach(item => {
      // Verifica se a rota atual corresponde a este item
      item.active = currentUrl === item.route || 
                    (item.route !== '/dashboard' && currentUrl.startsWith(item.route));
    });
  }
  
  onToggleSidebar() {
    this.toggleSidebar.emit();
  }
}
