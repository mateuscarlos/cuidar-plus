import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { CadastrarUsuarioComponent } from './cadastrar-usuario.component';
import { ApiUsuarioService } from '../services/api-usuario.service';
import { NotificacaoService } from '../../../shared/services/notificacao.service';
import { of } from 'rxjs';
import { Usuario } from '../models/user.model';

describe('CadastrarUsuarioComponent', () => {
  let component: CadastrarUsuarioComponent;
  let fixture: ComponentFixture<CadastrarUsuarioComponent>;
  let apiUsuarioService: jasmine.SpyObj<ApiUsuarioService>;
  let notificacaoService: jasmine.SpyObj<NotificacaoService>;

  const mockUsuario: Usuario = {
    nome: 'Usuário Novo',
    email: 'usuarionovo@email.com',
    cpf: '12345678900',
    telefone: '11999999999',
    setor: 'TI',
    funcao: 'Desenvolvedor',
    status: 'Ativo',
    ativo: true
  };

  beforeEach(async () => {
    const apiSpy = jasmine.createSpyObj('ApiUsuarioService', ['criarUsuario']);
    const notificacaoSpy = jasmine.createSpyObj('NotificacaoService', ['mostrarErro', 'mostrarSucesso']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule],
      declarations: [CadastrarUsuarioComponent],
      providers: [
        { provide: ApiUsuarioService, useValue: apiSpy },
        { provide: NotificacaoService, useValue: notificacaoSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CadastrarUsuarioComponent);
    component = fixture.componentInstance;
    apiUsuarioService = TestBed.inject(ApiUsuarioService) as jasmine.SpyObj<ApiUsuarioService>;
    notificacaoService = TestBed.inject(NotificacaoService) as jasmine.SpyObj<NotificacaoService>;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve criar um novo usuário com dados válidos', () => {
    apiUsuarioService.criarUsuario.and.returnValue(of({ id: 1, ...mockUsuario }));

    component.usuarioForm.setValue({
      nome: 'Usuário Novo',
      email: 'usuarionovo@email.com',
      cpf: '12345678900',
      telefone: '11999999999',
      setor: 'TI',
      funcao: 'Desenvolvedor',
      status: 'Ativo'
    });

    component.onSubmit();

    expect(apiUsuarioService.criarUsuario).toHaveBeenCalledWith(mockUsuario);
    expect(notificacaoService.mostrarSucesso).toHaveBeenCalledWith('Usuário criado com sucesso!');
  });

  it('deve exibir erro ao tentar criar usuário com dados inválidos', () => {
    component.usuarioForm.get('nome')?.setValue('');
    component.onSubmit();

    expect(notificacaoService.mostrarErro).toHaveBeenCalledWith('Por favor, preencha todos os campos obrigatórios.');
  });
});