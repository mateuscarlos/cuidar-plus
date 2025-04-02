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
        },
        {
          title: 'Editar Paciente',
          route: '/pacientes/editar',
          icon: 'bi-pencil-square'
        },
        {
          title: 'Acompanhamento',
          route: '/pacientes/acompanhamento',
          icon: 'bi-clipboard-pulse'
        },
        {
          title: 'Visualizar Paciente',
          route: '/pacientes/visualizar',
          icon: 'bi-eye'
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
      inConstruction: true
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
  
  updateActiveMenuItem(): void {
    const currentUrl = this.router.url;
    
    this.menuItems.forEach(item => {
      // Item principal
      if (item.route === '/home') {
        // Para home, só ativar se estiver na rota exata ou na raiz
        item.active = currentUrl === '/home' || currentUrl === '/';
      } else {
        // Para outros itens, verificar se começa com a rota
        item.active = currentUrl.startsWith(item.route);
      }
      
      // Se tem subitems, verificar se algum está ativo
      if (item.subItems && item.subItems.length > 0) {
        const hasActiveSubitem = item.subItems.some(subitem => 
          currentUrl === subitem.route || 
          (subitem.route !== item.route && currentUrl.startsWith(subitem.route))
        );
        
        if (hasActiveSubitem) {
          item.active = true;
        }
      }
    });
  }
  
  toggleMenuItem(item: MenuItem): void {
    // Para dispositivos móveis, fechar sidebar ao clicar em item sem subitems
    if (this.isMobile && (!item.subItems || item.subItems.length === 0)) {
      this.onToggleSidebar();
    }
    
    // Se o item tem subitems, alternar estado ativo
    if (item.subItems && item.subItems.length > 0) {
      item.active = !item.active;
    }
  }
  
  onToggleSidebar(): void {
    this.showOverlay = !this.showOverlay;
    this.toggleSidebar.emit();
  }
}