import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: Router;
  let localStorageSpy: any;

  beforeEach(() => {
    // Mock localStorage
    localStorageSpy = {
      getItem: jasmine.createSpy('getItem'),
      setItem: jasmine.createSpy('setItem'),
      removeItem: jasmine.createSpy('removeItem')
    };
    spyOn(localStorage, 'getItem').and.callFake(localStorageSpy.getItem);
    spyOn(localStorage, 'setItem').and.callFake(localStorageSpy.setItem);
    spyOn(localStorage, 'removeItem').and.callFake(localStorageSpy.removeItem);

    // Setup TestBed
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [AuthService]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    
    // Reset environment mock for production testing
    // Ensure environment.production is properly mocked for testing
    Object.defineProperty(environment, 'production', { get: () => false });
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('carregarUsuarioSalvo', () => {
    it('should load saved user from localStorage on initialization', () => {
      const mockUser = { 
        id: '1', 
        nome: 'Test User', 
        email: 'test@example.com', 
        cargo: 'Tester',
        permissions: ['view_all']
      };
      
      localStorageSpy.getItem.and.returnValue(JSON.stringify(mockUser));
      
      // Re-create service to trigger constructor and carregarUsuarioSalvo
      service = TestBed.inject(AuthService);
      
      expect(localStorage.getItem).toHaveBeenCalledWith('current_user');
      expect(service.currentUser).toEqual(mockUser);
    });

    it('should clear localStorage if saved user is invalid JSON', () => {
      localStorageSpy.getItem.and.returnValue('invalid-json');
      
      // Re-create service to trigger constructor
      service = TestBed.inject(AuthService);
      
      expect(localStorage.removeItem).toHaveBeenCalledWith('current_user');
      expect(localStorage.removeItem).toHaveBeenCalledWith('auth_token');
      expect(service.currentUser).toBeNull();
    });
  });

  describe('login', () => {
    it('should make HTTP request in production environment', () => {
      // Override production value
      (environment.production as boolean) = true;
      
      const mockResponse = {
        user: { 
          id: '1', 
          nome: 'Test User', 
          email: 'test@example.com', 
          cargo: 'Tester',
          permissions: ['view_all'] 
        },
        token: 'test-token'
      };
      
      service.login('test@example.com', 'password').subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(localStorage.setItem).toHaveBeenCalledWith('auth_token', 'test-token');
        expect(localStorage.setItem).toHaveBeenCalledWith('current_user', JSON.stringify(mockResponse.user));
      });
      
      const req = httpMock.expectOne('/api/login');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ email: 'test@example.com', senha: 'password' });
      
      req.flush(mockResponse);
    });

    it('should handle HTTP error in production environment', () => {
      // Override production value
      (environment.production as boolean) = true;
      
      const errorMessage = 'Invalid credentials';
      
      service.login('test@example.com', 'wrong-password').subscribe({
        next: () => fail('Expected error, not success'),
        error: error => expect(error.message).toBe(errorMessage)
      });
      
      const req = httpMock.expectOne('/api/login');
      req.flush({ message: errorMessage }, { status: 401, statusText: 'Unauthorized' });
    });

    it('should authenticate admin user in development environment', () => {
      // Ensure we're in development mode
      (environment.production as boolean) = false;
      
      service.login('admin@cuidarplus.com', 'CuidarPlus@2025').subscribe(response => {
        expect(response.user.email).toBe('admin@cuidarplus.com');
        expect(response.token).toBe('mock-jwt-token');
        expect(localStorage.setItem).toHaveBeenCalledWith('auth_token', 'mock-jwt-token');
        expect(localStorage.setItem).toHaveBeenCalledWith(
          'current_user', 
          jasmine.any(String)
        );
      });
    });

    it('should reject invalid credentials in development environment', () => {
      // Ensure we're in development mode
      (environment.production as boolean) = false;
      
      service.login('wrong@email.com', 'wrong-password').subscribe({
        next: () => fail('Expected error, not success'),
        error: error => expect(error.message).toBe('Credenciais inválidas')
      });
    });
  });

  describe('logout', () => {
    it('should clear localStorage and navigate to login', () => {
      const navigateSpy = spyOn(router, 'navigate');
      
      service.logout();
      
      expect(localStorage.removeItem).toHaveBeenCalledWith('auth_token');
      expect(localStorage.removeItem).toHaveBeenCalledWith('current_user');
      expect(navigateSpy).toHaveBeenCalledWith(['/login']);
      expect(service.currentUser).toBeNull();
    });
  });

  describe('isLoggedIn', () => {
    it('should return true when auth_token exists in localStorage', () => {
      localStorageSpy.getItem.and.returnValue('some-token');
      expect(service.isLoggedIn).toBe(true);
    });

    it('should return false when auth_token does not exist in localStorage', () => {
      localStorageSpy.getItem.and.returnValue(null);
      expect(service.isLoggedIn).toBe(false);
    });
  });

  describe('hasPermission', () => {
    it('should return true when user has the specific permission', () => {
      const mockUser = { 
        id: '1', 
        nome: 'Test User', 
        email: 'test@example.com', 
        cargo: 'Tester',
        permissions: ['view_reports', 'edit_users'] 
      };

      // Set the current user manually
      (service as any).currentUserSubject.next(mockUser);
      
      expect(service.hasPermission('view_reports')).toBe(true);
      expect(service.hasPermission('edit_users')).toBe(true);
      expect(service.hasPermission('delete_users')).toBe(false);
    });

    it('should return true when user has admin permission regardless of specified permission', () => {
      const mockUser = { 
        id: '1', 
        nome: 'Admin User', 
        email: 'admin@example.com', 
        cargo: 'Admin',
        permissions: ['admin'] 
      };

      // Set the current user manually
      (service as any).currentUserSubject.next(mockUser);
      
      expect(service.hasPermission('any_permission')).toBe(true);
    });

    it('should return false when user has no permissions', () => {
      const mockUser = { 
        id: '1', 
        nome: 'Limited User', 
        email: 'limited@example.com', 
        cargo: 'User',
        permissions: [] 
      };

      // Set the current user manually
      (service as any).currentUserSubject.next(mockUser);
      
      expect(service.hasPermission('view_reports')).toBe(false);
    });

    it('should return false when user object is null', () => {
      // Set the current user to null
      (service as any).currentUserSubject.next(null);
      
      expect(service.hasPermission('any_permission')).toBe(false);
    });

    it('should return false when permissions array is undefined', () => {
      const mockUser = { 
        id: '1', 
        nome: 'User Without Permissions', 
        email: 'noperm@example.com', 
        cargo: 'User'
        // permissions is undefined
      };

      // Set the current user manually
      (service as any).currentUserSubject.next(mockUser);
      
      expect(service.hasPermission('any_permission')).toBe(false);
    });
  });
});