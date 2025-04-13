import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { BuscaPacienteComponent } from '../busca-paciente/busca-paciente.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { 
  TipoAtendimento,
  MotivoAtendimento,
  NivelDor,
  CondicaoPaciente,
  Acompanhamento,
  SinaisVitais,
  AvaliacaoFerida,
  AvaliacaoDispositivo,
  Intervencoes,
  PlanoAcao,
  ComunicacaoCuidador
} from '../models/acompanhamento.model';
import { Paciente, StatusPaciente, ResultadoBusca } from '../models/paciente.model';
import { PacienteService } from '../services/paciente.service';
import { AcompanhamentoService } from '../services/acompanhamento.service';
import { NotificacaoService } from '../../../shared/services/notificacao.service';
import { StatusStyleService } from '../../../../styles/status-style.service';
import { finalize } from 'rxjs/operators';
import { DateFormatterService } from '../../../core/services/date-formatter.service';

@Component({
  selector: 'app-criar-acompanhamento-paciente',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    BuscaPacienteComponent,
    RouterModule,
    StatusBadgeComponent
  ],
  templateUrl: './criar-acompanhamento-paciente.component.html',
  styleUrls: ['./criar-acompanhamento-paciente.component.scss']
})
export class CriarAcompanhamentoPacienteComponent implements OnInit {
  acompanhamentoForm!: FormGroup;
  pacienteSelecionado: Paciente | null = null;
  modoEdicao = false;
  resultadosBusca: Paciente[] = [];
  isLoading = false;
  error: string | null = null;
  dataAtual: string;
  
