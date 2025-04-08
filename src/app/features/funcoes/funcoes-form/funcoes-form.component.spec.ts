import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuncoesFormComponent } from './funcoes-form.component';

describe('FuncoesFormComponent', () => {
  let component: FuncoesFormComponent;
  let fixture: ComponentFixture<FuncoesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuncoesFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FuncoesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
