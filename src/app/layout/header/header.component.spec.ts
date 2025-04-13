import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import { HeaderComponent } from './header.component';
import { AuthService } from '../../core/auth/auth.service';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['logout'], {
      currentUser$: of({ nome: 'Teste Usuario', email: 'teste@example.com' })
    });

    await TestBed.configureTestingModule({
      imports: [HeaderComponent, RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: authSpy }
      ]
    }).compileComponents();

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the user name from AuthService', () => {
    const userNameElement = fixture.debugElement.query(By.css('.dropdown-toggle span')).nativeElement;
    expect(userNameElement.textContent.trim()).toBe('Teste Usuario');
  });

  it('should show notification indicator when hasNotifications is true', () => {
    component.hasNotifications = true;
    fixture.detectChanges();
    const badge = fixture.debugElement.query(By.css('.badge'));
    expect(badge).toBeTruthy();
  });

  it('should not show notification indicator when hasNotifications is false', () => {
    component.hasNotifications = false;
    fixture.detectChanges();
    const badge = fixture.debugElement.query(By.css('.badge'));
    expect(badge).toBeNull();
  });

  it('should call logout method when logout button is clicked', () => {
    const logoutLink = fixture.debugElement.query(By.css('.dropdown-item:last-child')).nativeElement;
    logoutLink.click();
    expect(authServiceSpy.logout).toHaveBeenCalled();
  });

  it('should emit toggleSidebar event when sidebar toggle button is clicked', () => {
    spyOn(component.toggleSidebar, 'emit');
    const toggleButton = fixture.debugElement.query(By.css('.sidebar-toggle')).nativeElement;
    toggleButton.click();
    expect(component.toggleSidebar.emit).toHaveBeenCalled();
  });
});
