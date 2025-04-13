import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { VisualizarPacienteComponent } from './visualizar-paciente.component';
import { PacienteService } from '../services/paciente.service';
import { ConvenioPlanoService } from '../services/convenio-plano.service';
import { NotificacaoService } from '../../../shared/services/notificacao.service';
import { StatusPaciente } from '../models/paciente.model';
import { MOCK_PACIENTE_ATIVO } from '../../../core/mocks/pacientes.mock';

describe('VisualizarPacienteComponent', () => {
  let component: VisualizarPacienteComponent;
  let fixture: ComponentFixture<VisualizarPacienteComponent>;
  let pacienteService: jasmine.SpyObj<PacienteService>;
  let convenioPlanoService: jasmine.SpyObj<ConvenioPlanoService>;
  let notificacaoService: jasmine.SpyObj<NotificacaoService>;

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
    pacienteService.obterPacientePorId.and.returnValue(of(MOCK_PACIENTE_ATIVO));

    component.carregarPacientePorId('12345'); // Ajustar ID conforme o mock

    expect(pacienteService.obterPacientePorId).toHaveBeenCalledWith('12345');
    expect(component.paciente).toEqual(MOCK_PACIENTE_ATIVO);
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
    const enderecoFormatado = component.formatarEndereco(MOCK_PACIENTE_ATIVO.endereco);
    expect(enderecoFormatado).toContain(MOCK_PACIENTE_ATIVO.endereco.logradouro);
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

    component.paciente = MOCK_PACIENTE_ATIVO;
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

    component.paciente = MOCK_PACIENTE_ATIVO;
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