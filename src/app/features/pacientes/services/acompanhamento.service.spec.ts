import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AcompanhamentoService } from './acompanhamento.service';
import { environment } from '../../../../environments/environment';
import { MOCK_ACOMPANHAMENTO_PRESENCIAL, MOCK_PACIENTE_ATIVO } from '../../../core/mocks';

describe('AcompanhamentoService', () => {
  let service: AcompanhamentoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AcompanhamentoService]
    });

    service = TestBed.inject(AcompanhamentoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('deve buscar acompanhamentos de um paciente', () => {
    const pacienteId = MOCK_PACIENTE_ATIVO.id!;
    const acompanhamentos = [MOCK_ACOMPANHAMENTO_PRESENCIAL];

    service.obterAcompanhamentosPorPaciente(pacienteId).subscribe(result => {
      expect(result).toEqual(acompanhamentos);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/acompanhamentos/paciente/${pacienteId}`);
    expect(req.request.method).toBe('GET');
    req.flush(acompanhamentos);
  });

  it('deve criar um novo acompanhamento', () => {
    const novoAcompanhamento = MOCK_ACOMPANHAMENTO_PRESENCIAL;

    service.criarAcompanhamento(novoAcompanhamento).subscribe(result => {
      expect(result).toEqual(novoAcompanhamento);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/acompanhamentos/criar`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(novoAcompanhamento);
    req.flush(novoAcompanhamento);
  });

  it('deve obter acompanhamento por ID', () => {
    const acompanhamentoId = MOCK_ACOMPANHAMENTO_PRESENCIAL.id!;

    service.obterAcompanhamento(acompanhamentoId).subscribe(result => {
      expect(result).toEqual(MOCK_ACOMPANHAMENTO_PRESENCIAL);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/acompanhamentos/${acompanhamentoId}`);
    expect(req.request.method).toBe('GET');
    req.flush(MOCK_ACOMPANHAMENTO_PRESENCIAL);
  });
});