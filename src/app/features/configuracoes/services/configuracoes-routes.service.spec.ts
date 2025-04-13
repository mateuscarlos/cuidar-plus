import { TestBed } from '@angular/core/testing';
import { ConfiguracoesRoutesService } from './configuracoes-routes.service';
import { RoutesService } from '../../../core/services/routes.service';

describe('ConfiguracoesRoutesService', () => {
  let service: ConfiguracoesRoutesService;
  let routesServiceSpy: jasmine.SpyObj<RoutesService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('RoutesService', [
      'navegarParaConfiguracoes',
      'navegarParaSetores', 
      'navegarParaNovoSetor',
      'navegarParaEditarSetor',
      'navegarParaFuncoes',
      'navegarParaNovaFuncao',
      'navegarParaEditarFuncao'
    ]);

    TestBed.configureTestingModule({
      providers: [
        ConfiguracoesRoutesService,
        { provide: RoutesService, useValue: spy }
      ]
    });
    
    service = TestBed.inject(ConfiguracoesRoutesService);
    routesServiceSpy = TestBed.inject(RoutesService) as jasmine.SpyObj<RoutesService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should navigate to configurações page', () => {
    service.navegarParaInicio();
    expect(routesServiceSpy.navegarParaConfiguracoes).toHaveBeenCalledOnceWith();
  });

  it('should navigate to setores list', () => {
    service.navegarParaSetores();
    expect(routesServiceSpy.navegarParaSetores).toHaveBeenCalledOnceWith();
  });

  it('should navigate to new setor form', () => {
    service.navegarParaNovoSetor();
    expect(routesServiceSpy.navegarParaNovoSetor).toHaveBeenCalledOnceWith();
  });

  it('should navigate to edit setor form with ID', () => {
    const testId = '123';
    service.navegarParaEditarSetor(testId);
    expect(routesServiceSpy.navegarParaEditarSetor).toHaveBeenCalledOnceWith(testId);
  });

  it('should navigate to funções list', () => {
    service.navegarParaFuncoes();
    expect(routesServiceSpy.navegarParaFuncoes).toHaveBeenCalledOnceWith();
  });

  it('should navigate to new função form', () => {
    service.navegarParaNovaFuncao();
    expect(routesServiceSpy.navegarParaNovaFuncao).toHaveBeenCalledOnceWith();
  });

  it('should navigate to edit função form with ID', () => {
    const testId = 456;
    service.navegarParaEditarFuncao(testId);
    expect(routesServiceSpy.navegarParaEditarFuncao).toHaveBeenCalledOnceWith(testId);
  });
});