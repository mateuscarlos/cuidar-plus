import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common';
import { CONFIGURACOES_ROUTES } from './configuracoes.routes';
import { ConfiguracoesComponent } from './configuracoes.component';
import { SetoresListComponent } from '../setores/setores-list/setores-list.component';
import { SetoresFormComponent } from '../setores/setores-form/setores-form.component';

describe('Configurações Routes', () => {
  let router: Router;
  let location: Location;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(CONFIGURACOES_ROUTES)],
      declarations: []
    });

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
  });

  it('should navigate to configurações component for empty path', async () => {
    const routes = CONFIGURACOES_ROUTES;
    const defaultRoute = routes.find(route => route.path === '');
    
    expect(defaultRoute).toBeTruthy();
    expect(defaultRoute?.component).toBe(ConfiguracoesComponent);
    expect(defaultRoute?.title).toBe('Configurações - Cuidar+');
  });

  it('should navigate to setores list component for /setores path', () => {
    const setoresRoute = CONFIGURACOES_ROUTES.find(route => route.path === 'setores');
    
    expect(setoresRoute).toBeTruthy();
    expect(setoresRoute?.component).toBe(SetoresListComponent);
    expect(setoresRoute?.title).toBe('Setores - Cuidar+');
  });

  it('should navigate to setores form component for /setores/novo path', () => {
    const novoSetorRoute = CONFIGURACOES_ROUTES.find(route => route.path === 'setores/novo');
    
    expect(novoSetorRoute).toBeTruthy();
    expect(novoSetorRoute?.component).toBe(SetoresFormComponent);
    expect(novoSetorRoute?.title).toBe('Novo Setor - Cuidar+');
  });

  it('should navigate to setores form component for /setores/editar/:id path', () => {
    const editarSetorRoute = CONFIGURACOES_ROUTES.find(route => route.path === 'setores/editar/:id');
    
    expect(editarSetorRoute).toBeTruthy();
    expect(editarSetorRoute?.component).toBe(SetoresFormComponent);
    expect(editarSetorRoute?.title).toBe('Editar Setor - Cuidar+');
  });

  // Teste de comentários - verifica que rotas comentadas não estão ativas
  it('should not have active convenios route', () => {
    const conveniosRoute = CONFIGURACOES_ROUTES.find(route => route.path === 'convenios');
    expect(conveniosRoute).toBeFalsy();
  });
});