import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { UsuarioBuscaPageComponent } from './usuario-busca-page.component';
import { UsuarioService } from '../services/usuario.service';
import { of } from 'rxjs';
import { Usuario } from '../models/user.model';
import { Component } from '@angular/core';

describe('UsuarioBuscaPageComponent', () => {
  let component: UsuarioBuscaPageComponent;
  let fixture: ComponentFixture<UsuarioBuscaPageComponent>;
  let usuarioService: jasmine.SpyObj<UsuarioService>;

  const mockUsuarios = {
    items: [
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
    ],
    total: 2
  };

  beforeEach(async () => {
    const usuarioSpy = jasmine.createSpyObj('UsuarioService', ['buscarUsuarios']);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [UsuarioBuscaPageComponent],
      providers: [{ provide: UsuarioService, useValue: usuarioSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(UsuarioBuscaPageComponent);
    component = fixture.componentInstance;
    usuarioService = TestBed.inject(UsuarioService) as jasmine.SpyObj<UsuarioService>;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve buscar usuários com filtros', () => {
    usuarioService.buscarUsuarios.and.returnValue(of(mockUsuarios));

    component.buscarUsuarios({ nome: 'Usuário A' });

    expect(usuarioService.buscarUsuarios).toHaveBeenCalledWith({ nome: 'Usuário A' });
    expect(component.usuarios).toEqual(mockUsuarios.items);
    expect(component.totalUsuarios).toBe(2);
  });

  it('deve exibir mensagem ao não encontrar usuários', () => {
    usuarioService.buscarUsuarios.and.returnValue(of({ items: [], total: 0 }));

    component.buscarUsuarios({ nome: 'Usuário Inexistente' });

    expect(component.usuarios.length).toBe(0);
    expect(component.mensagem).toBe('Nenhum usuário encontrado.');
  });

  it('deve limpar os filtros e buscar novamente', () => {
    spyOn(component, 'buscarUsuarios');
    component.limparBusca();

    expect(component.filtros).toEqual({});
    expect(component.buscarUsuarios).toHaveBeenCalled();
  });
  it('deve navegar para a página de edição do usuário', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    component.editarUsuario(1);

    expect(router.navigate).toHaveBeenCalledWith(['/usuarios/editar', 1]);
  });

  it('deve navegar para a página de visualização do usuário', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    component.visualizarUsuario(1);

    expect(router.navigate).toHaveBeenCalledWith(['/usuarios/visualizar', 1]);
  });
  });
