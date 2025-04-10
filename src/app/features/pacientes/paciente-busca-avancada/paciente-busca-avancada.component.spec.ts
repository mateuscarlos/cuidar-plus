import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacienteBuscaAvancadaComponent } from './paciente-busca-avancada.component';

describe('PacienteBuscaAvancadaComponent', () => {
  let component: PacienteBuscaAvancadaComponent;
  let fixture: ComponentFixture<PacienteBuscaAvancadaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PacienteBuscaAvancadaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PacienteBuscaAvancadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
