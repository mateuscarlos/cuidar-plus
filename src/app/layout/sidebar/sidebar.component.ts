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
      title: 'Pacientes', 
      icon: 'bi-people-fill', 
      route: '/pacientes',
      active: false
    },
    { 
      title: 'Farmácia', 
      icon: 'bi-capsule', 
      route: '/farmacia',
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
      icon: 'bi-gear-fill', 
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
      item.active = currentUrl === item.route || currentUrl.startsWith(item.route);
    });
  }
  
  onToggleSidebar() {
    this.toggleSidebar.emit();
  }
}
