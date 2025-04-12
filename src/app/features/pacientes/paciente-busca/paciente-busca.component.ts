import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { StatusPaciente } from '../models/paciente.model';

@Component({
  selector: 'app-paciente-busca',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="card shadow-sm mb-4">
      <div class="card-body">
        <h6 class="card-title mb-3">
          <i class="bi bi-search me-2"></i>Filtrar Pacientes
        </h6>
        
        <form [formGroup]="filtroForm">
          <div class="row g-3">
            <div class="col-md-4">
              <label for="nome" class="form-label">Nome</label>
              <div class="input-group">
                <span class="input-group-text"><i class="bi bi-person"></i></span>
                <input 
                  type="text" 
                  class="form-control" 
                  id="nome" 
                  formControlName="nome"
                  placeholder="Nome do paciente"
                >
              </div>
            </div>
            
            <div class="col-md-4">
              <label for="cpf" class="form-label">CPF</label>
              <div class="input-group">
                <span class="input-group-text"><i class="bi bi-card-text"></i></span>
                <input 
                  type="text" 
                  class="form-control" 
                  id="cpf" 
                  formControlName="cpf"
                  placeholder="000.000.000-00"
                >
              </div>
            </div>
            
            <div class="col-md-4">
              <label for="status" class="form-label">Status</label>
              <select class="form-select" id="status" formControlName="status">
                <option value="">Todos os status</option>
                <option *ngFor="let status of statusOptions" [value]="status">{{ status }}</option>
              </select>
            </div>
            
            <div class="col-12 d-flex justify-content-end gap-2">
              <button 
                type="button" 
                class="btn btn-outline-secondary" 
                (click)="limpar()"
                [disabled]="isLoading">
                <i class="bi bi-x-circle me-2"></i>Limpar Filtros
              </button>
              
              <button 
                type="button" 
                class="btn btn-primary" 
                (click)="aplicar()"
                [disabled]="isLoading">
                <i class="bi bi-search me-2"></i>Buscar
                <span *ngIf="isLoading" class="spinner-border spinner-border-sm ms-1" role="status" aria-hidden="true"></span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .card {
      border: none;
    }
    
    .card-title {
      font-weight: 600;
    }
  `]
})
export class PacienteBuscaComponent {
  @Input() statusOptions: string[] = Object.values(StatusPaciente);
  @Input() isLoading: boolean = false;
  
  @Output() filtrosChange = new EventEmitter<any>();
  @Output() limparFiltros = new EventEmitter<void>();
  
  // Expor o enum para usar no template
  readonly StatusPaciente = StatusPaciente;

  
  
  filtroForm: FormGroup;
  
  constructor(private fb: FormBuilder) {
    this.filtroForm = this.fb.group({
      nome: [''],
      cpf: [''],
      status: ['']
    });
    
    // Aplica debounce para não disparar muitas buscas durante digitação
    this.filtroForm.valueChanges
      .pipe(debounceTime(300))
      .subscribe(values => {
        // Só emite mudanças se algum dos campos tiver valor
        if (values.nome || values.cpf || values.status) {
          this.filtrosChange.emit(values);
        }
      });
  }
  
  aplicar(): void {
    this.filtrosChange.emit(this.filtroForm.value);
  }
  
  limpar(): void {
    this.filtroForm.reset({
      nome: '',
      cpf: '',
      status: ''
    });
    this.limparFiltros.emit();
  }
}