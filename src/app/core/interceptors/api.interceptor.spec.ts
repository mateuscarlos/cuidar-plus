import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { ApiInterceptor } from './api.interceptor';
import { environment } from '../../../environments/environment';

describe('ApiInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: ApiInterceptor,
          multi: true
        }
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);

    // Mock localStorage
    let store: { [key: string]: string | null } = {};
    spyOn(localStorage, 'getItem').and.callFake((key) => store[key] || null);
    spyOn(localStorage, 'setItem').and.callFake((key, value) => store[key] = value);
    spyOn(localStorage, 'removeItem').and.callFake((key) => delete store[key]);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add API URL to requests with relative paths', () => {
    httpClient.get('/users').subscribe();

    const httpRequest = httpMock.expectOne(`${environment.apiUrl}/api/users`);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush({});
  });

  it('should not modify URLs for pacientes routes', () => {
    httpClient.get('/pacientes/lista').subscribe();

    const httpRequest = httpMock.expectOne(`${environment.apiUrl}/pacientes/lista`);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush({});
  });

  it('should not modify absolute URLs', () => {
    const externalUrl = 'https://api.external-service.com/data';
    httpClient.get(externalUrl).subscribe();

    const httpRequest = httpMock.expectOne(externalUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush({});
  });

  it('should add auth token to headers if available', () => {
    const mockToken = 'test-auth-token';
    localStorage.setItem('auth_token', mockToken);

    httpClient.get('/users').subscribe();

    const httpRequest = httpMock.expectOne(`${environment.apiUrl}/api/users`);
    expect(httpRequest.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    httpRequest.flush({});
  });
});