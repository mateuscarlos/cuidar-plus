import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        RouterModule,
        RouterTestingModule,
        HomeComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the welcome section with correct title', () => {
    const welcomeTitle = debugElement.query(By.css('.display-6')).nativeElement;
    expect(welcomeTitle.textContent).toBe('Bem-vindo ao Cuidar+');
    
    const welcomeText = debugElement.query(By.css('.lead')).nativeElement;
    expect(welcomeText.textContent).toBe('Sistema integrado para gestão de cuidados médicos e assistência à saúde.');
  });

  it('should have 4 navigation cards', () => {
    expect(component.cards.length).toBe(4);
    const cardElements = debugElement.queryAll(By.css('.hover-card'));
    expect(cardElements.length).toBe(4);
  });

  it('should correctly display card title and description', () => {
    const cardTitles = debugElement.queryAll(By.css('.card-title'));
    const cardDescriptions = debugElement.queryAll(By.css('.card-text'));
    
    expect(cardTitles[0].nativeElement.textContent.trim()).toContain('Pacientes');
    expect(cardDescriptions[0].nativeElement.textContent.trim()).toBe('Gerencie informações dos pacientes e histórico médico');
    
    expect(cardTitles[1].nativeElement.textContent.trim()).toContain('Farmácia');
    expect(cardDescriptions[1].nativeElement.textContent.trim()).toBe('Controle de medicamentos e prescrições');
  });

  it('should show "Em construção" badge for cards marked as inConstruction', () => {
    const farmaciaCard = component.cards.find(card => card.title === 'Farmácia');
    expect(farmaciaCard?.inConstruction).toBeTrue();
    
    const badges = debugElement.queryAll(By.css('.badge.bg-warning'));
    expect(badges.length).toBe(2); // Deve haver 2 badges (Farmácia e Relatórios)
    
    const farmaciaCardElement = debugElement.queryAll(By.css('.card'))[1];
    const farmaciaCardBadge = farmaciaCardElement.query(By.css('.badge'));
    expect(farmaciaCardBadge).toBeTruthy();
    expect(farmaciaCardBadge.nativeElement.textContent.trim()).toBe('Em construção');
  });

  it('should not show "Em construção" badge for cards not marked as inConstruction', () => {
    const pacientesCard = component.cards.find(card => card.title === 'Pacientes');
    expect(pacientesCard?.inConstruction).toBeFalse();
    
    const pacientesCardElement = debugElement.queryAll(By.css('.card'))[0];
    const pacientesCardBadge = pacientesCardElement.query(By.css('.badge'));
    expect(pacientesCardBadge).toBeFalsy();
  });

  it('should display construction indicator for cards marked as inConstruction', () => {
    const constructionIndicators = debugElement.queryAll(By.css('.construction-indicator'));
    expect(constructionIndicators.length).toBe(2); // Farmácia e Relatórios
    
    const indicatorText = constructionIndicators[0].query(By.css('small')).nativeElement;
    expect(indicatorText.textContent).toBe('Funcionalidade em desenvolvimento');
  });

  it('should display correct card icons with proper color classes', () => {
    const cardIcons = debugElement.queryAll(By.css('.icon-bg i'));
    
    // Pacientes card
    expect(cardIcons[0].classes['bi']).toBeTrue();
    expect(cardIcons[0].classes['bi-people-fill']).toBeTrue();
    expect(cardIcons[0].classes['text-primary']).toBeTrue();
    
    // Farmácia card
    expect(cardIcons[1].classes['bi']).toBeTrue();
    expect(cardIcons[1].classes['bi-capsule']).toBeTrue();
    expect(cardIcons[1].classes['text-success']).toBeTrue();
    
    // Relatórios card
    expect(cardIcons[2].classes['bi']).toBeTrue();
    expect(cardIcons[2].classes['bi-file-earmark-bar-graph']).toBeTrue();
    expect(cardIcons[2].classes['text-info']).toBeTrue();
    
    // Configurações card
    expect(cardIcons[3].classes['bi']).toBeTrue();
    expect(cardIcons[3].classes['bi-gear-fill']).toBeTrue();
    expect(cardIcons[3].classes['text-secondary']).toBeTrue();
  });

  it('should have proper routing links on cards', () => {
    const cards = debugElement.queryAll(By.css('.hover-card'));
    
    // Verifica se os cards têm os atributos routerLink configurados corretamente
    expect(cards[0].attributes['ng-reflect-router-link']).toBe('/pacientes');
    expect(cards[1].attributes['ng-reflect-router-link']).toBe('/farmacia');
    expect(cards[2].attributes['ng-reflect-router-link']).toBe('/relatorios');
    expect(cards[3].attributes['ng-reflect-router-link']).toBe('/configuracoes');
  });

  it('should display "Acessar" links with matching color classes', () => {
    const accessLinks = debugElement.queryAll(By.css('a.text-decoration-none'));
    
    expect(accessLinks[0].classes['text-primary']).toBeTrue();
    expect(accessLinks[0].nativeElement.textContent.trim()).toContain('Acessar');
    
    expect(accessLinks[1].classes['text-success']).toBeTrue();
    expect(accessLinks[1].nativeElement.textContent.trim()).toContain('Acessar');
    
    expect(accessLinks[2].classes['text-info']).toBeTrue();
    expect(accessLinks[2].nativeElement.textContent.trim()).toContain('Acessar');
    
    expect(accessLinks[3].classes['text-secondary']).toBeTrue();
    expect(accessLinks[3].nativeElement.textContent.trim()).toContain('Acessar');
  });

  it('should display the timeline with recent activities', () => {
    const timeline = debugElement.query(By.css('.timeline'));
    expect(timeline).toBeTruthy();
    
    const timelineItems = debugElement.queryAll(By.css('.timeline-item'));
    expect(timelineItems.length).toBeGreaterThanOrEqual(3); // Pelo menos 3 itens na timeline
  });

  it('should display the summary card with statistics', () => {
    const summaryCard = debugElement.query(By.css('.col-lg-4 .card'));
    expect(summaryCard).toBeTruthy();
    
    const summaryTitle = summaryCard.query(By.css('.card-header h5')).nativeElement;
    expect(summaryTitle.textContent.trim()).toBe('Resumo');
    
    const statValues = debugElement.queryAll(By.css('.fw-bold'));
    expect(statValues.length).toBe(3);
    expect(statValues[0].nativeElement.textContent.trim()).toBe('12'); // Consultas hoje
    expect(statValues[1].nativeElement.textContent.trim()).toBe('158'); // Pacientes ativos
    expect(statValues[2].nativeElement.textContent.trim()).toBe('5'); // Medicamentos em baixa
  });

  it('should apply hover-card class to all navigation cards', () => {
    const cardElements = debugElement.queryAll(By.css('.card.hover-card'));
    expect(cardElements.length).toBe(4);
  });

  it('should correctly initialize the cards array with all required properties', () => {
    expect(component.cards).toBeDefined();
    
    // Verificando a primeira card (Pacientes)
    const pacientesCard = component.cards[0];
    expect(pacientesCard.title).toBe('Pacientes');
    expect(pacientesCard.description).toBe('Gerencie informações dos pacientes e histórico médico');
    expect(pacientesCard.icon).toBe('bi-people-fill');
    expect(pacientesCard.route).toBe('/pacientes');
    expect(pacientesCard.color).toBe('primary');
    expect(pacientesCard.inConstruction).toBeFalse();
    
    // Verificando a última card (Configurações)
    const configCard = component.cards[3];
    expect(configCard.title).toBe('Configurações');
    expect(configCard.description).toBe('Personalize o sistema de acordo com suas necessidades');
    expect(configCard.icon).toBe('bi-gear-fill');
    expect(configCard.route).toBe('/configuracoes');
    expect(configCard.color).toBe('secondary');
    expect(configCard.inConstruction).toBeFalse();
  });
});