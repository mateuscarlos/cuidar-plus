import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';

interface MenuItem {
  title: string;
  icon: string;
  route: string;
  active: boolean;
  inConstruction?: boolean;
  subItems?: SubMenuItem[];
}

interface SubMenuItem {
  title: string;
  route: string;
  icon?: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();
  showOverlay = false;
  
  menuItems: MenuItem[] = [
    { 
      title: 'Home', 
      icon: 'bi-house-fill', 
      route: '/home',
      active: false
    },
    { 
      title: 'Pacientes', 
      icon: 'bi-people-fill', 
      route: '/pacientes',
      active: false,
      subItems: [
        {
          title: 'Lista de Pacientes',
          route: '/pacientes',
          icon: 'bi-list-ul'
        },
        {
          title: 'Cadastrar Paciente',
          route: '/pacientes/cadastrar',
          icon: 'bi-person-plus'
        }
      ]
    },
    { 
      title: 'Farmácia', 
      icon: 'bi-capsule', 
      route: '/farmacia',
      active: false,
      inConstruction: true
    },
    { 
      title: 'Relatórios', 
      icon: 'bi-bar-chart-fill', 
      route: '/relatorios',
      active: false,
      inConstruction: true
    },
    { 
      title: 'Configurações', 
      icon: 'bi-gear-fill', 
      route: '/configuracoes',
      active: false,
      inConstruction: true
    }
  ];
  
  constructor(private router: Router) {}
  
  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateActiveMenuItem();
    });
    
    this.updateActiveMenuItem();
  }
  
  updateActiveMenuItem(): void {
    const currentUrl = this.router.url;
    
    this.menuItems.forEach(item => {
      // Verificar se o item atual é o caminho ativo ou um subcaminho
      const baseRoute = item.route === '/home' ? '/' : item.route;
      const isExactMatch = currentUrl === baseRoute;
      const isSubPath = currentUrl.startsWith(baseRoute + '/');
      
      item.active = isExactMatch || isSubPath;
    });
  }
  
  onToggleSidebar(): void {
    this.showOverlay = !this.showOverlay;
    this.toggleSidebar.emit();
  }
}