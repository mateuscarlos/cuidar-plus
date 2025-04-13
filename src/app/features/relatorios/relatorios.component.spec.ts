import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RelatoriosComponent } from './relatorios.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('RelatoriosComponent', () => {
  let component: RelatoriosComponent;
  let fixture: ComponentFixture<RelatoriosComponent>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        RouterModule,
        RouterTestingModule,
        RelatoriosComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RelatoriosComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the component title with "Em planejamento" badge', () => {
    const title = debugElement.query(By.css('h1')).nativeElement;
    const badge = debugElement.query(By.css('.badge')).nativeElement;
    
    expect(title.textContent).toContain('Relatórios');
    expect(badge.textContent).toContain('Em planejamento');
    expect(badge.classList).toContain('bg-warning');
    expect(badge.classList).toContain('text-dark');
  });

  it('should display the construction icon and planning message', () => {
    const icon = debugElement.query(By.css('.construction-icon i'));
    const headerText = debugElement.query(By.css('h4')).nativeElement;
    const descriptionText = debugElement.query(By.css('.construction-icon + div p')).nativeElement;
    
    expect(icon.nativeElement.classList).toContain('bi-clipboard-data');
    expect(icon.nativeElement.classList).toContain('text-warning');
    expect(headerText.textContent).toContain('Módulo em planejamento');
    expect(descriptionText.textContent).toContain('Estamos trabalhando para disponibilizar o módulo de Relatórios');
  });

  it('should display the release date information', () => {
    const alertInfo = debugElement.query(By.css('.alert-info')).nativeElement;
    const releaseDate = debugElement.query(By.css('.alert-info strong')).nativeElement;
    
    expect(alertInfo.textContent).toContain('Previsão de lançamento');
    expect(releaseDate.textContent).toBe('Junho 2025');
  });

  it('should display all expected reports in the list', () => {
    const reportList = debugElement.queryAll(By.css('.feature-list li'));
    
    expect(reportList.length).toBe(component.expectedReports.length);
    expect(component.expectedReports.length).toBe(6);
    
    reportList.forEach((item, index) => {
      const itemText = item.nativeElement.textContent.trim();
      const expectedText = component.expectedReports[index];
      expect(itemText).toContain(expectedText);
    });
    
    // Verificando específicamente alguns itens da lista
    expect(reportList[0].nativeElement.textContent).toContain('Desempenho de atendimentos');
    expect(reportList[2].nativeElement.textContent).toContain('Análise de prescrições');
    expect(reportList[5].nativeElement.textContent).toContain('Visualização de dados avançada');
  });

  it('should display icons before each report item', () => {
    const reportIcons = debugElement.queryAll(By.css('.feature-list li i'));
    
    expect(reportIcons.length).toBe(component.expectedReports.length);
    
    reportIcons.forEach(icon => {
      expect(icon.nativeElement.classList).toContain('bi-check-circle-fill');
      expect(icon.nativeElement.classList).toContain('text-success');
    });
  });

  it('should display progress bars with 0% progress', () => {
    const progressBars = debugElement.queryAll(By.css('.progress-bar'));
    const progressLabels = debugElement.queryAll(By.css('.progress-item .d-flex span:last-child'));
    
    // Verificar o progresso do Backend (0%)
    expect(progressBars[0].attributes['style']).toContain('width: 0%');
    expect(progressBars[0].attributes['aria-valuenow']).toBe('0');
    expect(progressLabels[0].nativeElement.textContent).toBe('0%');
    
    // Verificar o progresso do Frontend (0%)
    expect(progressBars[1].attributes['style']).toContain('width: 0%');
    expect(progressBars[1].attributes['aria-valuenow']).toBe('0');
    expect(progressLabels[1].nativeElement.textContent).toBe('0%');
    
    // Verificar o progresso da Integração de Dados (0%)
    expect(progressBars[2].attributes['style']).toContain('width: 0%');
    expect(progressBars[2].attributes['aria-valuenow']).toBe('0');
    expect(progressLabels[2].nativeElement.textContent).toBe('0%');
  });

  it('should apply correct CSS classes to progress bars', () => {
    const progressBars = debugElement.queryAll(By.css('.progress-bar'));
    
    expect(progressBars[0].classes['bg-success']).toBeTrue(); // Backend
    expect(progressBars[1].classes['bg-primary']).toBeTrue(); // Frontend
    expect(progressBars[2].classes['bg-info']).toBeTrue(); // Integração de Dados
  });

  it('should display three visualization preview boxes', () => {
    const previewBoxes = debugElement.queryAll(By.css('.preview-box'));
    const previewIcons = debugElement.queryAll(By.css('.preview-icon'));
    const previewTitles = debugElement.queryAll(By.css('.preview-box h6'));
    
    expect(previewBoxes.length).toBe(3);
    expect(previewIcons.length).toBe(3);
    expect(previewTitles.length).toBe(3);
    
    // Verificando os títulos das visualizações
    expect(previewTitles[0].nativeElement.textContent).toBe('Gráficos Estatísticos');
    expect(previewTitles[1].nativeElement.textContent).toBe('Dashboards Interativos');
    expect(previewTitles[2].nativeElement.textContent).toBe('Relatórios Exportáveis');
    
    // Verificando os ícones
    expect(previewIcons[0].nativeElement.classList).toContain('bi-bar-chart-fill');
    expect(previewIcons[1].nativeElement.classList).toContain('bi-pie-chart-fill');
    expect(previewIcons[2].nativeElement.classList).toContain('bi-table');
  });

  it('should apply proper styling to preview boxes via CSS classes', () => {
    const previewBoxes = debugElement.queryAll(By.css('.preview-box'));
    
    previewBoxes.forEach(box => {
      // Verificando se o elemento possui as classes necessárias para o styling
      expect(box.classes['preview-box']).toBeTrue();
    });
  });

  it('should correctly initialize the expectedReports array', () => {
    const expectedReportsList = [
      'Desempenho de atendimentos',
      'Métricas de pacientes',
      'Análise de prescrições',
      'Controle de estoque',
      'Indicadores financeiros',
      'Visualização de dados avançada'
    ];
    
    expect(component.expectedReports).toEqual(expectedReportsList);
  });

  it('should display progress development section with correct header', () => {
    const progressHeader = debugElement.query(By.css('.card-header h5')).nativeElement;
    
    expect(progressHeader.textContent.trim()).toBe('Relatórios Previstos');
    
    const developmentProgressHeader = debugElement.queryAll(By.css('.card-header h5'))[1].nativeElement;
    expect(developmentProgressHeader.textContent.trim()).toBe('Progresso do Desenvolvimento');
  });

  it('should have three progress tracking items', () => {
    const progressItems = debugElement.queryAll(By.css('.progress-item'));
    
    expect(progressItems.length).toBe(3);
    
    const progressLabels = debugElement.queryAll(By.css('.progress-item .d-flex span:first-child'));
    expect(progressLabels[0].nativeElement.textContent).toBe('Backend');
    expect(progressLabels[1].nativeElement.textContent).toBe('Frontend');
    expect(progressLabels[2].nativeElement.textContent).toBe('Integração de Dados');
  });

  it('should display "Visualizações Previstas" section heading', () => {
    const visualizationsHeader = debugElement.queryAll(By.css('.card-header h5'))[2].nativeElement;
    
    expect(visualizationsHeader.textContent.trim()).toBe('Visualizações Previstas');
  });
});