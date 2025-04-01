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
      title: 'Home', 
      icon: 'bi-house-fill', 
      route: '/home',
      active: false,
      inConstruction: false,
      subItems: []
    },
    { 
      title: 'Pacientes', 
      icon: 'bi-people-fill', 
      route: '/pacientes',
      active: false,
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
      icon: 'bi-file-earmark-bar-graph', 
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
    this.toggleSidebar.emit();
  }
}