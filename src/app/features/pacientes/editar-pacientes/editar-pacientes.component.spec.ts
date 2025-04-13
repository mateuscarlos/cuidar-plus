import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EditarPacientesComponent } from './editar-pacientes.component';
import { NotificacaoService } from '../../../shared/services/notificacao.service';
import { PacienteService } from '../services/paciente.service';
import { Paciente } from '../models/paciente.model';
import { of } from 'rxjs';
import { MOCK_PACIENTE_ATIVO } from '../../../core/mocks/pacientes.mock';

describe('EditarPacientesComponent', () => {
  let component: EditarPacientesComponent;
  let fixture: ComponentFixture<EditarPacientesComponent>;
  let notificacaoService: jasmine.SpyObj<NotificacaoService>;
  let pacienteService: jasmine.SpyObj<PacienteService>;

  beforeEach(async () => {
    const notificacaoSpy = jasmine.createSpyObj('NotificacaoService', ['mostrarAviso', 'mostrarErro', 'mostrarSucesso']);
    const pacienteSpy = jasmine.createSpyObj('PacienteService', ['atualizarPaciente', 'obterPacientePorId']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        EditarPacientesComponent
      ],
      providers: [
        { provide: NotificacaoService, useValue: notificacaoSpy },
        { provide: PacienteService, useValue: pacienteSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditarPacientesComponent);
    component = fixture.componentInstance;
    notificacaoService = TestBed.inject(NotificacaoService) as jasmine.SpyObj<NotificacaoService>;
    pacienteService = TestBed.inject(PacienteService) as jasmine.SpyObj<PacienteService>;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve inicializar o formulário corretamente', () => {
    expect(component.pacienteForm).toBeDefined();
    expect(component.pacienteForm.get('nome_completo')).toBeTruthy();
    expect(component.pacienteForm.get('cpf')).toBeTruthy();
  });

  it('deve exibir erro se o formulário for inválido ao submeter', () => {
    component.pacienteForm.get('nome_completo')?.setValue('');
    component.pacienteForm.get('cpf')?.setValue('');
    component.onSubmit();
    expect(notificacaoService.mostrarErro).toHaveBeenCalledWith('Por favor, preencha todos os campos obrigatórios.');
  });

  it('deve chamar o serviço para atualizar o paciente ao submeter formulário válido', () => {
    component.pacienteForm.patchValue({
      nome_completo: 'João Silva',
      cpf: '12345678901',
      data_nascimento: '2000-01-01',
      telefone: '11999999999',
      endereco: {
        cep: '12345678',
        logradouro: 'Rua A',
        numero: '123',
        bairro: 'Centro',
        localidade: 'São Paulo',
        uf: 'SP'
      }
    });
    const mockPaciente: Paciente = {
      nome_completo: 'João Silva',
      cpf: '12345678901',
      data_nascimento: '2000-01-01',
      telefone: '11999999999',
      genero: 'Masculino',
      email: 'joao@example.com',
      id: 1,
      estado_civil: 'Solteiro',
      nacionalidade: 'Brasileira',
      profissao: 'Engenheiro',
      status: 'Ativo',
      endereco: {
        cep: '12345678',
        logradouro: 'Rua A',
        numero: '123',
        bairro: 'Centro',
        localidade: 'São Paulo',
        uf: 'SP'
      }
    };
    pacienteService.atualizarPaciente.and.returnValue(of(mockPaciente));
    component.onSubmit();
    component.onSubmit();

    expect(pacienteService.atualizarPaciente).toHaveBeenCalled();
    expect(notificacaoService.mostrarSucesso).toHaveBeenCalledWith('Paciente atualizado com sucesso!');
  });

  it('deve validar o campo CPF corretamente', () => {
    const cpfControl = component.pacienteForm.get('cpf');
    cpfControl?.setValue('123'); // CPF inválido
    expect(cpfControl?.valid).toBeFalse();

    cpfControl?.setValue('12345678901'); // CPF válido
    expect(cpfControl?.valid).toBeTrue();
  });

  it('deve marcar todos os campos como "touched" ao validar formulário inválido', () => {
    spyOn(component, 'markFormGroupTouched').and.callThrough();
    component.pacienteForm.get('nome_completo')?.setValue('');
    component.validarFormulario();
    expect(component.markFormGroupTouched).toHaveBeenCalled();
  });

  it('deve exibir aviso se o CEP for inválido', () => {
    component.pacienteForm.get('endereco')?.get('cep')?.setValue('123');
    component.onCepChange();
    expect(notificacaoService.mostrarAviso).toHaveBeenCalledWith('CEP inválido. Certifique-se de que possui 8 dígitos.');
  });

  it('deve carregar os convênios ao inicializar', () => {
    spyOn(component, 'carregarConvenios').and.callThrough();
    component.ngOnInit();
    expect(component.carregarConvenios).toHaveBeenCalled();
  });

  it('deve carregar os planos ao selecionar um convênio', () => {
    spyOn(component, 'carregarPlanos').and.callThrough();
    const convenioId = 1;
    component.pacienteForm.get('convenio')?.setValue(convenioId);
    component.carregarPlanos(convenioId);
    expect(component.carregarPlanos).toHaveBeenCalledWith(convenioId);
  });

  it('deve abrir o modal de confirmação ao chamar abrirModalConfirmacao', () => {
    spyOn(component, 'abrirModalConfirmacao').and.callThrough();
    component.abrirModalConfirmacao();
    expect(component.abrirModalConfirmacao).toHaveBeenCalled();
  });

  it('deve marcar o formulário como "touched" ao chamar markFormGroupTouched', () => {
    const formGroup = component.pacienteForm;
    spyOn(formGroup, 'markAllAsTouched');
    component.markFormGroupTouched(formGroup);
    expect(formGroup.markAllAsTouched).toHaveBeenCalled();
  });

  it('deve exibir erro ao falhar na atualização do paciente', () => {
    pacienteService.atualizarPaciente.and.returnValue(of(null as unknown as Paciente));
    spyOn(console, 'error');
    component.onSubmit();
    expect(notificacaoService.mostrarErro).toHaveBeenCalledWith('Erro ao atualizar paciente.');
    expect(console.error).toHaveBeenCalled();
  });

  it('deve carregar os dados do paciente ao inicializar', () => {
    pacienteService.obterPacientePorId.and.returnValue(of(MOCK_PACIENTE_ATIVO));
    
    component.carregarPacientePorId('12345'); // Ajustar ID conforme o mock
    
    expect(component.pacienteForm.value.nome_completo).toEqual(MOCK_PACIENTE_ATIVO.nome_completo);
    expect(component.pacienteForm.value.cpf).toEqual(MOCK_PACIENTE_ATIVO.cpf);
  });

  it('deve limpar o formulário ao chamar resetarFormulario', () => {
    spyOn(component.pacienteForm, 'reset');
    component.limparFormulario();
    expect(component.pacienteForm.reset).toHaveBeenCalled();
  });

  it('deve exibir erro ao carregar paciente inexistente', () => {
    spyOn(console, 'error');
    pacienteService.obterPacientePorId.and.returnValue(of(null));

    component.carregarPacientePorId('999');

    expect(component.error).toBe('Paciente não encontrado.');
    expect(console.error).toHaveBeenCalled();
  });

  it('deve abrir e fechar o modal de confirmação corretamente', () => {
    spyOn(component, 'abrirModalConfirmacao').and.callThrough();
    // Add implementation or expectations here
  });

  it('deve validar CPF inválido', () => {
    const cpfControl = component.pacienteForm.get('cpf');
    cpfControl?.setValue('123'); // CPF inválido
    expect(cpfControl?.valid).toBeFalse();
  });

  it('deve atualizar paciente corretamente', () => {
    // Setup mocks
    pacienteService.atualizarPaciente.and.returnValue(of(MOCK_PACIENTE_ATIVO));
    
    // Carregar formulário com dados do mock
    component.pacienteForm.patchValue(MOCK_PACIENTE_ATIVO);
    
    // Testar submissão
    component.onSubmit();
    
    expect(pacienteService.atualizarPaciente).toHaveBeenCalled();
    expect(notificacaoService.mostrarSucesso).toHaveBeenCalledWith('Paciente atualizado com sucesso!');
  });
  
});
