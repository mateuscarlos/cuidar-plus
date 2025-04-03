import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Paciente, StatusPaciente } from '../models/paciente.model';
import { PacienteService } from '../services/paciente.service';
import { NotificacaoService } from '../../../shared/services/notificacao.service';
import { ESTADOS_CIVIS, GENEROS, ACOMODACOES } from '../../../core/mocks/constantes.mock';
import { CustomValidators } from '../../../shared/validators/custom-validators';
import { finalize } from 'rxjs/operators';
import { CepService } from '../../../core/services/cep.service';

@Component({
  selector: 'app-cadastrar-paciente',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cadastrar-paciente.component.html',
  styleUrls: ['./cadastrar-paciente.component.scss']
})
export class CadastrarPacienteComponent implements OnInit {
  pacienteForm!: FormGroup;
  estadosCivis = ESTADOS_CIVIS;
  generos = GENEROS;
  acomodacoes = ACOMODACOES;
  convenios: any[] = [];
  planos: any[] = [];
  planosFiltrados: any[] = [];
  isLoading = false;
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private pacienteService: PacienteService,
    private notificacaoService: NotificacaoService,
    private cepService: CepService // Injeção do serviço de CEP
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.carregarConvenios();
    this.carregarPlanos();
  }

  initForm(): void {
    this.pacienteForm = this.fb.group({
      nome_completo: ['', [Validators.required, Validators.minLength(5)]],
      cpf: ['', [Validators.required, CustomValidators.cpf()]],
      data_nascimento: ['', Validators.required],
      genero: [''],
      estado_civil: [''],
      profissao: [''],
      nacionalidade: [''],
      telefone: ['', Validators.required],
      telefone_secundario: [''],
      email: ['', Validators.email],
      endereco: this.fb.group({
        cep: ['', [Validators.required, CustomValidators.cep()]],
        logradouro: ['', Validators.required],
        numero: ['', Validators.required],
        complemento: [''],
        bairro: ['', Validators.required],
        cidade: ['', Validators.required],
        estado: ['', Validators.required]
      }),
      status: [StatusPaciente.ATIVO],
      cid_primario: ['', Validators.required],
      cid_secundario: [''],
      acomodacao: ['', Validators.required],
      medico_responsavel: [''],
      alergias: [''],
      convenio_id: [null],
      plano_id: [null],
      numero_carteirinha: [''],
      data_validade: [''],
      contato_emergencia: [''],
      telefone_emergencia: [''],
      case_responsavel: ['']
    });
  }

  carregarConvenios(): void {
    this.pacienteService.listarConvenios().subscribe({
      next: (convenios) => this.convenios = convenios,
      error: () => this.notificacaoService.mostrarErro('Erro ao carregar convênios.')
    });
  }

  carregarPlanos(): void {
    this.pacienteService.listarPlanos().subscribe({
      next: (planos) => this.planos = planos,
      error: () => this.notificacaoService.mostrarErro('Erro ao carregar planos.')
    });
  }

  onConvenioChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const convenioId = target?.value ? Number(target.value) : null;

    if (convenioId) {
      this.pacienteService.listarPlanosPorConvenio(convenioId).subscribe({
        next: (planos) => this.planosFiltrados = planos,
        error: () => this.notificacaoService.mostrarErro('Erro ao carregar planos para o convênio selecionado.')
      });
    } else {
      this.planosFiltrados = []; // Limpar os planos se nenhum convênio for selecionado
    }
  }

  onCepChange(): void {
    const cepControl = this.pacienteForm.get('endereco')?.get('cep');
    const cep = cepControl?.value;

    if (cep && cep.length === 8) {
      this.cepService.consultarCep(cep).subscribe({
        next: (endereco) => {
          if (endereco) {
            this.pacienteForm.patchValue({
              endereco: {
                logradouro: endereco.logradouro,
                bairro: endereco.bairro,
                cidade: endereco.localidade,
                estado: endereco.uf
              }
            });
          } else {
            this.notificacaoService.mostrarAviso('CEP não encontrado.');
          }
        },
        error: () => {
          this.notificacaoService.mostrarErro('Erro ao consultar o CEP.');
        }
      });
    } else {
      this.notificacaoService.mostrarAviso('CEP inválido. Certifique-se de que possui 8 dígitos.');
    }
  }

  onSubmit(): void {
    if (this.pacienteForm.invalid) {
      this.markFormGroupTouched(this.pacienteForm);
      this.notificacaoService.mostrarAviso('Por favor, preencha todos os campos obrigatórios corretamente.');
      return;
    }

    this.isLoading = true;

    // Encapsular os dados do formulário em um objeto estruturado
    const pacienteData = {
      nome_completo: this.pacienteForm.value.nome_completo,
      cpf: this.pacienteForm.value.cpf,
      data_nascimento: this.pacienteForm.value.data_nascimento,
      genero: this.pacienteForm.value.genero,
      estado_civil: this.pacienteForm.value.estado_civil,
      profissao: this.pacienteForm.value.profissao,
      nacionalidade: this.pacienteForm.value.nacionalidade,
      telefone: this.pacienteForm.value.telefone,
      telefone_secundario: this.pacienteForm.value.telefone_secundario,
      email: this.pacienteForm.value.email,
      endereco: {
        cep: this.pacienteForm.value.endereco.cep,
        logradouro: this.pacienteForm.value.endereco.logradouro,
        numero: this.pacienteForm.value.endereco.numero,
        complemento: this.pacienteForm.value.endereco.complemento,
        bairro: this.pacienteForm.value.endereco.bairro,
        cidade: this.pacienteForm.value.endereco.cidade,
        estado: this.pacienteForm.value.endereco.estado,
      },
      status: this.pacienteForm.value.status,
      cid_primario: this.pacienteForm.value.cid_primario,
      cid_secundario: this.pacienteForm.value.cid_secundario,
      acomodacao: this.pacienteForm.value.acomodacao,
      medico_responsavel: this.pacienteForm.value.medico_responsavel,
      alergias: this.pacienteForm.value.alergias,
      convenio_id: this.pacienteForm.value.convenio_id,
      plano_id: this.pacienteForm.value.plano_id,
      numero_carteirinha: this.pacienteForm.value.numero_carteirinha,
      data_validade: this.pacienteForm.value.data_validade,
      contato_emergencia: this.pacienteForm.value.contato_emergencia,
      telefone_emergencia: this.pacienteForm.value.telefone_emergencia,
      case_responsavel: this.pacienteForm.value.case_responsavel,
    };

    // Enviar os dados para o backend
    this.pacienteService.criarPaciente(pacienteData)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (paciente) => {
          this.notificacaoService.mostrarSucesso('Paciente cadastrado com sucesso!');
          this.router.navigate(['/pacientes/visualizar'], {
            queryParams: { pacienteId: paciente.id }
          });
        },
        error: (err) => {
          this.notificacaoService.mostrarErro('Erro ao cadastrar paciente. Tente novamente.');
        }
      });
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  isFieldValid(field: string): boolean {
    const control = this.pacienteForm.get(field);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  isEnderecoFieldValid(field: string): boolean {
    const control = this.pacienteForm.get('endereco')?.get(field);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  limparFormulario(): void {
    this.pacienteForm.reset();
    this.pacienteForm.get('status')?.setValue(StatusPaciente.ATIVO);
  }
}