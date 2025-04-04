import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BuscaPacienteComponent } from '../busca-paciente/busca-paciente.component';
import { Paciente, StatusPaciente } from '../models/paciente.model';
import { ResultadoBusca } from '../models/busca-paciente.model';
import { PacienteService } from '../services/paciente.service';
import { finalize } from 'rxjs/operators';
import { ESTADOS_CIVIS, GENEROS, ACOMODACOES } from '../../../core/mocks/constantes.mock';
import { CustomValidators } from '../../../shared/validators/custom-validators';
import { NotificacaoService } from '../../../shared/services/notificacao.service';
import { CepService } from '../../../core/services/cep.service';

@Component({
  selector: 'app-editar-paciente',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BuscaPacienteComponent],
  templateUrl: './editar-paciente.component.html',
  styleUrls: ['./editar-paciente.component.scss']
})
export class EditarPacienteComponent implements OnInit {
  pacienteForm!: FormGroup;
  estadosCivis = ESTADOS_CIVIS;
  generos = GENEROS;
  acomodacoes = ACOMODACOES;
  
  resultadosBusca: Paciente[] = [];
  pacienteSelecionado: Paciente | null = null;
  modoEdicao = false;
  isLoading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private pacienteService: PacienteService,
    private notificacaoService: NotificacaoService,
    private cepService: CepService
  ) {}

  ngOnInit(): void {
    this.initForm();
    
    this.route.queryParams.subscribe(params => {
      if (params['pacienteId']) {
        this.carregarPaciente(params['pacienteId']);
      }
    });
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
      status: ['ativo'],
      cid_primario: ['', Validators.required],
      cid_secundario: [''],
      acomodacao: ['', Validators.required],
      medico_responsavel: [''],
      alergias: [''],
      convenio_id: [''],
      plano_id: [''],
      numero_carteirinha: [''],
      data_validade: [''],
      contato_emergencia: [''],
      telefone_emergencia: [''],
      case_responsavel: ['']
    });
  }

  carregarPaciente(id: string): void {
    this.isLoading = true;
    this.error = null;
    
    this.pacienteService.obterPacientePorId(id)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (paciente) => {
          if (paciente) {
            this.pacienteSelecionado = paciente;
            this.modoEdicao = true;
            this.preencherFormulario(paciente);
          } else {
            this.error = 'Paciente não encontrado';
          }
        },
        error: (err) => {
          this.error = 'Erro ao carregar dados do paciente';
        }
      });
  }

  buscarPaciente(resultado: ResultadoBusca): void {
    this.isLoading = true;
    this.error = null;
    
    this.pacienteService.buscarPacientes(resultado)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (pacientes) => {
          this.resultadosBusca = pacientes;
          
          if (pacientes.length === 0) {
            this.error = 'Nenhum paciente encontrado com os critérios informados.';
          }
        },
        error: (err) => {
          this.error = 'Erro ao buscar pacientes';
          this.resultadosBusca = [];
        }
      });
  }

  selecionarPaciente(paciente: Paciente): void {
    this.pacienteSelecionado = paciente;
    this.modoEdicao = true;
    this.preencherFormulario(paciente);
  }
  
  preencherFormulario(paciente: Paciente): void {
    // Parse endereco if it's a string
    let endereco = paciente.endereco;
    if (typeof endereco === 'string') {
      try {
        endereco = JSON.parse(endereco);
      } catch (error) {
        console.error('Erro ao converter endereço:', error);
      }
    }

    this.pacienteForm.patchValue({
      nome_completo: paciente.nome_completo,
      cpf: paciente.cpf,
      data_nascimento: paciente.data_nascimento,
      genero: paciente.genero,
      estado_civil: paciente.estado_civil,
      profissao: paciente.profissao,
      nacionalidade: paciente.nacionalidade,
      telefone: paciente.telefone,
      telefone_secundario: paciente.telefone_secundario,
      email: paciente.email,
      endereco: {
        cep: endereco.cep,
        // Use rua OR logradouro, whichever is available
        logradouro: endereco.rua || endereco.logradouro || '',
        numero: endereco.numero,
        complemento: endereco.complemento,
        bairro: endereco.bairro,
        cidade: endereco.cidade,
        estado: endereco.estado
      },
      status: paciente.status,
      cid_primario: paciente.cid_primario,
      cid_secundario: paciente.cid_secundario,
      acomodacao: paciente.acomodacao,
      medico_responsavel: paciente.medico_responsavel,
      alergias: paciente.alergias,
      convenio_id: paciente.convenio_id,
      plano_id: paciente.plano_id,
      numero_carteirinha: paciente.numero_carteirinha,
      data_validade: paciente.data_validade,
      contato_emergencia: paciente.contato_emergencia,
      telefone_emergencia: paciente.telefone_emergencia,
      case_responsavel: paciente.case_responsavel
    });
  }

  salvarAlteracoes(): void {
    if (this.pacienteForm.invalid) {
      this.markFormGroupTouched(this.pacienteForm);
      this.notificacaoService.mostrarAviso('Por favor, preencha todos os campos obrigatórios corretamente.');
      return;
    }

    this.isLoading = true;

    const pacienteId = this.pacienteSelecionado?.id; // ID do paciente selecionado
    const dadosAtualizados = { ...this.pacienteForm.value }; // Cria uma cópia dos dados do formulário
    
    // Fix endereco field mapping
    if (dadosAtualizados.endereco) {
      // Map logradouro to rua for API compatibility
      dadosAtualizados.endereco = {
        ...dadosAtualizados.endereco,
        rua: dadosAtualizados.endereco.logradouro
      };
    }
    
    // Converter formato de data de nascimento de yyyy-mm-dd para dd/mm/yyyy
    if (dadosAtualizados.data_nascimento) {
      const data = new Date(dadosAtualizados.data_nascimento);
      if (!isNaN(data.getTime())) {
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0'); // Janeiro é 0
        const ano = data.getFullYear();
        dadosAtualizados.data_nascimento = `${dia}/${mes}/${ano}`;
      }
    }
    
    // Converter formato da data de validade, se existir
    if (dadosAtualizados.data_validade) {
      const data = new Date(dadosAtualizados.data_validade);
      if (!isNaN(data.getTime())) {
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const ano = data.getFullYear();
        dadosAtualizados.data_validade = `${dia}/${mes}/${ano}`;
      }
    }

    if (pacienteId) {
      this.pacienteService.atualizarPaciente(pacienteId, dadosAtualizados)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe({
          next: () => {
            this.notificacaoService.mostrarSucesso('Paciente atualizado com sucesso!');
            this.voltarParaLista(); // Redirecionar para a lista de pacientes
          },
          error: (err) => {
            this.notificacaoService.mostrarErro('Erro ao atualizar paciente: ' + (err.error?.message || 'Tente novamente.'));
          }
        });
    }
  }

  cancelarEdicao(): void {
    this.modoEdicao = false;
    this.pacienteSelecionado = null;
    this.pacienteForm.reset();
    this.pacienteForm.get('status')?.setValue('ativo');
  }

  voltarParaLista(): void {
    this.router.navigate(['/pacientes']);
  }

  // Função auxiliar para marcar todos os campos como 'touched'
  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Métodos auxiliares para verificação de campos
  isFieldValid(field: string): boolean {
    const control = this.pacienteForm.get(field);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  isEnderecoFieldValid(field: string): boolean {
    const control = this.pacienteForm.get('endereco')?.get(field);
    return control ? control.invalid && (control.dirty || control.touched) : false;
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
                // O campo complemento não será preenchido automaticamente
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

  abrirModalExcluir(): void {
    // Ensure bootstrap is globally available or import it
    const modal = new (window as any).bootstrap.Modal(document.getElementById('modalExcluirPaciente')!);
    modal.show();
  }

  excluirPaciente(): void {
    if (!this.pacienteSelecionado?.id) {
      this.notificacaoService.mostrarErro('Paciente não encontrado.');
      return;
    }
  
    this.isLoading = true;
  
    this.pacienteService.excluirPaciente(this.pacienteSelecionado.id)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: () => {
          this.notificacaoService.mostrarSucesso('Paciente excluído com sucesso!');
          window.location.reload(); // Recarregar a página após a exclusão
        },
        error: () => {
          this.notificacaoService.mostrarErro('Erro ao excluir paciente. Tente novamente.');
        }
      });
  }
}
