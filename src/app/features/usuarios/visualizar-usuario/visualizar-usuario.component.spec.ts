import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { VisualizarUsuarioComponent } from './visualizar-usuario.component';
import { UsuarioService } from '../services/usuario.service';
import { NotificacaoService } from '../../../shared/services/notificacao.service';
import { Usuario } from '../models/user.model';

describe('VisualizarUsuarioComponent', () => {
  let component: VisualizarUsuarioComponent;
  let fixture: ComponentFixture<VisualizarUsuarioComponent>;
  let usuarioService: jasmine.SpyObj<UsuarioService>;
  let notificacaoService: jasmine.SpyObj<NotificacaoService>;

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

  beforeEach(async () => {
    const usuarioSpy = jasmine.createSpyObj('UsuarioService', ['obterUsuarioPorId']);
    const notificacaoSpy = jasmine.createSpyObj('NotificacaoService', ['mostrarErro']);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [VisualizarUsuarioComponent],
      providers: [
        { provide: UsuarioService, useValue: usuarioSpy },
        { provide: NotificacaoService, useValue: notificacaoSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: '1' })
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(VisualizarUsuarioComponent);
    component = fixture.componentInstance;
    usuarioService = TestBed.inject(UsuarioService) as jasmine.SpyObj<UsuarioService>;
    notificacaoService = TestBed.inject(NotificacaoService) as jasmine.SpyObj<NotificacaoService>;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar os dados do usuário ao inicializar', () => {
    usuarioService.obterUsuarioPorId.and.returnValue(of(mockUsuario));

    component.ngOnInit();

    expect(usuarioService.obterUsuarioPorId).toHaveBeenCalledWith('1');
    expect(component.usuario).toEqual(mockUsuario);
  });

  it('deve exibir erro ao falhar ao carregar os dados do usuário', () => {
    usuarioService.obterUsuarioPorId.and.returnValue(throwError(() => new Error('Erro ao carregar usuário')));
    spyOn(console, 'error');

    component.ngOnInit();

    expect(component.error).toBe('Não foi possível carregar os dados do usuário');
    expect(console.error).toHaveBeenCalled();
  });
});