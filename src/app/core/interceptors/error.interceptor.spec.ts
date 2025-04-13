import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { ErrorInterceptor } from './error.interceptor';
import { ToastService } from '../../shared/services/toast.service';

describe('ErrorInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let toastService: jasmine.SpyObj<ToastService>;

  beforeEach(() => {
    const toastServiceSpy = jasmine.createSpyObj('ToastService', ['error', 'warning', 'success']);

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: ErrorInterceptor,
          multi: true
        },
        { provide: ToastService, useValue: toastServiceSpy }
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    toastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should show error toast for 400 errors', () => {
    httpClient.get('/test-url').subscribe({
      next: () => fail('Expected error response'),
      error: () => {}
    });

    const req = httpMock.expectOne('/test-url');
    req.flush('Invalid data', { status: 400, statusText: 'Bad Request' });

    expect(toastService.warning).toHaveBeenCalled();
  });

  it('should show error toast and navigate to login for 401 errors', () => {
    const routerSpy = spyOn(TestBed.inject(Router), 'navigate');

    httpClient.get('/test-url').subscribe({
      next: () => fail('Expected error response'),
      error: () => {}
    });

    const req = httpMock.expectOne('/test-url');
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

    expect(toastService.error).toHaveBeenCalled();
    expect(routerSpy).toHaveBeenCalledWith(['/login']);
  });

  it('should show error toast for 404 errors', () => {
    httpClient.get('/test-url').subscribe({
      next: () => fail('Expected error response'),
      error: () => {}
    });

    const req = httpMock.expectOne('/test-url');
    req.flush('Not found', { status: 404, statusText: 'Not Found' });

    expect(toastService.warning).toHaveBeenCalled();
  });

  it('should not intercept external requests', () => {
    const externalUrl = 'https://api.external-service.com/data';
    
    httpClient.get(externalUrl).subscribe({
      next: () => {},
      error: () => fail('Should not intercept external requests')
    });

    const req = httpMock.expectOne(externalUrl);
    req.flush({ data: 'test' });
  });
});