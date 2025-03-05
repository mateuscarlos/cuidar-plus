import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcompanhaPacienteComponent } from './acompanha-paciente.component';

describe('AcompanhaPacienteComponent', () => {
  let component: AcompanhaPacienteComponent;
  let fixture: ComponentFixture<AcompanhaPacienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcompanhaPacienteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcompanhaPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
