import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { ConfiguracoesComponent } from './configuracoes.component';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

describe('ConfiguracoesComponent', () => {
  let component: ConfiguracoesComponent;
  let fixture: ComponentFixture<ConfiguracoesComponent>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        RouterTestingModule,
        ConfiguracoesComponent
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfiguracoesComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display correct section title', () => {
    const titleElement = debugElement.query(By.css('.card-title')).nativeElement;
    expect(titleElement.textContent).toContain('Configurações');
  });

  it('should display the correct number of configuration cards', () => {
    const cards = debugElement.queryAll(By.css('.card-body'));
    expect(cards.length).toBe(4); // Usuários, Convênios, Setores, Funções
  });

  it('should display progress bar with correct percentage', () => {
    const progressBar = debugElement.query(By.css('.progress-bar')).nativeElement;
    expect(progressBar.style.width).toBe('25%');
    expect(progressBar.getAttribute('aria-valuenow')).toBe('25');
  });

  it('should have proper hover effect style on cards', () => {
    const cardStyle = fixture.nativeElement.querySelector('.card');
    expect(getComputedStyle(cardStyle).transition).toContain('transform');
    // Note: Full hover testing would require more complex setup with browser interactions
  });
});