import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroFarmaciaComponent } from './cadastro-farmacia.component';

describe('CadastroFarmaciaComponent', () => {
  let component: CadastroFarmaciaComponent;
  let fixture: ComponentFixture<CadastroFarmaciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroFarmaciaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroFarmaciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
