import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { VisualizarPacienteComponent } from './visualizar-paciente.component';
import { PacienteService } from '../services/paciente.service';
import { ConvenioPlanoService } from '../services/convenio-plano.service';
import { NotificacaoService } from '../../../shared/services/notificacao.service';
import { Paciente, StatusPaciente } from '../models/paciente.model';

describe('VisualizarPacienteComponent', () => {
  let component: VisualizarPacienteComponent;
  let fixture: ComponentFixture<VisualizarPacienteComponent>;
  let pacienteService: jasmine.SpyObj<PacienteService>;
  let convenioPlanoService: jasmine.SpyObj<ConvenioPlanoService>;
  let notificacaoService: jasmine.SpyObj<NotificacaoService>;

  const mockPaciente: Paciente = {
    id: 1,
    nome_completo: 'Paciente A',
    cpf: '12345678900',
    data_nascimento: '2000-01-01',
    genero: 'M',
    estado_civil: 'Solteiro',
    nacionalidade: 'Brasileira',
    profissao: 'Engenheiro',
    telefone: '11999999999',
    endereco: {
      cep: '12345678',
      logradouro: 'Rua A',
      numero: '123',
      bairro: 'Centro',
      localidade: 'São Paulo',
      uf: 'SP'
    },
    status: StatusPaciente.ATIVO,
    created_at: '2025-01-01',
    updated_at: '2025-01-10'
  };

  beforeEach(async () => {
    const pacienteSpy = jasmine.createSpyObj('PacienteService', ['obterPacientePorId']);
    const convenioSpy = jasmine.createSpyObj('ConvenioPlanoService', ['listarConvenios', 'listarPlanosPorConvenio']);
    const notificacaoSpy = jasmine.createSpyObj('NotificacaoService', ['mostrarErro']);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [VisualizarPacienteComponent],
      providers: [
        { provide: PacienteService, useValue: pacienteSpy },
        { provide: ConvenioPlanoService, useValue: convenioSpy },
        { provide: NotificacaoService, useValue: notificacaoSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: '1' })
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(VisualizarPacienteComponent);
    component = fixture.componentInstance;
    pacienteService = TestBed.inject(PacienteService) as jasmine.SpyObj<PacienteService>;
    convenioPlanoService = TestBed.inject(ConvenioPlanoService) as jasmine.SpyObj<ConvenioPlanoService>;
    notificacaoService = TestBed.inject(NotificacaoService) as jasmine.SpyObj<NotificacaoService>;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar os dados do paciente ao inicializar', () => {
    pacienteService.obterPacientePorId.and.returnValue(of(mockPaciente));

    component.carregarPacientePorId('1');

    expect(pacienteService.obterPacientePorId).toHaveBeenCalledWith('1');
    expect(component.paciente).toEqual(mockPaciente);
    expect(component.modoVisualizacao).toBeTrue();
  });

  it('deve exibir erro ao falhar ao carregar os dados do paciente', () => {
    pacienteService.obterPacientePorId.and.returnValue(of(null));
    spyOn(console, 'error');

    component.carregarPacientePorId('1');

    expect(component.error).toBe('Não foi possível carregar os dados do paciente');
    expect(console.error).toHaveBeenCalled();
  });

  it('deve formatar o endereço corretamente', () => {
    const enderecoFormatado = component.formatarEndereco(mockPaciente.endereco);

    expect(enderecoFormatado).toBe('Rua A, 123 - Centro, São Paulo/SP - 12345-678');
  });

  it('deve formatar o CEP corretamente', () => {
    const cepFormatado = component.formatarCep('12345678');

    expect(cepFormatado).toBe('12345-678');
  });

  it('deve formatar a data corretamente', () => {
    const dataFormatada = component.formatarData('2025-01-01');

    expect(dataFormatada).toBe('01/01/2025');
  });

  it('deve navegar para a página de edição do paciente', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    component.paciente = mockPaciente;
    component.irParaEdicao();

    expect(router.navigate).toHaveBeenCalledWith(['/pacientes/editar', 1]);
  });

  it('deve exibir erro ao tentar editar sem paciente carregado', () => {
    component.paciente = null;

    component.irParaEdicao();

    expect(notificacaoService.mostrarErro).toHaveBeenCalledWith('Não é possível editar: paciente não encontrado ou sem ID.');
  });

  it('deve navegar para a página de acompanhamento do paciente', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    component.paciente = mockPaciente;
    component.irParaAcompanhamento();

    expect(router.navigate).toHaveBeenCalledWith(['/pacientes/acompanhamento'], {
      queryParams: { pacienteId: 1 }
    });
  });

  it('deve navegar de volta para a busca', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    component.voltarParaBusca();

    expect(router.navigate).toHaveBeenCalledWith(['/pacientes/busca']);
  });

  it('deve navegar de volta para a lista de pacientes', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    component.voltarParaLista();

    expect(router.navigate).toHaveBeenCalledWith(['/pacientes/lista']);
  });
});