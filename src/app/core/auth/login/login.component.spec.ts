import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../auth.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterTestingModule
      ],
      declarations: [],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the login form with email and password fields', () => {
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.get('email')).toBeDefined();
    expect(component.loginForm.get('senha')).toBeDefined();
  });

  it('should mark form as invalid when empty', () => {
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('should mark email as invalid when format is incorrect', () => {
    const emailControl = component.loginForm.get('email');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.valid).toBeFalsy();
    
    emailControl?.setValue('valid@email.com');
    expect(emailControl?.valid).toBeTruthy();
  });

  it('should disable submit button when form is invalid', () => {
    const submitButton = fixture.debugElement.query(By.css('button[type="submit"]'));
    expect(submitButton.nativeElement.disabled).toBeTruthy();
    
    component.loginForm.get('email')?.setValue('valid@email.com');
    component.loginForm.get('senha')?.setValue('password123');
    fixture.detectChanges();
    
    expect(submitButton.nativeElement.disabled).toBeFalsy();
  });

  it('should call authService.login when form is valid and submitted', () => {
    authServiceSpy.login.and.returnValue(of({ user: { id: '1', name: 'Test User', nome: 'Test Nome', email: 'test@example.com', cargo: 'Admin' }, token: 'test-token' }));
    
    component.loginForm.get('email')?.setValue('user@example.com');
    component.loginForm.get('senha')?.setValue('password123');
    component.onSubmit();
    
    expect(authServiceSpy.login).toHaveBeenCalledWith('user@example.com', 'password123');
  });

  it('should navigate to home after successful login', () => {
    authServiceSpy.login.and.returnValue(of({ user: { id: '1', name: 'Test User', nome: 'Test Nome', email: 'test@example.com', cargo: 'Admin' }, token: 'test-token' }));
    
    component.loginForm.get('email')?.setValue('user@example.com');
    component.loginForm.get('senha')?.setValue('password123');
    component.onSubmit();
    
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should show error message on login failure', () => {
    const errorMessage = 'Credenciais inválidas';
    authServiceSpy.login.and.returnValue(throwError(() => new Error(errorMessage)));
    
    component.loginForm.get('email')?.setValue('user@example.com');
    component.loginForm.get('senha')?.setValue('password123');
    component.onSubmit();
    fixture.detectChanges();
    
    expect(component.error).toBe(errorMessage);
    const errorElement = fixture.debugElement.query(By.css('.alert-danger'));
    expect(errorElement.nativeElement.textContent.trim()).toBe(errorMessage);
  });
});