  // Enums para os selects
  tiposAtendimento = Object.values(TipoAtendimento);
  motivosAtendimento = Object.values(MotivoAtendimento);
  niveisDor = Object.values(NivelDor);
  condicoesPaciente = Object.values(CondicaoPaciente);
  statusPaciente = Object.values(StatusPaciente);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private pacienteService: PacienteService,
    private acompanhamentoService: AcompanhamentoService,
    private notificacaoService: NotificacaoService,
    private dateFormatter: DateFormatterService,
    public statusStyle: StatusStyleService
  ) {
    this.dataAtual = this.dateFormatter.toHtmlDateTimeFormat(new Date());
  }

  ngOnInit(): void {
    this.initForm();
    
    this.route.queryParams.subscribe(params => {
      if (params['pacienteId']) {
        this.carregarPaciente(params['pacienteId']);
      }
    });
  }

  /**
   * Inicializa o formulário com estrutura bem definida respeitando os tipos
   */
  initForm(): void {
    this.acompanhamentoForm = this.fb.group({
      // Profissional responsável pelo acompanhamento
      profissional: this.fb.group({
        nome: ['', Validators.required],
        cargo: ['', Validators.required]
      }),
      
      // Dados do atendimento
      data_hora_atendimento: [this.dataAtual, Validators.required],
      tipo_atendimento: [TipoAtendimento.PRESENCIAL, Validators.required],
      motivo_atendimento: [MotivoAtendimento.ROTINA, Validators.required],
      descricao_motivo: [''],

      // Condição geral do paciente
      condicao_paciente: [CondicaoPaciente.ESTAVEL, Validators.required],
      descricao_condicao: [''],
      nivel_dor: [NivelDor.SEM_DOR],
      localizacao_dor: [''],
      
      // Dados estruturados com typagem forte
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
      }),
      
      // Campo adicional para observações gerais
      observacoes_gerais: ['']
    });

    // Validações condicionais
    this.acompanhamentoForm.get('motivo_atendimento')?.valueChanges.subscribe(value => {
      const descricaoMotivo = this.acompanhamentoForm.get('descricao_motivo');
      if (value === MotivoAtendimento.QUEIXA || value === MotivoAtendimento.OUTROS) {
        descricaoMotivo?.setValidators([Validators.required]);
      } else {
        descricaoMotivo?.setValidators(null);
      }
      descricaoMotivo?.updateValueAndValidity();
    });

    this.acompanhamentoForm.get('condicao_paciente')?.valueChanges.subscribe(value => {
      const descricaoCondicao = this.acompanhamentoForm.get('descricao_condicao');
      if (value === CondicaoPaciente.INSTAVEL) {
        descricaoCondicao?.setValidators([Validators.required]);
      } else {
        descricaoCondicao?.setValidators(null);
      }
      descricaoCondicao?.updateValueAndValidity();
    });

    this.acompanhamentoForm.get('nivel_dor')?.valueChanges.subscribe(value => {
      const localizacaoDor = this.acompanhamentoForm.get('localizacao_dor');
      if (value && value !== NivelDor.SEM_DOR) {
        localizacaoDor?.setValidators([Validators.required]);
      } else {
        localizacaoDor?.setValidators(null);
      }
      localizacaoDor?.updateValueAndValidity();
    });
  }

  /**
   * Carrega os dados de um paciente específico
   */
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
            this.notificacaoService.mostrarErro('Paciente não encontrado.');
          }
        },
        error: (err) => {
          this.error = 'Erro ao carregar dados do paciente';
          this.notificacaoService.mostrarErro('Erro ao carregar dados do paciente');
          console.error('Erro ao carregar paciente:', err);
        }
      });
  }

  /**
   * Processa a busca de pacientes
   */
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
          } else if (pacientes.length === 1) {
            // Selecionar automaticamente quando houver apenas um resultado
            this.selecionarPaciente(pacientes[0]);
          }
        },
        error: (err) => {
          this.error = 'Erro ao buscar pacientes';
          this.resultadosBusca = [];
          this.notificacaoService.mostrarErro('Erro ao buscar pacientes.');
          console.error('Erro ao buscar pacientes:', err);
        }
      });
  }

  /**
   * Seleciona um paciente da lista de resultados
   */
  selecionarPaciente(paciente: Paciente): void {
    this.pacienteSelecionado = paciente;
    this.modoEdicao = true;
    this.resultadosBusca = [];
  }

  /**
   * Processa o formulário e salva o acompanhamento
   */
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
    
    // Obtém os valores do formulário com tipagem correta
    const formValues = this.processarFormulario();
    
    this.acompanhamentoService.criarAcompanhamento(formValues)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (acompanhamento) => {
          this.notificacaoService.mostrarSucesso('Acompanhamento registrado com sucesso!');
          this.router.navigate(['/pacientes/visualizar', this.pacienteSelecionado?.id]);
        },
        error: (err) => {
          this.notificacaoService.mostrarErro('Erro ao registrar acompanhamento. Tente novamente.');
          console.error('Erro ao criar acompanhamento:', err);
        }
      });
  }

  /**
   * Processa os dados do formulário antes de enviar para API
   */
  processarFormulario(): Acompanhamento {
    const formValues = { ...this.acompanhamentoForm.value };
    
    // Adicionar o ID do paciente
    formValues.paciente_id = this.pacienteSelecionado!.id;
    
    // Formatar a data de atendimento para o formato aceito pela API
    if (formValues.data_hora_atendimento) {
      formValues.data_hora_atendimento = this.dateFormatter.toBackendFormat(formValues.data_hora_atendimento);
    }
    
    // Processar as datas do plano de ação
    if (formValues.plano_acao?.data_proximo && formValues.plano_acao?.hora_proximo) {
      const dataHoraProximo = `${formValues.plano_acao.data_proximo}T${formValues.plano_acao.hora_proximo}`;
      const dataObjeto = this.dateFormatter.parseToDate(dataHoraProximo);
      
      // Converter para o formato do backend
      formValues.plano_acao.data_hora_proximo = this.dateFormatter.toBackendFormat(dataObjeto);
      
      // Remover os campos separados
      delete formValues.plano_acao.data_proximo;
      delete formValues.plano_acao.hora_proximo;
    }
    
    // Remover campos vazios para evitar problemas na API
    for (const key in formValues) {
      if (formValues[key] === '') {
        delete formValues[key];
      } else if (typeof formValues[key] === 'object' && formValues[key] !== null) {
        for (const subKey in formValues[key]) {
          if (formValues[key][subKey] === '') {
            delete formValues[key][subKey];
          }
        }
      }
    }
    
    return formValues as Acompanhamento;
  }

  /**
   * Cancelar operação atual
   */
  cancelar(): void {
    if (this.pacienteSelecionado) {
      this.router.navigate(['/pacientes/visualizar', this.pacienteSelecionado.id]);
    } else {
      this.voltarParaLista();
    }
  }

  /**
   * Voltar para a lista de pacientes
   */
  voltarParaLista(): void {
    this.router.navigate(['/pacientes']);
  }

  /**
   * Helper que marca todos os campos do form group como touched
   */
  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  /**
   * Helpers para validação de campos
   */
  isFieldValid(field: string): boolean {
    const control = this.acompanhamentoForm.get(field);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  isNestedFieldValid(group: string, field: string): boolean {
    const control = this.acompanhamentoForm.get(group)?.get(field);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  /**
   * Método para verificar se deve mostrar campos condicionais
   */
  deveExibirCampo(condicao: string, valor: string | string[]): boolean {
    const control = this.acompanhamentoForm.get(condicao);
    if (!control) return false;
    
    if (Array.isArray(valor)) {
      return valor.includes(control.value);
    }
    
    return control.value === valor;
  }

  /**
   * Formatar status de acordo com estilo visual
   */
  getStatusClasses(status: string): string {
    return this.statusStyle.getAllClasses(status);
  }
}