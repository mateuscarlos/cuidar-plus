import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalBuscaPacienteComponent } from './modal-busca-paciente.component';

describe('ModalBuscaPacienteComponent', () => {
  let component: ModalBuscaPacienteComponent;
  let fixture: ComponentFixture<ModalBuscaPacienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalBuscaPacienteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalBuscaPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
