import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common';
import { RelatoriosComponent } from './relatorios.component';
import { RELATORIOS_ROUTES } from './relatorios.routes';

describe('RelatoriosRoutes', () => {
  let router: Router;
  let location: Location;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(RELATORIOS_ROUTES)],
      declarations: []
    });

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
  });

  it('should define root route to RelatoriosComponent', () => {
    const routes = RELATORIOS_ROUTES;
    const defaultRoute = routes.find(route => route.path === '');
    
    expect(defaultRoute).toBeTruthy();
    expect(defaultRoute?.component).toBe(RelatoriosComponent);
  });

  it('should have exactly one route defined', () => {
    expect(RELATORIOS_ROUTES.length).toBe(1);
  });

  it('should navigate to relatorios component', async () => {
    await router.navigate(['']);
    expect(location.path()).toBe('/');
  });
});