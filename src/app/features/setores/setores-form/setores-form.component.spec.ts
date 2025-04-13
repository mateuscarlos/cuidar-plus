import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetoresFormComponent } from './setores-form.component';

describe('SetoresFormComponent', () => {
  let component: SetoresFormComponent;
  let fixture: ComponentFixture<SetoresFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetoresFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetoresFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
