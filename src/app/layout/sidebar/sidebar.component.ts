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
<<<<<<< HEAD
      active: false
=======
      active: false,
      inConstruction: false,
      subItems: []
>>>>>>> 70d77e0d97e6326bdf4b6810d5cee047faef5178
    },
    { 
      title: 'Pacientes', 
      icon: 'bi-people-fill', 
      route: '/pacientes',
      active: false,
<<<<<<< HEAD
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
=======
      inConstruction: false,
      expanded: false,
      subItems: [
        {
          title: 'Cadastrar Paciente',
          icon: 'bi-person-plus-fill',
          route: '/pacientes/cadastrar',
          active: false
        },
        {
          title: 'Visualizar Paciente',
          icon: 'bi-person-lines-fill',
          route: '/pacientes/visualizar',
          active: false
        },
        {
          title: 'Editar Paciente',
          icon: 'bi-pencil-square',
          route: '/pacientes/editar',
          active: false
        },
        {
          title: 'Acompanhar Paciente',
          icon: 'bi-heart-pulse-fill',
          route: '/pacientes/acompanhar',
          active: false
>>>>>>> 70d77e0d97e6326bdf4b6810d5cee047faef5178
        }
      ]
    },
    { 
      title: 'Farmácia', 
      icon: 'bi-capsule', 
      route: '/farmacia',
      active: false,
      inConstruction: true,
      subItems: []
    },
    { 
      title: 'Relatórios', 
      icon: 'bi-bar-chart-fill', 
      route: '/relatorios',
      active: false,
      inConstruction: true,
      subItems: []
    },
    { 
      title: 'Configurações', 
      icon: 'bi-gear-fill', 
      route: '/configuracoes',
      active: false,
<<<<<<< HEAD
      inConstruction: true
=======
      inConstruction: false,
      expanded: false,
      subItems: [
        {
          title: 'Cadastrar Usuário',
          icon: 'bi-person-plus',
          route: '/configuracoes/cadastrar-usuario',
          active: false
        },
        {
          title: 'Visualizar Usuário',
          icon: 'bi-person-badge',
          route: '/configuracoes/visualizar-usuario',
          active: false
        },
        {
          title: 'Alterar Senha',
          icon: 'bi-key-fill',
          route: '/configuracoes/alterar-senha',
          active: false
        }
      ]
>>>>>>> 70d77e0d97e6326bdf4b6810d5cee047faef5178
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
<<<<<<< HEAD
      // Verificar se o item atual é o caminho ativo ou um subcaminho
      const baseRoute = item.route === '/home' ? '/' : item.route;
      const isExactMatch = currentUrl === baseRoute;
      const isSubPath = currentUrl.startsWith(baseRoute + '/');
      
      item.active = isExactMatch || isSubPath;
    });
  }
  
  onToggleSidebar(): void {
    this.showOverlay = !this.showOverlay;
=======
      // Verifica se a rota atual corresponde a este item
      item.active = currentUrl === item.route || 
                  (item.route !== '/home' && currentUrl.startsWith(item.route));
      
      // Verifica subitems se existirem
      if (item.subItems && item.subItems.length > 0) {
        item.subItems.forEach(subItem => {
          subItem.active = currentUrl === subItem.route;
          // Se algum subitem estiver ativo, expande o menu pai
          if (subItem.active) {
            item.expanded = true;
          }
        });
      }
    });
  }
  
  toggleExpand(item: any) {
    item.expanded = !item.expanded;
  }
  
  onToggleSidebar() {
>>>>>>> 70d77e0d97e6326bdf4b6810d5cee047faef5178
    this.toggleSidebar.emit();
  }
}