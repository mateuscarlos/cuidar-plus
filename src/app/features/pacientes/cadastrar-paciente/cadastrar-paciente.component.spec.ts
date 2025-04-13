import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Component } from '@angular/core';

import { CadastrarPacienteComponent } from './cadastrar-paciente.component';
import { PacienteService } from '../services/paciente.service';
import { ConvenioPlanoService } from '../services/convenio-plano.service';
import { CepService } from '../../../core/services/cep.service';
import { NotificacaoService } from '../../../shared/services/notificacao.service';
import { DateFormatterService } from '../../../core/services/date-formatter.service';

import {
  MOCK_PACIENTE_ATIVO,
  CONVENIOS_MOCK,
  PLANOS_MOCK,
  ENDERECOS_MOCK,
  MOCK_ENDERECO_SP
} from '../../../core/mocks';

describe('CadastrarPacienteComponent', () => {
  let component: CadastrarPacienteComponent;
  let fixture: ComponentFixture<CadastrarPacienteComponent>;
  let pacienteService: jasmine.SpyObj<PacienteService>;
  let convenioPlanoService: jasmine.SpyObj<ConvenioPlanoService>;
  let cepService: jasmine.SpyObj<CepService>;
  let notificacaoService: jasmine.SpyObj<NotificacaoService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const pacienteServiceSpy = jasmine.createSpyObj('PacienteService', ['cadastrarPaciente']);
    const convenioPlanoServiceSpy = jasmine.createSpyObj('ConvenioPlanoService', ['listarConvenios', 'listarPlanosPorConvenio']);
    const cepServiceSpy = jasmine.createSpyObj('CepService', ['consultarCep']);
    const notificacaoServiceSpy = jasmine.createSpyObj('NotificacaoService', ['mostrarSucesso', 'mostrarErro', 'mostrarAviso']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        CadastrarPacienteComponent
      ],
      providers: [
        { provide: PacienteService, useValue: pacienteServiceSpy },
        { provide: ConvenioPlanoService, useValue: convenioPlanoServiceSpy },
        { provide: CepService, useValue: cepServiceSpy },
        { provide: NotificacaoService, useValue: notificacaoServiceSpy },
        { provide: Router, useValue: routerSpy },
        DateFormatterService
      ]
    }).compileComponents();

    pacienteService = TestBed.inject(PacienteService) as jasmine.SpyObj<PacienteService>;
    convenioPlanoService = TestBed.inject(ConvenioPlanoService) as jasmine.SpyObj<ConvenioPlanoService>;
    cepService = TestBed.inject(CepService) as jasmine.SpyObj<CepService>;
    notificacaoService = TestBed.inject(NotificacaoService) as jasmine.SpyObj<NotificacaoService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    
    // Setup de mocks padrão
    convenioPlanoService.listarConvenios.and.returnValue(of(CONVENIOS_MOCK));
    
    fixture = TestBed.createComponent(CadastrarPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar convênios ao inicializar', () => {
    expect(convenioPlanoService.listarConvenios).toHaveBeenCalled();
    expect(component.convenios).toEqual(CONVENIOS_MOCK);
  });

  it('deve carregar planos quando um convênio é selecionado', () => {
    const convenioId = 1;
    const planosFiltrados = PLANOS_MOCK.filter(p => p.convenio_id === convenioId);
    
    convenioPlanoService.listarPlanosPorConvenio.and.returnValue(of(planosFiltrados));
    
    component.pacienteForm.get('convenio_id')?.setValue(convenioId);
    
    expect(convenioPlanoService.listarPlanosPorConvenio).toHaveBeenCalledWith(convenioId);
    expect(component.planosFiltrados).toEqual(planosFiltrados);
  });

  it('deve buscar CEP e preencher os campos de endereço', () => {
    cepService.consultarCep.and.returnValue(of(MOCK_ENDERECO_SP));
    
    component.pacienteForm.get('endereco')?.get('cep')?.setValue('01310100');
    component.onCepChange();
    
    expect(cepService.consultarCep).toHaveBeenCalledWith('01310100');
    expect(component.pacienteForm.get('endereco')?.get('logradouro')?.value).toBe(MOCK_ENDERECO_SP.logradouro);
    expect(component.pacienteForm.get('endereco')?.get('bairro')?.value).toBe(MOCK_ENDERECO_SP.bairro);
    expect(component.pacienteForm.get('endereco')?.get('uf')?.value).toBe(MOCK_ENDERECO_SP.uf);
  });

  it('deve mostrar aviso para CEP inválido', () => {
    component.pacienteForm.get('endereco')?.get('cep')?.setValue('123');
    component.onCepChange();
    
    expect(notificacaoService.mostrarAviso).toHaveBeenCalledWith(jasmine.any(String));
    expect(cepService.consultarCep).not.toHaveBeenCalled();
  });

  it('deve cadastrar paciente com sucesso', () => {
    component.pacienteForm.patchValue({
      nome_completo: MOCK_PACIENTE_ATIVO.nome_completo,
      cpf: MOCK_PACIENTE_ATIVO.cpf,
      data_nascimento: MOCK_PACIENTE_ATIVO.data_nascimento,
      genero: MOCK_PACIENTE_ATIVO.genero,
      telefone: MOCK_PACIENTE_ATIVO.telefone,
      endereco: MOCK_PACIENTE_ATIVO.endereco
    });
    
    pacienteService.criarPaciente.and.returnValue(of({ ...MOCK_PACIENTE_ATIVO, id: 12345 }));
    
    component.onSubmit();
    
    expect(pacienteService.criarPaciente).toHaveBeenCalled();
    expect(notificacaoService.mostrarSucesso).toHaveBeenCalledWith('Paciente cadastrado com sucesso!');
    expect(router.navigate).toHaveBeenCalledWith(['/pacientes/visualizar', 12345]);
  });

  it('deve tratar erros durante o cadastro', () => {
    component.pacienteForm.patchValue({
      nome_completo: MOCK_PACIENTE_ATIVO.nome_completo,
      cpf: MOCK_PACIENTE_ATIVO.cpf,
      data_nascimento: MOCK_PACIENTE_ATIVO.data_nascimento,
      genero: MOCK_PACIENTE_ATIVO.genero,
      telefone: MOCK_PACIENTE_ATIVO.telefone,
      endereco: MOCK_PACIENTE_ATIVO.endereco
    });
    
    pacienteService.criarPaciente.and.returnValue(throwError(() => new Error('Erro ao cadastrar')));
    
    component.onSubmit();
    
    expect(notificacaoService.mostrarErro).toHaveBeenCalled();
    expect(component.isSubmitting).toBeFalse();
  });

  it('não deve permitir submissão com formulário inválido', () => {
    // Formulário inválido por padrão
    component.onSubmit();
    
    expect(component.pacienteForm.valid).toBeFalse();
    expect(pacienteService.criarPaciente).not.toHaveBeenCalled();
    expect(notificacaoService.mostrarErro).toHaveBeenCalled();
  });
});