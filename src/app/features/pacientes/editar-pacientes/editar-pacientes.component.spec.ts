import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarPacientesComponent } from './editar-pacientes.component';

describe('EditarPacientesComponent', () => {
  let component: EditarPacientesComponent;
  let fixture: ComponentFixture<EditarPacientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarPacientesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarPacientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
