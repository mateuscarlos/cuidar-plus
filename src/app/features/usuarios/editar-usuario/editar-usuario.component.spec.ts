import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { EditarUsuarioComponent } from './editar-usuario.component';
import { ApiUsuarioService } from '../services/api-usuario.service';
import { of } from 'rxjs';

describe('EditarUsuarioComponent', () => {
  let component: EditarUsuarioComponent;
  let fixture: ComponentFixture<EditarUsuarioComponent>;
  let apiUsuarioService: jasmine.SpyObj<ApiUsuarioService>;

  beforeEach(async () => {
    const apiSpy = jasmine.createSpyObj('ApiUsuarioService', ['obterUsuarioPorId', 'atualizarUsuario']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule],
      declarations: [EditarUsuarioComponent],
      providers: [{ provide: ApiUsuarioService, useValue: apiSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(EditarUsuarioComponent);
    component = fixture.componentInstance;
    apiUsuarioService = TestBed.inject(ApiUsuarioService) as jasmine.SpyObj<ApiUsuarioService>;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar os dados do usuário ao inicializar', () => {
    const mockUsuario = { id: 1, nome: 'Usuário A', email: 'usuarioa@email.com' };
    apiUsuarioService.obterUsuarioPorId.and.returnValue(of(mockUsuario));

    component.carregarUsuario(1);

    expect(apiUsuarioService.obterUsuarioPorId).toHaveBeenCalledWith(1);
    expect(component.usuarioForm.value.nome).toBe('Usuário A');
  });

  it('deve atualizar os dados do usuário ao submeter o formulário', () => {
    const mockUsuario = { id: 1, nome: 'Usuário A', email: 'usuarioa@email.com' };
    apiUsuarioService.atualizarUsuario.and.returnValue(of(mockUsuario));

    component.usuarioForm.setValue(mockUsuario);
    component.onSubmit();

    expect(apiUsuarioService.atualizarUsuario).toHaveBeenCalledWith(1, mockUsuario);
  });
});