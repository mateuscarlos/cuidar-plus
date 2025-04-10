import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Paciente, StatusPaciente } from '../models/paciente.model';
import { PacienteService } from '../services/paciente.service';
import { NotificacaoService } from '../../../shared/services/notificacao.service';
import { ESTADOS_CIVIS, GENEROS, ACOMODACOES } from '../../../core/mocks/constantes.mock';
import { CustomValidators } from '../../../shared/validators/custom-validators';
import { finalize } from 'rxjs/operators';
import { CepService } from '../../../core/services/cep.service';
import { ConvenioPlanoService } from '../services/convenio-plano.service';
import { DateFormatterService } from '../../../core/services/date-formatter.service';
import { StatusStyleService } from '../../../core/services/status-style.service';

@Component({
  selector: 'app-cadastrar-paciente',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './cadastrar-paciente.component.html',
  styleUrls: ['./cadastrar-paciente.component.scss']
})
export class CadastrarPacienteComponent implements OnInit {
  pacienteForm!: FormGroup;
  estadosCivis = ESTADOS_CIVIS;
  generos = GENEROS;
  acomodacoes = ACOMODACOES;
  convenios: any[] = [];
  planosFiltrados: any[] = [];
  isLoading = false;
  
  // Usando o enum diretamente do modelo para maior tipagem
  statusPaciente = Object.values(StatusPaciente);
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private pacienteService: PacienteService,
    private notificacaoService: NotificacaoService,
    private cepService: CepService,
    private convenioPlanoService: ConvenioPlanoService, 
    private dateFormatter: DateFormatterService,
    public statusStyle: StatusStyleService
  ) {}

  ngOnInit(): void {
    this.maxDate = this.dateFormatter.toHtmlDateFormat(new Date());
    this.initForm();
    this.carregarConvenios();
  }

  // Define o formulário com base no modelo Paciente
  initForm(): void {
    this.pacienteForm = this.fb.group({
      nome_completo: ['', [Validators.required, Validators.minLength(5)]],
      cpf: ['', [Validators.required, CustomValidators.cpf()]],
      data_nascimento: ['', [Validators.required, this.dateValidator()]],
      genero: [''],
      estado_civil: [''],
      profissao: [''],
      nacionalidade: ['', Validators.required],
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
      convenio_id: ['', Validators.required],
      plano_id: [{value: '', disabled: true}, Validators.required],
      numero_carteirinha: ['', Validators.required],
      data_validade: ['', [Validators.required, this.futureOrTodayDateValidator()]],
      contato_emergencia: [''],
      telefone_emergencia: [''],
      case_responsavel: ['']
    });

    // Vincular alterações do convênio aos planos
    this.pacienteForm.get('convenio_id')?.valueChanges.subscribe(convenioId => {
      const planoIdControl = this.pacienteForm.get('plano_id');
      
      if (convenioId) {
        planoIdControl?.enable();
        this.carregarPlanos(convenioId);
      } else {
        planoIdControl?.disable();
        planoIdControl?.setValue('');
        this.planosFiltrados = [];
      }
    });
  }

  // Data formatters and validators
  readonly dateFormat = 'YYYY-MM-DD';
  maxDate!: string;

  // Validador que impede datas futuras
  dateValidator() {
    return (control: any) => {
      const value = control.value;
      if (!value) {
        return null;
      }
      
      try {
        const date = this.dateFormatter.parseToDate(value);
        if (isNaN(date.getTime())) {
          return { invalidDate: true };
        }
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (date > today) {
          return { futureDate: true };
        }
        
        return null;
      } catch (error) {
        return { invalidDate: true };
      }
    };
  }

  // Validador que permite apenas datas hoje ou futuras
  futureOrTodayDateValidator() {
    return (control: any) => {
      const value = control.value;
      if (!value) {
        return null;
      }
      
      try {
        const date = this.dateFormatter.parseToDate(value);
        if (isNaN(date.getTime())) {
          return { invalidDate: true };
        }
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (date < today) {
          return { pastDate: true };
        }
        
        return null;
      } catch (error) {
        return { invalidDate: true };
      }
    };
  }

  // Carrega convênios
  carregarConvenios(): void {
    this.isLoading = true;
    this.convenioPlanoService.listarConvenios().pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (convenios) => {
        this.convenios = convenios;
        if (this.convenios.length === 0) {
          this.notificacaoService.mostrarAviso('Não há convênios cadastrados no sistema.');
        }
      },
      error: (erro) => {
        console.error('Erro ao carregar convênios:', erro);
        this.notificacaoService.mostrarErro('Erro ao carregar convênios: ' + (erro.message || 'Falha na comunicação com o servidor'));
      }
    });
  }

  // Carrega planos baseado no convênio selecionado
  carregarPlanos(convenioId: number): void {
    if (!convenioId) {
      this.planosFiltrados = [];
      return;
    }
    
    this.isLoading = true;
    
    this.convenioPlanoService.listarPlanosPorConvenio(convenioId).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (planos) => {
        this.planosFiltrados = planos;
        
        if (this.planosFiltrados.length === 0) {
          this.notificacaoService.mostrarAviso('Este convênio não possui planos cadastrados.');
          this.pacienteForm.get('plano_id')?.disable();
          this.pacienteForm.get('plano_id')?.setValue(null);
        }
      },
      error: (erro) => {
        console.error('Erro ao carregar planos:', erro);
        this.notificacaoService.mostrarErro('Erro ao carregar planos: ' + (erro.message || 'Falha na comunicação com o servidor'));
        this.planosFiltrados = [];
      }
    });
  }

  // Evento ao selecionar convênio
  onConvenioChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const convenioId = target?.value ? Number(target.value) : null;
    
    if (convenioId) {
      const convenioSelecionado = this.convenios.find(c => c.id === convenioId);
      if (convenioSelecionado) {
        console.log(`Convênio selecionado: ${convenioSelecionado.nome} (ID: ${convenioSelecionado.id})`);
      }
    }
  }

  // Consulta CEP
  onCepChange(): void {
    const cepControl = this.pacienteForm.get('endereco')?.get('cep');
    const cep = cepControl?.value?.replace(/\D/g, '');

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
    } else if (cep) {
      this.notificacaoService.mostrarAviso('CEP inválido. Certifique-se de que possui 8 dígitos.');
    }
  }

  // Submit do formulário
  onSubmit(): void {
    // Validar o formulário antes de enviar
    if (!this.validarFormulario()) {
      return;
    }

    // Obter valores do formulário
    let formValues = { ...this.pacienteForm.value };

    // Sanitizar o CPF antes de enviar
    if (formValues.cpf) {
      formValues.cpf = formValues.cpf.replace(/\D/g, '');
    }

    // Processar datas para o formato do backend
    formValues = this.processarDatasFormulario(formValues);

    // Converter os campos cidade e estado para os campos esperados pelo backend (localidade e uf)
    if (formValues.endereco) {
      const endereco = { ...formValues.endereco };
      if (endereco.cidade) {
        endereco.localidade = endereco.cidade;
        delete endereco.cidade;
      }
      if (endereco.estado) {
        endereco.uf = endereco.estado;
        delete endereco.estado;
      }
      formValues.endereco = endereco;
    }

    // Enviar dados para o serviço
    this.criarPaciente(formValues);
  }

  /**
   * Processa todas as datas do formulário para o formato esperado pelo backend
   */
  processarDatasFormulario(formValues: any): any {
    // Cria uma cópia para não modificar o objeto original
    const processedValues = { ...formValues };
    
    // Processa data de nascimento
    if (processedValues.data_nascimento) {
      processedValues.data_nascimento = this.dateFormatter.toBackendDateOnlyFormat(processedValues.data_nascimento);
    }
    
    // Processa data de validade do plano
    if (processedValues.data_validade) {
      processedValues.data_validade = this.dateFormatter.toBackendDateOnlyFormat(processedValues.data_validade);
    }
    
    return processedValues;
  }

  /**
   * Realiza a chamada ao serviço para criar um novo paciente
   */
  criarPaciente(formValues: any): void {
    this.isLoading = true;
    
    this.pacienteService.criarPaciente(formValues).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (response) => {
        this.notificacaoService.mostrarSucesso('Paciente cadastrado com sucesso!');
        this.router.navigate(['/pacientes/visualizar', response.id]);
      },
      error: (error) => {
        console.error('Erro ao cadastrar paciente:', error);
        this.notificacaoService.mostrarErro('Erro ao cadastrar paciente: ' + (error.message || 'Por favor, tente novamente.'));
      }
    });
  }

  // Método auxiliar para validar o formulário com mensagens específicas
  validarFormulario(): boolean {
    if (this.pacienteForm.invalid) {
      this.markFormGroupTouched(this.pacienteForm);
      
      // Verificações específicas que precisam de mensagens personalizadas
      if (this.pacienteForm.get('data_nascimento')?.hasError('futureDate')) {
        this.notificacaoService.mostrarAviso('Data de nascimento não pode ser no futuro.');
        return false;
      }
      
      if (this.pacienteForm.get('data_validade')?.hasError('pastDate')) {
        this.notificacaoService.mostrarAviso('Data de validade não pode ser no passado.');
        return false;
      }
      
      this.notificacaoService.mostrarAviso('Por favor, preencha todos os campos obrigatórios corretamente.');
      return false;
    }
    
    return true;
  }

  // Marca todos os campos do formulário como touched para mostrar validações
  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Helpers para mostrar mensagens de erro de validação
  isFieldValid(field: string): boolean {
    const control = this.pacienteForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  isEnderecoFieldValid(field: string): boolean {
    const control = this.pacienteForm.get('endereco')?.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  // Limpa o formulário
  limparFormulario(): void {
    this.pacienteForm.reset();
    
    // Redefinir valores padrão
    this.pacienteForm.get('status')?.setValue(StatusPaciente.ATIVO);
    this.pacienteForm.get('nacionalidade')?.setValue('Brasileiro(a)');
    
    // Desabilitar campos de plano
    this.pacienteForm.get('plano_id')?.disable();
    
    // Limpar listas
    this.planosFiltrados = [];
  }
  
  // Métodos para estilização dos status
  getStatusClasses(status: string): string {
    return this.statusStyle.getAllClasses(status);
  }
}