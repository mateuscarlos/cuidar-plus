import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ConvenioPlanoService } from './convenio-plano.service';
import { Convenio } from '../models/convenio.model';
import { Plano } from '../models/plano.model';
import { environment } from '../../../../environments/environment';

describe('ConvenioPlanoService', () => {
  let service: ConvenioPlanoService;
  let httpMock: HttpTestingController;

  const mockConvenio: Convenio = {
    id: 1,
    nome: 'Convênio A',
    ativo: true,
    created_at: '2025-01-01',
    updated_at: '2025-01-02'
  };

  const mockPlano: Plano = {
    id: 1,
    convenio_id: 1,
    nome: 'Plano A',
    codigo: '123',
    tipo_acomodacao: 'Apartamento',
    ativo: true,
    created_at: '2025-01-01',
    updated_at: '2025-01-02',
    convenio: {
      id: mockConvenio.id!,
      nome: mockConvenio.nome
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ConvenioPlanoService]
    });

    service = TestBed.inject(ConvenioPlanoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve listar todos os convênios', () => {
    const mockConvenios: Convenio[] = [mockConvenio];

    service.listarConvenios().subscribe(convenios => {
      expect(convenios).toEqual(mockConvenios);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/convenios/listar`);
    expect(req.request.method).toBe('GET');
    req.flush(mockConvenios);
  });

  it('deve criar um novo convênio', () => {
    service.criarConvenio(mockConvenio).subscribe(convenio => {
      expect(convenio).toEqual(mockConvenio);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/convenios/criar`);
    expect(req.request.method).toBe('POST');
    req.flush(mockConvenio);
  });

  it('deve atualizar um convênio existente', () => {
    const convenioAtualizado: Convenio = { ...mockConvenio, nome: 'Convênio Atualizado' };

    service.atualizarConvenio(1, convenioAtualizado).subscribe(convenio => {
      expect(convenio).toEqual(convenioAtualizado);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/convenios/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(convenioAtualizado);
  });

  it('deve excluir um convênio', () => {
    service.removerConvenio(1).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/convenios/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('deve listar planos por convênio', () => {
    const mockPlanos: Plano[] = [mockPlano];

    service.listarPlanosPorConvenio(1).subscribe(planos => {
      expect(planos).toEqual(mockPlanos);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/planos/convenios/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPlanos);
  });
});