import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PacienteService } from './paciente.service';
import { Paciente } from '../models/paciente.model';
import { environment } from '../../../../environments/environment';

describe('PacienteService', () => {
  let service: PacienteService;
  let httpMock: HttpTestingController;

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
    status: 'Ativo'
  };

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
    const mockPacientes: Paciente[] = [mockPaciente];

    service.listarTodosPacientes().subscribe(pacientes => {
      expect(pacientes).toEqual(mockPacientes);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/pacientes`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPacientes);
  });

  it('deve buscar um paciente por ID', () => {
    service.obterPacientePorId(1).subscribe(paciente => {
      expect(paciente).toEqual(mockPaciente);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/pacientes/buscar/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPaciente);
  });

  it('deve criar um novo paciente', () => {
    const novoPaciente: Paciente = { ...mockPaciente, id: undefined };

    service.criarPaciente(novoPaciente).subscribe(paciente => {
      expect(paciente).toEqual(mockPaciente);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/pacientes/criar`);
    expect(req.request.method).toBe('POST');
    req.flush(mockPaciente);
  });

  it('deve atualizar um paciente existente', () => {
    const pacienteAtualizado: Paciente = { ...mockPaciente, nome_completo: 'Paciente Atualizado' };

    service.atualizarPaciente(1, pacienteAtualizado).subscribe(paciente => {
      expect(paciente).toEqual(pacienteAtualizado);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/pacientes/atualizar/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(pacienteAtualizado);
  });

  it('deve excluir um paciente', () => {
    service.excluirPaciente(1).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/pacientes/delete/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});