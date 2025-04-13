import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, NavigationEnd } from '@angular/router';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { SidebarComponent } from './sidebar.component';
import { DeviceDetectorService } from '../../core/services/device-detector.service';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let router: jasmine.SpyObj<Router>;
  let deviceDetectorService: jasmine.SpyObj<DeviceDetectorService>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate', 'events'], {
      url: '/home'
    });
    routerSpy.events = of(new NavigationEnd(1, '/home', '/'));

    const deviceDetectorSpy = jasmine.createSpyObj('DeviceDetectorService', [], {
      isMobile$: of(false)
    });

    await TestBed.configureTestingModule({
      imports: [SidebarComponent, RouterTestingModule],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: DeviceDetectorService, useValue: deviceDetectorSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA] // Para lidar com componentes aninhados como routerLink
    }).compileComponents();

    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    deviceDetectorService = TestBed.inject(DeviceDetectorService) as jasmine.SpyObj<DeviceDetectorService>;

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render all main menu items', () => {
    const menuItems = fixture.debugElement.queryAll(By.css('.sidebar-item'));
    expect(menuItems.length).toBe(component.menuItems.length);
  });

  it('should mark the active menu item based on current URL', () => {
    // Inicializamos com /home ativo
    const activeItem = fixture.debugElement.query(By.css('.sidebar-link.active'));
    expect(activeItem).toBeTruthy();
    expect(activeItem.nativeElement.textContent).toContain('Home');
  });

  it('should toggle menu item expansion when clicked', () => {
    // Encontrar o item "Pacientes" que tem submenus
    const menuItems = component.menuItems;
    const pacientesItem = menuItems.find(item => item.title === 'Pacientes')!;
    const pacientesIndex = menuItems.indexOf(pacientesItem);
    
    // Verificar estado inicial
    expect(pacientesItem.expanded).toBeFalsy();
    
    // Clicar no item
    const pacientesElement = fixture.debugElement.queryAll(By.css('.sidebar-link'))[pacientesIndex];
    pacientesElement.triggerEventHandler('click', {});
    fixture.detectChanges();
    
    // Verificar se expandiu
    expect(pacientesItem.expanded).toBeTrue();
    
    // Deve exibir o submenu
    const submenu = fixture.debugElement.query(By.css('.collapse.show'));
    expect(submenu).toBeTruthy();
  });

  it('should navigate to route when menu item without subitems is clicked', () => {
    // Encontrar o item "Home" que não tem submenus
    const homeElement = fixture.debugElement.query(By.css('.sidebar-link'));
    homeElement.triggerEventHandler('click', {});
    
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should emit toggleSidebar event when calling onToggleSidebar', () => {
    spyOn(component.toggleSidebar, 'emit');
    component.onToggleSidebar();
    expect(component.toggleSidebar.emit).toHaveBeenCalled();
    expect(component.showOverlay).toBeTrue();
  });

  it('should toggle submenu when clicked', () => {
    // Expandir primeiro o menu principal
    const pacientesItem = component.menuItems.find(item => item.title === 'Pacientes')!;
    pacientesItem.expanded = true;
    fixture.detectChanges();
    
    // Encontrar um submenu com subitems aninhados (se houver)
    const subitemWithNestedItems = pacientesItem.subItems?.find(sub => sub.subItems?.length);
    if (subitemWithNestedItems) {
      const event = { preventDefault: jasmine.createSpy(), stopPropagation: jasmine.createSpy() };
      component.toggleSubMenu(event as unknown as Event, subitemWithNestedItems);
      
      expect(event.preventDefault).toHaveBeenCalled();
      expect(event.stopPropagation).toHaveBeenCalled();
      expect(subitemWithNestedItems.expanded).toBeTrue();
      expect(router.navigate).toHaveBeenCalledWith([subitemWithNestedItems.route]);
    }
  });

  it('should not perform actions when clicking on an item marked as inConstruction', () => {
    // Encontrar um item em construção
    const inConstructionItem = component.menuItems.find(item => item.inConstruction)!;
    if (inConstructionItem) {
      const index = component.menuItems.indexOf(inConstructionItem);
      const element = fixture.debugElement.queryAll(By.css('.sidebar-link'))[index];
      
      // Verificar se tem a classe disabled
      expect(element.classes['disabled']).toBeTrue();
    }
  });
});
