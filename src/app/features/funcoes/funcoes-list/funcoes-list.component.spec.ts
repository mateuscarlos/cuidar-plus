import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuncoesListComponent } from './funcoes-list.component';

describe('FuncoesListComponent', () => {
  let component: FuncoesListComponent;
  let fixture: ComponentFixture<FuncoesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuncoesListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FuncoesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
