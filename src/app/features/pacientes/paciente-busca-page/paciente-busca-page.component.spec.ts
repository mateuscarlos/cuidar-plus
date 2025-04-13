import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PacienteBuscaPageComponent } from './paciente-busca-page.component';
import { PacienteService } from '../services/paciente.service';
import { ConvenioPlanoService } from '../services/convenio-plano.service';
import { NotificacaoService } from '../../../shared/services/notificacao.service';
import { of, throwError } from 'rxjs';

describe('PacienteBuscaPageComponent', () => {
  let component: PacienteBuscaPageComponent;
  let fixture: ComponentFixture<PacienteBuscaPageComponent>;
  let pacienteService: jasmine.SpyObj<PacienteService>;
  let convenioService: jasmine.SpyObj<ConvenioPlanoService>;
  let notificacaoService: jasmine.SpyObj<NotificacaoService>;
  let router: jasmine.SpyObj<Router>;
    beforeEach(() => {
      const pacienteSpy = jasmine.createSpyObj('PacienteService', ['buscarPacientes']);
      const convenioSpy = jasmine.createSpyObj('ConvenioPlanoService', ['listarConvenios']);
      const notificacaoSpy = jasmine.createSpyObj('NotificacaoService', ['mostrarErro']);
      const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

      TestBed.configureTestingModule({
        imports: [RouterTestingModule, HttpClientTestingModule],
        declarations: [PacienteBuscaPageComponent],
        providers: [
          { provide: PacienteService, useValue: pacienteSpy },
          { provide: ConvenioPlanoService, useValue: convenioSpy },
          { provide: NotificacaoService, useValue: notificacaoSpy },
          { provide: Router, useValue: routerSpy }
        ]
      });
      
      fixture = TestBed.createComponent(PacienteBuscaPageComponent);
    pacienteService = TestBed.inject(PacienteService) as jasmine.SpyObj<PacienteService>;
    convenioService = TestBed.inject(ConvenioPlanoService) as jasmine.SpyObj<ConvenioPlanoService>;
    notificacaoService = TestBed.inject(NotificacaoService) as jasmine.SpyObj<NotificacaoService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar convênios ao inicializar', () => {
    const mockConvenios = [{ id: 1, nome: 'Convênio A', ativo: true }];
    convenioService.listarConvenios.and.returnValue(of(mockConvenios));

    component.carregarConvenios();

    expect(convenioService.listarConvenios).toHaveBeenCalled();
    expect(component.convenios).toEqual(mockConvenios);
  });

  it('deve exibir erro ao falhar ao carregar convênios', () => {
    convenioService.listarConvenios.and.returnValue(throwError(() => new Error('Erro ao carregar convênios')));

    component.carregarConvenios();

    expect(notificacaoService.mostrarErro).toHaveBeenCalledWith('Não foi possível carregar a lista de convênios.');
  });

  it('deve buscar pacientes com filtros', () => {
    const mockResponse = [{ id: 1, nome_completo: 'Paciente A' }];
    pacienteService.buscarPacientes.and.returnValue(of(mockResponse));

    component.buscarPacientes({ nome: 'Paciente A' });

    expect(pacienteService.buscarPacientes).toHaveBeenCalledWith({ nome: 'Paciente A', page: 1, limit: 10 });
    expect(component.pacientes).toEqual(mockResponse);
  });

  it('deve exibir erro ao falhar na busca de pacientes', () => {
    pacienteService.buscarPacientes.and.returnValue(throwError(() => new Error('Erro ao buscar pacientes')));

    component.buscarPacientes({ nome: 'Paciente A' });

    expect(notificacaoService.mostrarErro).toHaveBeenCalledWith('Não foi possível realizar a busca de pacientes.');
    expect(component.pacientes).toEqual([]);
  });

  it('deve limpar a busca', () => {
    component.pacientes = [{ id: 1, nome_completo: 'Paciente A' }];
    component.totalPacientes = 1;
    component.paginaAtual = 2;

    component.limparBusca();

    expect(component.pacientes).toEqual([]);
    expect(component.totalPacientes).toBe(0);
    expect(component.paginaAtual).toBe(1);
  });

  it('deve mudar a página e buscar pacientes novamente', () => {
    spyOn(component, 'buscarPacientes');
  it('deve mudar a página e buscar pacientes novamente', () => {
    spyOn(component, 'buscarPacientes');
    component.ultimaConsulta = { nome: 'Paciente A' };

    component.mudarPagina(2);
  });
  
  it('deve navegar para a página de cadastro de pacientes', () => {
    component.navegarParaCadastro();

    expect(router.navigate).toHaveBeenCalledWith(['/pacientes/criar']);
  });

    expect(router.navigate).toHaveBeenCalledWith(['/pacientes/visualizar', 1]);
  it('deve navegar para a página de visualização de pacientes', () => {
    component.visualizarPaciente({ id: 1 });

    expect(router.navigate).toHaveBeenCalledWith(['/pacientes/visualizar', 1]);
  });

  it('deve navegar para a página de edição de pacientes', () => {
    component.editarPaciente({ id: 1 });

    expect(router.navigate).toHaveBeenCalledWith(['/pacientes/editar', 1]);
  });

    expect(component.visualizarPaciente).toHaveBeenCalledWith({ id: 1 });
  });

  it('deve retornar o nome do convênio pelo ID', () => {
    component.convenios = [{ id: 1, nome: 'Convênio A' }];

    const nomeConvenio = component.getConvenioNome(1);

    expect(nomeConvenio).toBe('Convênio A');
  });

  it('deve retornar "Convênio não encontrado" se o ID não existir', () => {
    component.convenios = [{ id: 1, nome: 'Convênio A' }];

    const nomeConvenio = component.getConvenioNome(2);

    expect(nomeConvenio).toBe('Convênio não encontrado');
  });
});