
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastrar-paciente',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cadastrar-paciente.component.html',
  styleUrls: ['./cadastrar-paciente.component.scss']
})
export class CadastrarPacienteComponent implements OnInit {
  pacienteForm!: FormGroup;
  estadosCivis = ['Solteiro(a)', 'Casado(a)', 'Divorciado(a)', 'Viúvo(a)', 'União Estável', 'Separado(a)'];
  generos = ['Masculino', 'Feminino', 'Não-binário', 'Prefiro não informar', 'Outro'];
  acomodacoes = ['Enfermaria', 'Apartamento', 'UTI', 'Semi-intensiva', 'Home Care'];
  
  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.pacienteForm = this.fb.group({
      nome_completo: ['', [Validators.required, Validators.maxLength(100)]],
      cpf: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
      convenio_id: [null],
      numero_carteirinha: [''],
      acomodacao: ['', Validators.required],
      telefone: ['', [Validators.required, Validators.maxLength(15)]],
      alergias: [''],
      cid_primario: ['', [Validators.required, Validators.maxLength(10)]],
      cid_secundario: ['', [Validators.maxLength(10)]],
      data_nascimento: ['', Validators.required],
      endereco: this.fb.group({
        cep: ['', Validators.required],
        logradouro: ['', Validators.required],
        numero: ['', Validators.required],
        complemento: [''],
        bairro: ['', Validators.required],
        cidade: ['', Validators.required],
        estado: ['', Validators.required]
      }),
      status: ['em-avaliacao'],
      email: ['', [Validators.email, Validators.maxLength(100)]],
      telefone_emergencia: ['', [Validators.maxLength(15)]],
      contato_emergencia: ['', [Validators.maxLength(100)]],
      case_responsavel: ['', [Validators.maxLength(100)]],
      medico_responsavel: ['', [Validators.maxLength(100)]],
      telefone_secundario: ['', [Validators.maxLength(15)]],
      genero: [''],
      estado_civil: [''],
      profissao: ['', [Validators.maxLength(50)]],
      nacionalidade: ['Brasileiro(a)', [Validators.maxLength(50)]],
      plano_id: [null],
      data_validade: ['']
    });
  }

  onSubmit(): void {
    if (this.pacienteForm.valid) {
      console.log('Dados do formulário:', this.pacienteForm.value);
      // Aqui seria feita a integração com a API
      alert('Paciente cadastrado com sucesso!');
      this.router.navigate(['/pacientes']);
    } else {
      this.markFormGroupTouched(this.pacienteForm);
      alert('Por favor, preencha corretamente todos os campos obrigatórios.');
    }
  }

  // Função auxiliar para marcar todos os campos como 'touched'
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Métodos auxiliares para verificação de campos
  isFieldValid(field: string) {
    const control = this.pacienteForm.get(field);
    return control && control.invalid && (control.dirty || control.touched);
  }

  isEnderecoFieldValid(field: string) {
    const control = this.pacienteForm.get('endereco')?.get(field);
    return control && control.invalid && (control.dirty || control.touched);
  }

  limparFormulario() {
    this.pacienteForm.reset({
      status: 'em-avaliacao',
      nacionalidade: 'Brasileiro(a)'
    });
  }
}