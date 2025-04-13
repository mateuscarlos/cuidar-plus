import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PacienteService } from './paciente.service';
import { Paciente, StatusPaciente } from '../models/paciente.model';
import { 
  MOCK_PACIENTE_ATIVO,
  MOCK_PACIENTE_EM_AVALIACAO, 
  PACIENTES_MOCK 
} from '../../../core/mocks';
import { environment } from '../../../../environments/environment';

describe('PacienteService', () => {
  let service: PacienteService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PacienteService]
    });

    service = TestBed.inject(PacienteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve listar todos os pacientes', () => {
    const mockPacientes = PACIENTES_MOCK;

    service.listarTodosPacientes().subscribe(pacientes => {
      expect(pacientes).toEqual(mockPacientes);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/pacientes`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPacientes);
  });

  it('deve buscar um paciente por ID', () => {
    service.obterPacientePorId(MOCK_PACIENTE_ATIVO.id!).subscribe(paciente => {
      expect(paciente).toEqual(MOCK_PACIENTE_ATIVO);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/pacientes/buscar/${MOCK_PACIENTE_ATIVO.id}`);
    expect(req.request.method).toBe('GET');
    req.flush(MOCK_PACIENTE_ATIVO);
  });

  it('deve cadastrar um novo paciente', () => {
    service.criarPaciente(MOCK_PACIENTE_ATIVO).subscribe(paciente => {
      expect(paciente).toEqual(MOCK_PACIENTE_ATIVO);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/pacientes/criar`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(MOCK_PACIENTE_ATIVO);
    req.flush(MOCK_PACIENTE_ATIVO);
  });

  it('deve atualizar um paciente', () => {
    const pacienteAtualizado = { ...MOCK_PACIENTE_ATIVO, nome_completo: 'Nome Atualizado' };

    service.atualizarPaciente(MOCK_PACIENTE_ATIVO.id!, pacienteAtualizado).subscribe(paciente => {
      expect(paciente.nome_completo).toBe('Nome Atualizado');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/pacientes/atualizar/${MOCK_PACIENTE_ATIVO.id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(pacienteAtualizado);
    req.flush(pacienteAtualizado);
  });

  it('deve excluir um paciente', () => {
    service.excluirPaciente(MOCK_PACIENTE_ATIVO.id!).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/pacientes/delete/${MOCK_PACIENTE_ATIVO.id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ success: true });
  });

  it('deve buscar pacientes com filtros', () => {
    const filtros = { nome: 'Maria' };
    const pacientesFiltrados = PACIENTES_MOCK.filter(p => p.nome_completo.includes('Maria'));

    service.buscarPacientes(filtros).subscribe(pacientes => {
      expect(pacientes.length).toBeGreaterThan(0);
      expect(pacientes[0].nome_completo).toContain('Maria');
    });

    const req = httpMock.expectOne(request => 
      request.url.includes(`${environment.apiUrl}/pacientes/busca-avancada`) &&
      request.params.has('nome')
    );
    expect(req.request.method).toBe('GET');
    req.flush(pacientesFiltrados);
  });

  it('deve normalizar pacientes corretamente', () => {
    // Testando um paciente com endereço como string (simulando resposta da API)
    const pacienteComEnderecoString = {
      ...MOCK_PACIENTE_ATIVO,
      endereco: JSON.stringify(MOCK_PACIENTE_ATIVO.endereco)
    };

    service.obterPacientePorId(MOCK_PACIENTE_ATIVO.id!).subscribe(paciente => {
      expect(typeof paciente?.endereco).toBe('object');
      expect(paciente?.endereco.logradouro).toBe(MOCK_PACIENTE_ATIVO.endereco.logradouro);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/pacientes/buscar/${MOCK_PACIENTE_ATIVO.id}`);
    req.flush(pacienteComEnderecoString);
  });
});