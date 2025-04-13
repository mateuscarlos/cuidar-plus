import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UsuarioService } from './usuario.service';
import { Usuario } from '../models/user.model';
import { environment } from '../../../../environments/environment';
import { ResultadoPaginado } from './usuario.service';


describe('UsuarioService', () => {
  let service: UsuarioService;
  let httpMock: HttpTestingController;

  const mockUsuario: Usuario = {
    id: 1,
    nome: 'Usuário A',
    email: 'usuarioa@email.com',
    cpf: '12345678900',
    telefone: '11999999999',
    setor: 'TI',
    funcao: 'Desenvolvedor',
    status: 'Ativo',
    ativo: true
  };

  const mockUsuarios: Usuario[] = [
    mockUsuario,
    {
      id: 2,
      nome: 'Usuário B',
      email: 'usuariob@email.com',
      cpf: '98765432100',
      telefone: '11888888888',
      setor: 'RH',
      funcao: 'Analista',
      status: 'Inativo',
      ativo: false
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UsuarioService]
    });

    service = TestBed.inject(UsuarioService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });
  it('deve listar usuários', () => {
    const mockResultado: ResultadoPaginado<Usuario> = {
      items: mockUsuarios,
      total: 2,
      page: 1,
      totalPages: 1,
    };

    service.listarUsuarios().subscribe(resultado => {
      expect(resultado).toEqual(mockResultado);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/usuarios`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResultado);
  });

  it('deve buscar usuário por ID', () => {
    service.obterUsuarioPorId('1').subscribe(usuario => {
      expect(usuario).toEqual(mockUsuario);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/usuarios/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUsuario);
  });

  it('deve criar um novo usuário', () => {
    const novoUsuario: Usuario = {
      nome: 'Usuário Novo',
      email: 'usuarionovo@email.com',
      cpf: '11122233344',
      telefone: '11777777777',
      setor: 'Financeiro',
      funcao: 'Gerente',
      status: 'Ativo',
      ativo: true
    };

    service.criarUsuario(novoUsuario).subscribe(usuario => {
      expect(usuario).toEqual({ id: 3, ...novoUsuario });
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/usuarios`);
    expect(req.request.method).toBe('POST');
    req.flush({ id: 3, ...novoUsuario });
  });

  it('deve atualizar um usuário existente', () => {
    const usuarioAtualizado: Usuario = { ...mockUsuario, nome: 'Usuário Atualizado' };

    service.atualizarUsuario('1', usuarioAtualizado).subscribe(usuario => {
      expect(usuario).toEqual(usuarioAtualizado);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/usuarios/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(usuarioAtualizado);
  });

  it('deve excluir um usuário', () => {
    service.excluirUsuario('1').subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/usuarios/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});