import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

interface ResultadoBusca {
  tipo: 'cpf' | 'id' | 'nome';
  valor: string;
}

@Component({
  selector: 'app-busca-paciente',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './busca-paciente.component.html',
  styleUrls: ['./busca-paciente.component.scss']
})
export class BuscaPacienteComponent implements OnInit {
  @Output() resultadoBusca = new EventEmitter<ResultadoBusca>();
  buscaForm!: FormGroup;
  
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    this.setupListeners();
  }

  initForm(): void {
    this.buscaForm = this.fb.group({
      cpf: [''],
      id: [''],
      nome: ['']
    });
  }

  setupListeners(): void {
    // Monitor CPF changes
    this.buscaForm.get('cpf')?.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(valor => {
      if (valor && valor.length > 0) {
        this.limparOutrosCampos('cpf');
        this.resultadoBusca.emit({ tipo: 'cpf', valor });
      }
    });

    // Monitor ID changes
    this.buscaForm.get('id')?.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(valor => {
      if (valor && valor.length > 0) {
        this.limparOutrosCampos('id');
        this.resultadoBusca.emit({ tipo: 'id', valor });
      }
    });

    // Monitor Nome changes
    this.buscaForm.get('nome')?.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(valor => {
      if (valor && valor.length > 0) {
        this.limparOutrosCampos('nome');
        this.resultadoBusca.emit({ tipo: 'nome', valor });
      }
    });
  }

  limparOutrosCampos(campoAtual: string): void {
    const campos = ['cpf', 'id', 'nome'];
    campos.forEach(campo => {
      if (campo !== campoAtual && this.buscaForm.get(campo)?.value) {
        this.buscaForm.get(campo)?.setValue('', { emitEvent: false });
      }
    });
  }

  limparBusca(): void {
    this.buscaForm.reset();
  }
}
