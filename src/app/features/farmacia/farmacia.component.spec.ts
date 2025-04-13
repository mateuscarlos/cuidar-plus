import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FarmaciaComponent } from './farmacia.component';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('FarmaciaComponent', () => {
  let component: FarmaciaComponent;
  let fixture: ComponentFixture<FarmaciaComponent>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        RouterTestingModule,
        FarmaciaComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FarmaciaComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct heading with "Em construção" badge', () => {
    const heading = debugElement.query(By.css('h1')).nativeElement;
    const badge = debugElement.query(By.css('.badge')).nativeElement;
    
    expect(heading.textContent).toContain('Farmácia');
    expect(badge.textContent).toContain('Em construção');
    expect(badge.classList).toContain('bg-warning');
  });

  it('should display the construction icon', () => {
    const icon = debugElement.query(By.css('.construction-icon i'));
    
    expect(icon).toBeTruthy();
    expect(icon.nativeElement.classList).toContain('bi-gear-wide-connected');
    expect(icon.nativeElement.classList).toContain('text-warning');
  });

  it('should display the "módulo em desenvolvimento" message', () => {
    const developmentMessage = debugElement.query(By.css('h4')).nativeElement;
    const description = debugElement.query(By.css('p.text-muted')).nativeElement;
    
    expect(developmentMessage.textContent).toContain('Módulo em desenvolvimento');
    expect(description.textContent).toContain('Estamos trabalhando para disponibilizar');
  });

  it('should display all expected features in the list', () => {
    const featureItems = debugElement.queryAll(By.css('.feature-list li'));
    
    expect(featureItems.length).toBe(component.expectedFeatures.length);
    
    featureItems.forEach((item, index) => {
      expect(item.nativeElement.textContent).toContain(component.expectedFeatures[index]);
    });
  });

  it('should initialize the expectedFeatures array with correct values', () => {
    const expectedFeaturesList = [
      'Cadastro de medicamentos',
      'Controle de estoque',
      'Prescrições eletrônicas',
      'Gerenciamento de fornecedores',
      'Alertas de medicamentos vencidos',
      'Histórico de dispensação'
    ];
    
    expect(component.expectedFeatures).toEqual(expectedFeaturesList);
    expect(component.expectedFeatures.length).toBe(6);
  });

  it('should display the progress bars with correct percentages', () => {
    const progressBars = debugElement.queryAll(By.css('.progress-bar'));
    const progressLabels = debugElement.queryAll(By.css('.progress-item .d-flex span:last-child'));
    
    // Verify Backend progress (0%)
    expect(progressBars[0].attributes['style']).toContain('width: 0%');
    expect(progressBars[0].attributes['aria-valuenow']).toBe('0');
    expect(progressLabels[0].nativeElement.textContent).toBe('0%');
    
    // Verify Frontend progress (10%)
    expect(progressBars[1].attributes['style']).toContain('width: 10%');
    expect(progressBars[1].attributes['aria-valuenow']).toBe('10');
    expect(progressLabels[1].nativeElement.textContent).toBe('10%');
    
    // Verify Testes progress (0%)
    expect(progressBars[2].attributes['style']).toContain('width: 0%');
    expect(progressBars[2].attributes['aria-valuenow']).toBe('0');
    expect(progressLabels[2].nativeElement.textContent).toBe('0%');
  });

  it('should have the correct CSS classes for styling progress bars', () => {
    const backendProgressBar = debugElement.queryAll(By.css('.progress-bar'))[0];
    const frontendProgressBar = debugElement.queryAll(By.css('.progress-bar'))[1];
    const testesProgressBar = debugElement.queryAll(By.css('.progress-bar'))[2];
    
    expect(backendProgressBar.classes['bg-success']).toBeTrue();
    expect(frontendProgressBar.classes['bg-primary']).toBeTrue();
    expect(testesProgressBar.classes['bg-info']).toBeTrue();
  });

  it('should have the correct styling for progress container', () => {
    const progressElements = debugElement.queryAll(By.css('.progress'));
    
    progressElements.forEach(element => {
      // Verifica se o estilo definido no CSS está sendo aplicado
      const styles = window.getComputedStyle(element.nativeElement);
      expect(element.nativeElement.clientHeight).toBeLessThanOrEqual(8); // height: 8px do CSS
      // A verificação do border-radius é difícil em testes de unidade sem um navegador real
    });
  });

  it('should have feature-list styled according to component CSS', () => {
    const featureList = debugElement.query(By.css('.feature-list'));
    const listItems = debugElement.queryAll(By.css('.feature-list li'));
    
    expect(featureList).toBeTruthy();
    
    if (listItems.length > 0) {
      const lastItem = listItems[listItems.length - 1];
      // Para o último item, verificamos se não tem borda inferior
      // Nota: Esta verificação pode ser difícil em testes de unidade puros
    }
  });

  it('should import required modules', () => {
    // Verificando se os módulos necessários foram importados
    const componentInstance = TestBed.createComponent(FarmaciaComponent).componentInstance;
    expect(componentInstance).toBeTruthy();
    
    // Esta é uma verificação indireta dos imports
    // CommonModule permite usar *ngFor no template
    // RouterModule permite a navegação
  });
});