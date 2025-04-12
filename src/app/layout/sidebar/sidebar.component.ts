import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { DeviceDetectorService } from '../../core/services/device-detector.service';

interface MenuItem {
  title: string;
  icon: string;
  route: string;
  active: boolean;
  inConstruction?: boolean;
  subItems?: SubMenuItem[];
  expanded?: boolean; // Nova propriedade para controlar o estado expandido
}

interface SubMenuItem {
  title: string;
  route: string;
  icon?: string;
  subItems?: SubMenuItem[];
  active?: boolean;
  expanded?: boolean;
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
  isMobile = false;
  
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
      expanded: false,  // Inicialmente fechado
      subItems: [
        {
          title: 'Lista de Pacientes',
          route: '/pacientes/lista',
          icon: 'bi-list-ul'
        },
        {
          title: 'Cadastrar Paciente',
          route: '/pacientes/criar',
          icon: 'bi-person-plus'
        },
        {
          title: 'Buscar Paciente',
          route: '/pacientes/busca',
          icon: 'bi-search'
        },
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
      inConstruction: false,
      expanded: false,
      subItems: [
        {
          title: 'Usuários',
          route: '/usuarios',
          icon: 'bi-people',
          expanded: false,
          subItems: [
            {
              title: 'Listar Usuários',
              route: '/usuarios',
              icon: 'bi-list-ul'
            },
            {
              title: 'Cadastrar Usuário',
              route: '/usuarios/criar',
              icon: 'bi-person-plus'
            }
          ]
        },
        {
          title: 'Convênios e Planos',
          route: '/configuracoes/convenios',
          icon: 'bi-wallet2'
        },
        {
          title: 'Setores',
          route: '/setores',
          icon: 'bi-building'
        },
        {
          title: 'Funções',
          route: '/funcoes',
          icon: 'bi-briefcase'
        }
      ]
    }
  ];
  
  constructor(
    private router: Router,
    private deviceDetectorService: DeviceDetectorService
  ) {}
  
  ngOnInit(): void {
    // Detectar se é dispositivo móvel
    this.deviceDetectorService.isMobile$.subscribe(isMobile => {
      this.isMobile = isMobile;
    });

    // Monitora mudanças de rota
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateActiveMenuItem();
    });
    
    this.updateActiveMenuItem();
  }
  
  /**
   * Atualiza qual item de menu está ativo com base na URL atual
   * E também expande automaticamente os menus e submenus relevantes
   */
  updateActiveMenuItem(): void {
    const currentUrl = this.router.url;
    
    this.menuItems.forEach(item => {
      // Item principal
      if (item.route === '/home') {
        // Para home, só ativar se estiver na rota exata ou na raiz
        item.active = currentUrl === '/home' || currentUrl === '/';
      } else {
        // Para outros itens principais, verifica se começa com a rota
        item.active = currentUrl.startsWith(item.route);
      }
      
      // Se tem subitems, verificar se algum está ativo e expandir o menu se necessário
      if (item.subItems && item.subItems.length > 0) {
        // Verificar se tem algum submenu ativo
        const hasActiveSubitem = item.subItems.some(subitem => {
          // Para itens exatos como Dashboard Pacientes, verifica se a URL é exata
          if (subitem.route === '/pacientes' && currentUrl === '/pacientes') {
            subitem.active = true;
            return true;
          }
          
          // Para outros itens, verifica se a URL começa com a rota
          if (subitem.route !== item.route && currentUrl.startsWith(subitem.route)) {
            subitem.active = true;
            
            // Se tiver submenus, verifica eles também
            if (subitem.subItems && subitem.subItems.length > 0) {
              subitem.expanded = subitem.subItems.some(nestedItem => {
                const isActive = currentUrl.startsWith(nestedItem.route);
                if (isActive) nestedItem.active = true;
                return isActive;
              });
            }
            return true;
          }
          return false;
        });
        
        // Se tem submenu ativo, ativa o item principal e expande o menu
        if (hasActiveSubitem) {
          item.active = true;
          item.expanded = true;
        }
      }
    });
  }
  
  /**
   * Alterna o estado de expansão de um item de menu quando clicado
   * E navega para sua rota se não tiver subitems
   */
  toggleMenuItem(item: MenuItem): void {
    // Para dispositivos móveis, fechar sidebar ao clicar em item sem subitems
    if (this.isMobile && (!item.subItems || item.subItems.length === 0)) {
      this.onToggleSidebar();
    }
    
    // Se o item tem subitems, alternar estado expandido
    if (item.subItems && item.subItems.length > 0) {
      item.expanded = !item.expanded;
      
      // Navegar para a rota quando expande, mas não quando fecha
      if (item.expanded) {
        this.router.navigate([item.route]);
      }
    } else {
      // Se não tem subitems, apenas navegar para a rota
      this.router.navigate([item.route]);
    }
  }
  
  /**
   * Alterna o estado de expansão de um submenu quando clicado
   * E navega para sua rota
   */
  toggleSubMenu(event: Event, subItem: SubMenuItem): void {
    event.preventDefault();
    event.stopPropagation(); // Impedir propagação para não acionar o item pai
    
    // Se tiver subitems, alternar estado de expansão
    if (subItem.subItems && subItem.subItems.length > 0) {
      subItem.expanded = !subItem.expanded;
    }
    
    // Sempre navega para a rota quando clica em um submenu
    this.router.navigate([subItem.route]);
    
    // Para dispositivos móveis, fechar sidebar após selecionar um item
    if (this.isMobile) {
      this.onToggleSidebar();
    }
  }
  
  /**
   * Alterna a visibilidade da sidebar em dispositivos móveis
   */
  onToggleSidebar(): void {
    this.showOverlay = !this.showOverlay;
    this.toggleSidebar.emit();
  }
}