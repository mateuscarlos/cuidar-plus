import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { RoutesService } from './routes.service';

describe('RoutesService', () => {
  let service: RoutesService;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        RoutesService,
        { provide: Router, useValue: routerSpy }
      ]
    });
    service = TestBed.inject(RoutesService);
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return routes when getRoutes is called', () => {
    const routes = service.getRoutes();
    expect(routes).toBeDefined();
    expect(routes.home).toBe('/home');
    expect(routes.login).toBe('/login');
    expect(routes.pacientes.base).toBe('/pacientes');
  });

  it('should navigate to home when navegarParaHome is called', () => {
    service.navegarParaHome();
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should navigate to login when navegarParaLogin is called', () => {
    service.navegarParaLogin();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should navigate to pacientes base route when navegarParaPacientes is called', () => {
    service.navegarParaPacientes();
    expect(router.navigate).toHaveBeenCalledWith(['/pacientes']);
  });

  it('should navigate to pacientes lista when navegarParaListaPacientes is called', () => {
    service.navegarParaListaPacientes();
    expect(router.navigate).toHaveBeenCalledWith(['/pacientes/lista']);
  });

  it('should navigate to cadastro paciente when navegarParaCadastroPaciente is called', () => {
    service.navegarParaCadastroPaciente();
    expect(router.navigate).toHaveBeenCalledWith(['/pacientes/criar']);
  });
});