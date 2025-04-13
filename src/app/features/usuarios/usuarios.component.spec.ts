import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { UsuariosComponent } from './usuarios.component';
import { UsuarioEstatisticasService } from './services/usuario-estatisticas.service';
import { of } from 'rxjs';

describe('UsuariosComponent', () => {
  let component: UsuariosComponent;
  let fixture: ComponentFixture<UsuariosComponent>;
  let estatisticasService: jasmine.SpyObj<UsuarioEstatisticasService>;

  beforeEach(async () => {
    const estatisticasSpy = jasmine.createSpyObj('UsuarioEstatisticasService', ['obterEstatisticas']);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [UsuariosComponent],
      providers: [{ provide: UsuarioEstatisticasService, useValue: estatisticasSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(UsuariosComponent);
    component = fixture.componentInstance;
    estatisticasService = TestBed.inject(UsuarioEstatisticasService) as jasmine.SpyObj<UsuarioEstatisticasService>;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar estatísticas ao inicializar', () => {
    const mockEstatisticas = {
      totalUsuarios: 100,
      usuariosAtivos: 80,
      totalAdmins: 10,
      usuariosInativos: 20
    };
    estatisticasService.getEstatisticas.and.returnValue(of(mockEstatisticas));

    component.carregarEstatisticas();

    expect(estatisticasService.getEstatisticas).toHaveBeenCalled();
    expect(component.totalUsuarios).toBe(100);
    expect(component.usuariosAtivos).toBe(80);
    expect(component.totalAdmins).toBe(10);
    expect(component.usuariosInativos).toBe(20);
  });

});