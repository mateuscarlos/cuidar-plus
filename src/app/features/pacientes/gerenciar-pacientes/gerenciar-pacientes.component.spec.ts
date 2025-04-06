import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciarPacientesComponent } from './gerenciar-pacientes.component';

describe('GerenciarPacientesComponent', () => {
  let component: GerenciarPacientesComponent;
  let fixture: ComponentFixture<GerenciarPacientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciarPacientesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GerenciarPacientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
