import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BuscaPacienteComponent } from '../busca-paciente/busca-paciente.component';
import { 
  TipoAtendimento,
  MotivoAtendimento,
  NivelDor,
  CondicaoPaciente
} from '../models/acompanhamento.model';
import { Paciente } from '../models/paciente.model';
import { ResultadoBusca } from '../models/busca-paciente.model';
import { PacienteService } from '../services/paciente.service';
import { AcompanhamentoService } from '../services/acompanhamento.service';
import { NotificacaoService } from '../../../shared/services/notificacao.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-criar-acompanhamento-paciente', // Alterado para corresponder ao nome do arquivo
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BuscaPacienteComponent],
  templateUrl: './criar-acompanhamento-paciente.component.html',
  styleUrls: ['./criar-acompanhamento-paciente.component.scss']
})
export class CriarAcompanhamentoPacienteComponent implements OnInit { // Alterado o nome da classe
  acompanhamentoForm!: FormGroup;
  pacienteSelecionado: Paciente | null = null;
  modoEdicao = false;
  resultadosBusca: Paciente[] = [];
  isLoading = false;
  error: string | null = null;
  
  // Enums para os selects
  tiposAtendimento = Object.values(TipoAtendimento);
  motivosAtendimento = Object.values(MotivoAtendimento);
  niveisDor = Object.values(NivelDor);
  condicoesPaciente = Object.values(CondicaoPaciente);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private pacienteService: PacienteService,
    private acompanhamentoService: AcompanhamentoService,
    private notificacaoService: NotificacaoService
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
    this.acompanhamentoForm = this.fb.group({
      profissional: this.fb.group({
        nome_profissional: ['', Validators.required],
        cargo: ['', Validators.required]
      }),
      data_hora_atendimento: ['', Validators.required],
      tipo_atendimento: [TipoAtendimento.PRESENCIAL, Validators.required],
      motivo_atendimento: [MotivoAtendimento.ROTINA, Validators.required],
      descricao_motivo: [''],
      condicao_paciente: [CondicaoPaciente.ESTAVEL, Validators.required],
      descricao_condicao: [''],
      nivel_dor: [NivelDor.SEM_DOR],
      localizacao_dor: [''],
      sinais_vitais: this.fb.group({
        pressao_arterial: [''],
        frequencia_cardiaca: [''],
        temperatura: [''],
        saturacao_oxigenio: [''],
        glicemia: ['']
      }),
      avaliacao_feridas: this.fb.group({
        aspecto: [''],
        sinais_infeccao: [false],
        tipo_curativo: ['']
      }),
      avaliacao_dispositivos: this.fb.group({
        funcionamento_adequado: [true],
        sinais_complicacao: ['']
      }),
      intervencoes: this.fb.group({
        medicacao_administrada: [''],
        curativo_realizado: [''],
        orientacoes_fornecidas: [''],
        procedimentos_realizados: [''],
        outras_intervencoes: ['']
      }),
      plano_acao: this.fb.group({
        data_proximo: [''],
        hora_proximo: [''],
        profissional_responsavel: [''],
        necessidade_contato_outros: [false],
        profissionais_contatar: [''],
        necessidade_exames: [false],
        exames_consultas: [''],
        outras_recomendacoes: ['']
      }),
      comunicacao_cuidador: this.fb.group({
        nome_cuidador: [''],
        informacoes_repassadas: [''],
        orientacoes_fornecidas: [''],
        duvidas_esclarecidas: ['']
      })
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
  }

  salvarAcompanhamento(): void {
    if (this.acompanhamentoForm.invalid) {
      this.markFormGroupTouched(this.acompanhamentoForm);
      this.notificacaoService.mostrarAviso('Por favor, preencha todos os campos obrigatórios corretamente.');
      return;
    }
    
    if (!this.pacienteSelecionado) {
      this.notificacaoService.mostrarErro('Nenhum paciente selecionado.');
      return;
    }
    
    this.isLoading = true;
    
    const acompanhamento = {
      ...this.acompanhamentoForm.value,
      paciente_id: Number(this.pacienteSelecionado.id)
    };
    
    this.acompanhamentoService.criarAcompanhamento(acompanhamento)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (acompanhamento) => {
          this.notificacaoService.mostrarSucesso('Acompanhamento registrado com sucesso!');
          this.router.navigate(['/pacientes/visualizar'], {
            queryParams: { pacienteId: this.pacienteSelecionado?.id }
          });
        },
        error: (err) => {
          this.notificacaoService.mostrarErro('Erro ao registrar acompanhamento. Tente novamente.');
        }
      });
  }

  cancelar(): void {
    if (this.pacienteSelecionado) {
      this.router.navigate(['/pacientes/visualizar'], {
        queryParams: { pacienteId: this.pacienteSelecionado.id }
      });
    } else {
      this.voltarParaLista();
    }
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
    const control = this.acompanhamentoForm.get(field);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  isNestedFieldValid(group: string, field: string): boolean {
    const control = this.acompanhamentoForm.get(group)?.get(field);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  // Método para mostrar campos condicionais com base na seleção
  deveExibirCampo(condicao: string, valor: string): boolean {
    const control = this.acompanhamentoForm.get(condicao);
    return control ? control.value === valor : false;
  }
}
