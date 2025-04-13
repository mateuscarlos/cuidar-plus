import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UsuarioEstatisticasService } from './usuario-estatisticas.service';
import { environment } from '../../../../environments/environment';

describe('UsuarioEstatisticasService', () => {
  let service: UsuarioEstatisticasService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UsuarioEstatisticasService]
    });

    service = TestBed.inject(UsuarioEstatisticasService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve obter estatísticas de usuários', () => {
    const mockEstatisticas = {
      totalUsuarios: 100,
      usuariosAtivos: 80,
      totalAdmins: 10,
      usuariosInativos: 20
    };

    interface UsuarioEstatisticas {
      totalUsuarios: number;
      usuariosAtivos: number;
      totalAdmins: number;
      usuariosInativos: number;
    }

    service.getEstatisticas().subscribe((estatisticas: UsuarioEstatisticas) => {
      expect(estatisticas).toEqual(mockEstatisticas);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/usuarios/estatisticas`);
    expect(req.request.method).toBe('GET');
    req.flush(mockEstatisticas);
  });
});