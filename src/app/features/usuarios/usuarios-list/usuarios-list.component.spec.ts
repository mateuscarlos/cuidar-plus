import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UsuariosListComponent } from './usuarios-list.component';
import { UsuarioService } from '../services/usuario.service';
import { Usuario } from '../models/user.model';
import { ResultadoPaginado } from '../services/usuario.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

describe('UsuariosListComponent', () => {
  let component: UsuariosListComponent;
  let fixture: ComponentFixture<UsuariosListComponent>;
  let usuarioService: jasmine.SpyObj<UsuarioService>;

  const mockUsuarios: Usuario[] = [
    {
      id: 1,
      nome: 'Usuário A',
      email: 'usuarioa@email.com',
      cpf: '12345678900',
      telefone: '11999999999',
      setor: 'TI',
      funcao: 'Desenvolvedor',
      status: 'Ativo',
      ativo: true
    },
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

  beforeEach(async () => {
    const usuarioSpy = jasmine.createSpyObj('UsuarioService', ['listarUsuarios']);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [UsuariosListComponent],
      providers: [{ provide: UsuarioService, useValue: usuarioSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(UsuariosListComponent);
    component = fixture.componentInstance;
    usuarioService = TestBed.inject(UsuarioService) as jasmine.SpyObj<UsuarioService>;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });
  it('deve carregar usuários ao inicializar', () => {
    const mockResult = { items: mockUsuarios, total: mockUsuarios.length };
    usuarioService.listarUsuarios.and.returnValue(of(mockResult));

    component.carregarUsuarios();

    expect(usuarioService.listarUsuarios).toHaveBeenCalled();
    expect(component.usuarios).toEqual(mockUsuarios);
  });

  it('deve navegar para a página de cadastro', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    component.navegarParaCadastro();

    expect(router.navigate).toHaveBeenCalledWith(['/usuarios/criar']);
  });
  
    it('deve exibir mensagem ao não encontrar usuários', () => {
      usuarioService.listarUsuarios.and.returnValue(of({ items: [], total: 0 }));
  
      component.carregarUsuarios();
  
      expect(component.usuarios.length).toBe(0);
      expect(component.mensagem).toBe('Nenhum usuário encontrado.');
    });
  });
