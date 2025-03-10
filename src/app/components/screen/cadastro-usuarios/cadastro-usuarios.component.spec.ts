import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroUsuariosComponent } from './cadastro-usuarios.component';

describe('CadastroUsuariosComponent', () => {
  let component: CadastroUsuariosComponent;
  let fixture: ComponentFixture<CadastroUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroUsuariosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
