import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { By } from '@angular/platform-browser';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the user name', () => {
    const userNameElement = fixture.debugElement.query(By.css('.dropdown-toggle span')).nativeElement;
    expect(userNameElement.textContent).toContain(component.userName);
  });

  it('should show notification indicator when hasNotifications is true', () => {
    component.hasNotifications = true;
    fixture.detectChanges();
    const badge = fixture.debugElement.query(By.css('.badge'));
    expect(badge).toBeTruthy();
  });

  it('should call logout method when logout button is clicked', () => {
    spyOn(component, 'logout');
    const logoutLink = fixture.debugElement.query(By.css('.dropdown-item:last-child')).nativeElement;
    logoutLink.click();
    expect(component.logout).toHaveBeenCalled();
  });
});
