import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common';
import { FarmaciaComponent } from './farmacia.component';
import { FARMACIA_ROUTES } from './farmacia.routes';

describe('Farmácia Routes', () => {
  let router: Router;
  let location: Location;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(FARMACIA_ROUTES)],
      declarations: []
    });

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
  });

  it('should navigate to farmacia component for empty path', () => {
    const routes = FARMACIA_ROUTES;
    const defaultRoute = routes.find(route => route.path === '');
    
    expect(defaultRoute).toBeTruthy();
    expect(defaultRoute?.component).toBe(FarmaciaComponent);
  });

  it('should have just one route defined', () => {
    expect(FARMACIA_ROUTES.length).toBe(1);
  });

  it('should navigate to farmacia component when navigating to empty path', async () => {
    await router.navigate(['']);
    expect(location.path()).toBe('/');
  });
});