import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPesquisaUsuarioComponent } from './modal-pesquisa-usuario.component';

describe('ModalPesquisaUsuarioComponent', () => {
  let component: ModalPesquisaUsuarioComponent;
  let fixture: ComponentFixture<ModalPesquisaUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalPesquisaUsuarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalPesquisaUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
