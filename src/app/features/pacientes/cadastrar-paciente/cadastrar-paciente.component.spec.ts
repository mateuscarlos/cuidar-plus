import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

import { CadastrarPacienteComponent } from './cadastrar-paciente.component';
import { PacienteService } from '../services/paciente.service';
import { NotificacaoService } from '../../../shared/services/notificacao.service';
import { CepService } from '../../../core/services/cep.service';
import { ConvenioPlanoService } from '../services/convenio-plano.service';
import { DateFormatterService } from '../../../core/services/date-formatter.service';
import { StatusStyleService } from '../../../../styles/status-style.service';
import { StatusPaciente } from '../models/paciente.model';

describe('CadastrarPacienteComponent', () => {
  let component: CadastrarPacienteComponent;
  let fixture: ComponentFixture<CadastrarPacienteComponent>;
  let pacienteServiceSpy: jasmine.SpyObj<PacienteService>;
  let notificacaoServiceSpy: jasmine.SpyObj<NotificacaoService>;
  let cepServiceSpy: jasmine.SpyObj<CepService>;
  let convenioPlanoServiceSpy: jasmine.SpyObj<ConvenioPlanoService>;
  let dateFormatterServiceSpy: jasmine.SpyObj<DateFormatterService>;
  let routerSpy: jasmine.SpyObj<Router>;

  // Create a spy object for the component to handle private methods
  beforeAll(() => {
    // Use type assertion to access private method for testing purposes
    spyOn<any>(CadastrarPacienteComponent.prototype, 'removerBackdrop');
  });

  const mockConvenios = [
    { id: 1, nome: 'Unimed', ativo: true },
    { id: 2, nome: 'Amil', ativo: true }
  ];

  const mockPlanos = [
    { id: 1, nome: 'Plano A', convenio_id: 1, codigo: 'PA001', tipo_acomodacao: 'Apartamento', ativo: true },
    { id: 2, nome: 'Plano B', convenio_id: 1, codigo: 'PB002', tipo_acomodacao: 'Enfermaria', ativo: true }
  ];

  const mockEndereco = {
    cep: '12345-678',
    logradouro: 'Rua Teste',
    bairro: 'Centro',
    localidade: 'São Paulo',
    estado: 'SP',
    numero: '123',
    uf: 'SP'
  };

  const today = new Date();
  const formattedToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  beforeEach(async () => {
    // Espias para os serviços
    pacienteServiceSpy = jasmine.createSpyObj('PacienteService', ['criarPaciente']);
    notificacaoServiceSpy = jasmine.createSpyObj('NotificacaoService', ['mostrarSucesso', 'mostrarErro', 'mostrarAviso']);
    cepServiceSpy = jasmine.createSpyObj('CepService', ['consultarCep']);
    convenioPlanoServiceSpy = jasmine.createSpyObj('ConvenioPlanoService', ['listarConvenios', 'listarPlanosPorConvenio']);
    dateFormatterServiceSpy = jasmine.createSpyObj('DateFormatterService', [
      'parseToDate', 
      'toHtmlDateFormat', 
      'toBackendDateOnlyFormat'
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    // Configuração dos valores de retorno dos espias
    dateFormatterServiceSpy.toHtmlDateFormat.and.returnValue(formattedToday);
    dateFormatterServiceSpy.parseToDate.and.callFake((date: string | Date | null | undefined) => date ? new Date(date) : new Date(0));
    convenioPlanoServiceSpy.listarConvenios.and.returnValue(of(mockConvenios));
    cepServiceSpy.consultarCep.and.returnValue(of(mockEndereco));

    // Mock do objeto bootstrap para testar os modais
    (window as any).bootstrap = {
      Modal: class {
        constructor(public element: any) {}
        show(): void {}
        hide(): void {}
        static getInstance(element: any): any {
          return { hide: () => {} };
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterTestingModule,
        CadastrarPacienteComponent
      ],
      providers: [
        FormBuilder,
        { provide: PacienteService, useValue: pacienteServiceSpy },
        { provide: NotificacaoService, useValue: notificacaoServiceSpy },
        { provide: CepService, useValue: cepServiceSpy },
        { provide: ConvenioPlanoService, useValue: convenioPlanoServiceSpy },
        { provide: DateFormatterService, useValue: dateFormatterServiceSpy },
        { provide: StatusStyleService, useValue: { getAllClasses: () => 'badge bg-success' } },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CadastrarPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.pacienteForm).toBeDefined();
    expect(component.pacienteForm.get('status')?.value).toBe(StatusPaciente.ATIVO);
    expect(component.pacienteForm.get('nacionalidade')?.value).toBe('Brasileiro(a)');
    expect(component.pacienteForm.get('plano_id')?.disabled).toBeTrue();
  });

  it('should load convenios on init', () => {
    expect(convenioPlanoServiceSpy.listarConvenios).toHaveBeenCalled();
    expect(component.convenios).toEqual(mockConvenios);
  });

  it('should display error message when loading convenios fails', () => {
    // Reset and setup
    convenioPlanoServiceSpy.listarConvenios.calls.reset();
    convenioPlanoServiceSpy.listarConvenios.and.returnValue(throwError(() => new Error('Server error')));
    
    // Re-initialize component
    component.ngOnInit();
    
    expect(notificacaoServiceSpy.mostrarErro).toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
  });

  it('should load planos when convenio changes', () => {
    convenioPlanoServiceSpy.listarPlanosPorConvenio.and.returnValue(of(mockPlanos));
    
    // Simulate convenio change
    component.pacienteForm.get('convenio_id')?.setValue(1);
    fixture.detectChanges();

    expect(convenioPlanoServiceSpy.listarPlanosPorConvenio).toHaveBeenCalledWith(1);
    expect(component.planosFiltrados).toEqual(mockPlanos);
    expect(component.pacienteForm.get('plano_id')?.enabled).toBeTrue();
  });

  it('should handle CEP search correctly', fakeAsync(() => {
    // Set up valid CEP
    const cepControl = component.pacienteForm.get('endereco')?.get('cep');
    cepControl?.setValue('12345678');
    
    // Trigger CEP search
    component.onCepChange();
    tick();
    
    expect(cepServiceSpy.consultarCep).toHaveBeenCalledWith('12345678');
    expect(component.pacienteForm.get('endereco')?.get('logradouro')?.value).toBe('Rua Teste');
    expect(component.pacienteForm.get('endereco')?.get('bairro')?.value).toBe('Centro');
    expect(component.pacienteForm.get('endereco')?.get('localidade')?.value).toBe('São Paulo');
    expect(component.pacienteForm.get('endereco')?.get('estado')?.value).toBe('SP');
  }));

  it('should validate required fields', () => {
    const form = component.pacienteForm;
    
    // Set only a few required fields to trigger validation errors
    form.patchValue({
      nome_completo: '',
      cpf: '',
      data_nascimento: '',
      endereco: {
        cep: '',
        logradouro: '',
        numero: '',
        bairro: '',
        localidade: '',
        estado: ''
      }
    });
    
    // Mark form as touched to trigger validators
    component.markFormGroupTouched(form);
    
    expect(component.isFieldValid('nome_completo')).toBeTrue();
    expect(component.isFieldValid('cpf')).toBeTrue();
    expect(component.isEnderecoFieldValid('cep')).toBeTrue();
  });

  it('should validate CPF format', () => {
    const form = component.pacienteForm;
    const cpfControl = form.get('cpf');
    
    // Invalid CPF
    cpfControl?.setValue('123.456.789-00');
    expect(cpfControl?.valid).toBeFalse();
    
    // Valid CPF (using a known valid CPF format)
    cpfControl?.setValue('529.982.247-25');
    expect(cpfControl?.valid).toBeTrue();
  });

  it('should validate date fields', () => {
    const form = component.pacienteForm;
    
    // Future date for date_nascimento - should be invalid
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    const futureDateStr = futureDate.toISOString().split('T')[0];
    form.get('data_nascimento')?.setValue(futureDateStr);
    
    expect(form.get('data_nascimento')?.valid).toBeFalse();
    
    // Valid date for data_nascimento
    const pastDate = new Date();
    pastDate.setFullYear(pastDate.getFullYear() - 20);
    const pastDateStr = pastDate.toISOString().split('T')[0];
    form.get('data_nascimento')?.setValue(pastDateStr);
    
    expect(form.get('data_nascimento')?.valid).toBeTrue();
    
    // Past date for data_validade - should be invalid
    const pastDateValidade = new Date();
    pastDateValidade.setDate(pastDateValidade.getDate() - 1);
    const pastDateValidadeStr = pastDateValidade.toISOString().split('T')[0];
    form.get('data_validade')?.setValue(pastDateValidadeStr);
    
    expect(form.get('data_validade')?.valid).toBeFalse();
  });

  it('should open confirmation modal on form submit with valid data', fakeAsync(() => {
    spyOn(component, 'abrirModalConfirmacao');
    
    // Fill in required fields
    component.pacienteForm.patchValue({
      nome_completo: 'Teste da Silva',
      cpf: '529.982.247-25',
      data_nascimento: '1990-01-01',
      nacionalidade: 'Brasileiro(a)',
      telefone: '(11) 99999-9999',
      endereco: {
        cep: '12345-678',
        logradouro: 'Rua Teste',
        numero: '123',
        bairro: 'Centro',
        localidade: 'São Paulo',
        estado: 'SP'
      },
      cid_primario: 'J45',
      acomodacao: 'Apartamento',
      convenio_id: 1,
      plano_id: 1,
      numero_carteirinha: '123456789',
      data_validade: formattedToday
    });
    
    // Enable plano_id which is disabled by default
    component.pacienteForm.get('plano_id')?.enable();
    
    // Submit form
    const submitButton = fixture.debugElement.query(By.css('button[type="submit"]'));
    submitButton.nativeElement.click();
    tick();
    
    expect(component.abrirModalConfirmacao).toHaveBeenCalled();
  }));

  it('should submit form and create patient after confirmation', () => {
    // Mock successful patient creation
    pacienteServiceSpy.criarPaciente.and.returnValue(of({ 
        id: 1, 
        nome_completo: 'Teste da Silva',
        cpf: '529.982.247-25',
        data_nascimento: '1990-01-01',
        genero: 'Masculino',
        estado_civil: 'Solteiro',
        email: 'teste@example.com',
        telefone: '(11) 99999-9999',
        status: StatusPaciente.ATIVO,
        nacionalidade: 'Brasileiro(a)',
        profissao: 'Engenheiro',
        endereco: {
            cep: '12345-678',
            logradouro: 'Rua Teste',
            numero: '123',
            complemento: 'Apto 101',
            bairro: 'Centro',
            localidade: 'São Paulo',
            estado: 'SP',
            uf: 'SP' // Added the missing 'uf' property
        },
        acomodacao: 'Apartamento',
        convenio_id: 1,
        plano_id: 1,
        numero_carteirinha: '123456789',
        data_validade: '2025-12-31',
        cid_primario: 'J45'
    }));
    
    // Call confirmarCadastro
    component.confirmarCadastro();
    
    expect(component.isLoading).toBeTruthy();
    expect(pacienteServiceSpy.criarPaciente).toHaveBeenCalled();
    expect((CadastrarPacienteComponent.prototype as any).removerBackdrop).toHaveBeenCalled();
  });

  it('should handle form submission errors', () => {
    // Mock error on patient creation
    pacienteServiceSpy.criarPaciente.and.returnValue(throwError(() => new Error('Error creating patient')));
    
    component.confirmarCadastro();
    
    expect(notificacaoServiceSpy.mostrarErro).toHaveBeenCalled();
  });

  it('should clear form when limparFormulario is called', () => {
    // Fill in some form fields
    component.pacienteForm.patchValue({
      nome_completo: 'Teste da Silva',
      email: 'teste@example.com',
      telefone: '(11) 99999-9999'
    });
    
    // Clear form
    component.limparFormulario();
    
    // Check that fields are cleared but default values remain
    expect(component.pacienteForm.get('nome_completo')?.value).toBeFalsy();
    expect(component.pacienteForm.get('email')?.value).toBeFalsy();
    expect(component.pacienteForm.get('telefone')?.value).toBeFalsy();
    expect(component.pacienteForm.get('status')?.value).toBe(StatusPaciente.ATIVO);
    expect(component.pacienteForm.get('nacionalidade')?.value).toBe('Brasileiro(a)');
    expect(component.pacienteForm.get('plano_id')?.disabled).toBeTrue();
  });

  it('should correctly process dates for backend format', () => {
    dateFormatterServiceSpy.toBackendDateOnlyFormat.and.returnValue('2023-01-01');
    
    const formValues = {
      data_nascimento: '2000-05-15',
      data_validade: '2025-12-31',
      outros_dados: 'Teste'
    };
    
    const processedValues = component.processarDatasFormulario(formValues);
    
    expect(dateFormatterServiceSpy.toBackendDateOnlyFormat).toHaveBeenCalledTimes(2);
    expect(processedValues.data_nascimento).toBe('2023-01-01');
    expect(processedValues.data_validade).toBe('2023-01-01');
    expect(processedValues.outros_dados).toBe('Teste');
  });

  it('should show all sections with correct titles in the template', () => {
    const cardTitles = fixture.debugElement.queryAll(By.css('.card-title span'));
    
    expect(cardTitles.length).toBe(6); // 6 sections
    expect(cardTitles[0].nativeElement.textContent).toBe('Informações Pessoais');
    expect(cardTitles[1].nativeElement.textContent).toBe('Informações de Contato');
    expect(cardTitles[2].nativeElement.textContent).toBe('Endereço');
    expect(cardTitles[3].nativeElement.textContent).toBe('Informações Médicas');
    expect(cardTitles[4].nativeElement.textContent).toBe('Convênio e Plano');
    expect(cardTitles[5].nativeElement.textContent).toBe('Contato de Emergência');
  });

  it('should mark fields as required appropriately', () => {
    const requiredFields = fixture.debugElement.queryAll(By.css('.field-required'));
    
    expect(requiredFields.length).toBeGreaterThan(0);
    
    const requiredFieldLabels = requiredFields.map(field => field.nativeElement.textContent.trim());
    expect(requiredFieldLabels).toContain('Nome Completo');
    expect(requiredFieldLabels).toContain('CPF');
    expect(requiredFieldLabels).toContain('Data de Nascimento');
    expect(requiredFieldLabels).toContain('Telefone Principal');
    expect(requiredFieldLabels).toContain('CEP');
    expect(requiredFieldLabels).toContain('Convênio');
  });

  it('should redirect to patients list after successful creation', () => {
    component.redirecionarParaPacientes();
    
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/pacientes']);
  });
});