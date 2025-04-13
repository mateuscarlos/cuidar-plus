import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PacientesListComponent } from './pacientes-list.component';
import { PacienteService } from '../services/paciente.service';
import { DateFormatterService } from '../../../core/services/date-formatter.service';
import { NotificacaoService } from '../../../shared/services/notificacao.service';
import { of } from 'rxjs';
import { Paciente, StatusPaciente } from '../models/paciente.model';

describe('PacientesListComponent', () => {
  let component: PacientesListComponent;
  let fixture: ComponentFixture<PacientesListComponent>;
  let pacienteService: jasmine.SpyObj<PacienteService>;
  let dateFormatter: jasmine.SpyObj<DateFormatterService>;
  let notificacaoService: jasmine.SpyObj<NotificacaoService>;

  const mockPacientes: Paciente[] = [
    {
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
      status: StatusPaciente.ATIVO
    },
    {
      id: 2,
      nome_completo: 'Paciente B',
      cpf: '98765432100',
      data_nascimento: '1990-05-15',
      genero: 'F',
      estado_civil: 'Casada',
      nacionalidade: 'Brasileira',
      profissao: 'Médica',
      telefone: '11888888888',
      endereco: {
        cep: '87654321',
        logradouro: 'Rua B',
        numero: '456',
        bairro: 'Bairro Novo',
        localidade: 'Rio de Janeiro',
        uf: 'RJ'
      },
      status: StatusPaciente.INATIVO
    }
  ];

  beforeEach(async () => {
    const pacienteSpy = jasmine.createSpyObj('PacienteService', ['listarTodosPacientes']);
    const dateFormatterSpy = jasmine.createSpyObj('DateFormatterService', ['toBackendFormat']);
    const notificacaoSpy = jasmine.createSpyObj('NotificacaoService', ['mostrarErro']);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, FormsModule],
      declarations: [PacientesListComponent],
      providers: [
        { provide: PacienteService, useValue: pacienteSpy },
        { provide: DateFormatterService, useValue: dateFormatterSpy },
        { provide: NotificacaoService, useValue: notificacaoSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PacientesListComponent);
    component = fixture.componentInstance;
    pacienteService = TestBed.inject(PacienteService) as jasmine.SpyObj<PacienteService>;
    dateFormatter = TestBed.inject(DateFormatterService) as jasmine.SpyObj<DateFormatterService>;
    notificacaoService = TestBed.inject(NotificacaoService) as jasmine.SpyObj<NotificacaoService>;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar pacientes ao inicializar', () => {
    pacienteService.listarTodosPacientes.and.returnValue(of(mockPacientes));

    component.carregarPacientes();

    expect(pacienteService.listarTodosPacientes).toHaveBeenCalled();
    expect(component.pacientes).toEqual(mockPacientes);
    expect(component.filteredPacientes).toEqual(mockPacientes);
  });

  it('deve exibir erro ao falhar ao carregar pacientes', () => {
    pacienteService.listarTodosPacientes.and.returnValue(of([]));
    spyOn(console, 'error');

    component.carregarPacientes();

    expect(component.error).toBe('Não foi possível carregar a lista de pacientes. Por favor, tente novamente mais tarde.');
    expect(console.error).toHaveBeenCalled();
  });

  it('deve aplicar filtros locais corretamente', () => {
    component.pacientes = mockPacientes;
    component.searchTerm = 'Paciente A';
    component.statusFiltro = StatusPaciente.ATIVO;

    component.aplicarFiltrosLocais();

    expect(component.filteredPacientes.length).toBe(1);
    expect(component.filteredPacientes[0].nome_completo).toBe('Paciente A');
  });

  it('deve limpar os filtros', () => {
    component.searchTerm = 'Paciente A';
    component.statusFiltro = StatusPaciente.ATIVO;
    component.currentPage = 2;

    component.limparFiltros();

    expect(component.searchTerm).toBe('');
    expect(component.statusFiltro).toBe('');
    expect(component.currentPage).toBe(1);
  });

  it('deve alternar a ordenação corretamente', () => {
    component.sortBy = 'nome_completo';
    component.sortDirection = 'asc';

    component.toggleSort('nome_completo');

    expect(component.sortDirection).toBe('desc');

    component.toggleSort('data_nascimento');

    expect(component.sortBy).toBe('data_nascimento');
    expect(component.sortDirection).toBe('asc');
  });

  it('deve aplicar paginação corretamente', () => {
    component.pacientes = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      nome_completo: `Paciente ${i + 1}`,
      cpf: `${1000000000 + i}`,
      data_nascimento: '2000-01-01',
      genero: i % 2 === 0 ? 'M' : 'F',
      estado_civil: 'Solteiro',
      nacionalidade: 'Brasileira',
      profissao: 'Estudante',
      telefone: `1199999${1000 + i}`,
      endereco: {
        cep: '12345678',
        logradouro: 'Rua Teste',
        numero: `${100 + i}`,
        bairro: 'Centro',
        localidade: 'São Paulo',
        uf: 'SP'
      },
      status: i % 2 === 0 ? StatusPaciente.ATIVO : StatusPaciente.INATIVO
    }));
    component.pageSize = 10;
    component.currentPage = 2;

    const paginated = component.aplicarPaginacao(component.pacientes);

    expect(paginated.length).toBe(10);
    expect(paginated[0].id).toBe(11);
  });

  it('deve navegar para a próxima página', () => {
    component.currentPage = 1;
    component.totalPages = 3;

    component.proximaPagina();

    expect(component.currentPage).toBe(2);
  });

  it('deve navegar para a página anterior', () => {
    component.currentPage = 2;

    component.paginaAnterior();

    expect(component.currentPage).toBe(1);
  });
  it('deve navegar para visualizar paciente', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    component.visualizarPaciente(1);

    expect(router.navigate).toHaveBeenCalledWith(['/pacientes/visualizar', 1]);
  });
  
  it('deve navegar para editar paciente', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    component.editarPaciente(1);

    expect(router.navigate).toHaveBeenCalledWith(['/pacientes/editar', 1]);
  });
  
  it('deve navegar para cadastrar novo paciente', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    component.cadastrarNovoPaciente();

    expect(router.navigate).toHaveBeenCalledWith(['/pacientes/criar']);
  });

  it('deve formatar data corretamente', () => {
    dateFormatter.toBackendFormat.and.returnValue('2025-04-12');

    const formattedDate = component.formatarData('2025-04-12');

    expect(formattedDate).toBe('2025-04-12');
    expect(dateFormatter.toBackendFormat).toHaveBeenCalledWith('2025-04-12');
  });

  it('deve retornar opções de status', () => {
    const statusOptions = component.getStatusOptions();

    expect(statusOptions).toEqual(Object.values(StatusPaciente));
  });
});