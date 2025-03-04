import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalheUsuariosComponent } from './detalhe-usuarios.component';

describe('DetalheUsuariosComponent', () => {
  let component: DetalheUsuariosComponent;
  let fixture: ComponentFixture<DetalheUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalheUsuariosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalheUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
