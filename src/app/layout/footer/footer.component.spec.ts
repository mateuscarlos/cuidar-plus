import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent, RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the current year in copyright notice', () => {
    const currentYear = new Date().getFullYear();
    expect(component.currentYear).toBe(currentYear);
    
    const copyrightElement = fixture.debugElement.query(By.css('.text-muted')).nativeElement;
    expect(copyrightElement.textContent).toContain(currentYear.toString());
  });

  it('should display the company logo', () => {
    const logoElement = fixture.debugElement.query(By.css('img'));
    expect(logoElement).toBeTruthy();
  });

  it('should have quick links section with links', () => {
    const quickLinksSection = fixture.debugElement.query(By.css('h6.text-dark.fw-bold')).nativeElement;
    expect(quickLinksSection.textContent).toContain('Links rápidos');
    
    const links = fixture.debugElement.queryAll(By.css('.list-unstyled li a'));
    expect(links.length).toBeGreaterThan(0);
  });

  it('should have newsletter subscription form', () => {
    const emailInput = fixture.debugElement.query(By.css('input[type="email"]'));
    const subscribeButton = fixture.debugElement.query(By.css('button.btn-primary'));
    
    expect(emailInput).toBeTruthy();
    expect(subscribeButton).toBeTruthy();
    expect(subscribeButton.nativeElement.textContent.trim()).toBe('Assinar');
  });

  it('should have social media links', () => {
    const socialLinks = fixture.debugElement.queryAll(By.css('.d-flex.gap-3 a'));
    expect(socialLinks.length).toBeGreaterThanOrEqual(4); // Facebook, Instagram, Twitter, LinkedIn
  });
});
