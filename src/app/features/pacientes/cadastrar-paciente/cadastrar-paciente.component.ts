import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Paciente, StatusPaciente, STATUS_BOOTSTRAP_CLASSES } from '../models/paciente.model';
import { Plano } from '../models/plano.model';
import { Endereco } from '../models/endereco.model';
import { Convenio } from '../models/convenio.model';
import { PacienteService } from '../services/paciente.service';
import { NotificacaoService } from '../../../shared/services/notificacao.service';
import { ESTADOS_CIVIS, GENEROS, ACOMODACOES } from '../../../core/mocks/constantes.mock';
import { CustomValidators } from '../../../shared/validators/custom-validators';
import { BehaviorSubject, Observable, catchError, finalize, of, tap } from 'rxjs';
import { CepService } from '../../../core/services/cep.service';
import { ConvenioPlanoService } from '../services/convenio-plano.service';
import { DateFormatterService } from '../../../core/services/date-formatter.service';
import { StatusStyleService } from '../../../core/services/status-style.service';

/**
 * Componente responsável pelo cadastro de novos pacientes
 */
@Component({
  selector: 'app-cadastrar-paciente',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './cadastrar-paciente.component.html',
  styleUrls: ['./cadastrar-paciente.component.scss']
})
export class CadastrarPacienteComponent implements OnInit {
  // Formulário e dados
  pacienteForm!: FormGroup;
  estadosCivis = ESTADOS_CIVIS;
  generos = GENEROS;
  acomodacoes = ACOMODACOES;
  convenios: Convenio[] = [];
  planosFiltrados: Plano[] = [];
  
  // Estados de UI
  isLoading = false;
  isBuscandoCep = false;
  isBuscandoPlanos = false;
  
  // Valores estáticos
  statusPaciente = Object.values(StatusPaciente);
  readonly dateFormat = 'YYYY-MM-DD';
  maxDate!: string;
  
  // Streams de dados
  private convenioSelecionadoSubject = new BehaviorSubject<number | null>(null);
  convenioSelecionado$ = this.convenioSelecionadoSubject.asObservable();
  
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
    this.listarConvenios();
    this.setupSubscriptions();
  }

  /**
   * Inicializa o formulário com todos os campos baseados no modelo Paciente
   */
  initForm(): void {
    this.pacienteForm = this.fb.group({
      nome_completo: ['', [Validators.required, Validators.minLength(5)]],
      cpf: ['', [Validators.required, CustomValidators.cpf()]],
      data_nascimento: ['', [Validators.required, this.dateValidator()]],
      genero: [''],
      estado_civil: [''],
      profissao: [''],
      nacionalidade: ['Brasileiro(a)', Validators.required],
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
  }

  /**
   * Configura as inscrições para os observables
   */
  setupSubscriptions(): void {
    // Observar mudanças no valor de convênio
    this.pacienteForm.get('convenio_id')?.valueChanges.subscribe(convenioId => {
      const planoIdControl = this.pacienteForm.get('plano_id');
      
      if (convenioId) {
        this.convenioSelecionadoSubject.next(convenioId);
        planoIdControl?.enable();
        this.carregarPlanos(convenioId);
      } else {
        this.convenioSelecionadoSubject.next(null);
        planoIdControl?.disable();
        planoIdControl?.setValue('');
        this.planosFiltrados = [];
      }
    });
  }

  /**
   * Validador customizado para data de nascimento
   * @returns Validador que verifica se a data é válida e não está no futuro
   */
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

  /**
   * Validador customizado para data de validade do convênio
   * @returns Validador que verifica se a data é válida, hoje ou no futuro
   */
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

  /**
   * Carrega a lista de convênios disponíveis do backend
   */
  listarConvenios(): void {
    this.isLoading = true;
    
    this.convenioPlanoService.listarConvenios().pipe(
      tap(convenios => {
        this.convenios = convenios;
        
        if (this.convenios.length === 0) {
          this.notificacaoService.mostrarAviso('Não há convênios cadastrados no sistema.');
        }
      }),
      catchError(erro => {
        console.error('Erro ao carregar convênios:', erro);
        this.notificacaoService.mostrarErro('Erro ao carregar convênios: ' + 
          (erro.message || 'Falha na comunicação com o servidor'));
        return of([]);
      }),
      finalize(() => this.isLoading = false)
    ).subscribe();
  }

  /**
   * Carrega os planos associados a um convênio específico
   * @param convenioId ID do convênio selecionado
   */
  carregarPlanos(convenioId: number): void {
    if (!convenioId) {
      this.planosFiltrados = [];
      return;
    }
    
    this.isBuscandoPlanos = true;
    
    this.convenioPlanoService.listarPlanosPorConvenio(convenioId).pipe(
      tap(planos => {
        this.planosFiltrados = planos;
        
        if (this.planosFiltrados.length === 0) {
          this.notificacaoService.mostrarAviso('Este convênio não possui planos cadastrados.');
          this.pacienteForm.get('plano_id')?.disable();
          this.pacienteForm.get('plano_id')?.setValue(null);
        }
      }),
      catchError(erro => {
        console.error('Erro ao carregar planos:', erro);
        this.notificacaoService.mostrarErro('Erro ao carregar planos: ' + 
          (erro.message || 'Falha na comunicação com o servidor'));
        this.planosFiltrados = [];
        return of([]);
      }),
      finalize(() => this.isBuscandoPlanos = false)
    ).subscribe();
  }

  /**
   * Handler para o evento de mudança de convênio
   */
  onConvenioChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const convenioId = target?.value ? Number(target.value) : null;
    
    if (convenioId) {
      const convenioSelecionado = this.convenios.find(c => c.id === convenioId);
      if (convenioSelecionado) {
        console.debug(`Convênio selecionado: ${convenioSelecionado.nome} (ID: ${convenioSelecionado.id})`);
      }
    }
  }

  /**
   * Consulta o CEP informado e preenche os campos de endereço
   */
  onCepChange(): void {
    const cepControl = this.pacienteForm.get('endereco')?.get('cep');
    const cep = cepControl?.value?.replace(/\D/g, '');

    if (cep && cep.length === 8) {
      this.isBuscandoCep = true;
      
      this.cepService.consultarCep(cep).pipe(
        tap(endereco => {
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
        }),
        catchError(() => {
          this.notificacaoService.mostrarErro('Erro ao consultar o CEP.');
          return of(null);
        }),
        finalize(() => this.isBuscandoCep = false)
      ).subscribe();
    } else if (cep) {
      this.notificacaoService.mostrarAviso('CEP inválido. Certifique-se de que possui 8 dígitos.');
    }
  }

  /**
   * Submete o formulário para criar um novo paciente
   */
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

    // Processar datas para o formato esperado pelo backend
    formValues = this.processarDatasFormulario(formValues);

    // Converter os campos cidade e estado para os campos esperados pelo backend
    if (formValues.endereco) {
      const endereco = { ...formValues.endereco } as Endereco;
      if (endereco.cidade) {
        endereco.localidade = endereco.cidade;
        delete (endereco as any).cidade;
      }
      if (endereco.estado) {
        endereco.uf = endereco.estado;
        delete (endereco as any).estado;
      }
      formValues.endereco = endereco;
    }

    // Enviar dados para o serviço
    this.criarPaciente(formValues);
  }

  /**
   * Processa as datas do formulário para o formato do backend
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
   * Envia os dados do paciente para criação no backend
   */
  criarPaciente(formValues: any): void {
    this.isLoading = true;
    
    // Add detailed logs
    console.log('======= INÍCIO DA REQUISIÇÃO =======');
    console.log('Payload sendo enviado para criação de paciente:', formValues);
    
    this.pacienteService.criarPaciente(formValues).pipe(
      tap(response => {
        console.log('Resposta de sucesso:', response);
        this.notificacaoService.mostrarSucesso('Paciente cadastrado com sucesso!');
        this.router.navigate(['/pacientes/visualizar', response.id]);
      }),
      catchError(error => {
        console.error('Erro completo ao cadastrar paciente:', error);
        console.log('Status do erro:', error.status);
        console.log('Detalhes do erro:', error.error);
        console.log('URL da requisição:', error.url);
        console.log('Método utilizado:', error.method || 'Não disponível');
        
        // Verificar mensagens de erro específicas do backend
        let mensagemErro = 'Erro ao cadastrar paciente. Por favor, tente novamente.';
        
        if (error.error?.message) {
          mensagemErro = error.error.message;
        } else if (error.error?.error) {
          mensagemErro = error.error.error;
        }
        
        this.notificacaoService.mostrarErro(mensagemErro);
        return of(null);
      }),
      finalize(() => {
        console.log('======= FIM DA REQUISIÇÃO =======');
        this.isLoading = false;
      })
    ).subscribe();
  }

  /**
   * Valida o formulário com mensagens específicas para cada tipo de erro
   */
  validarFormulario(): boolean {
    if (this.pacienteForm.invalid) {
      this.markFormGroupTouched(this.pacienteForm);
      
      // Verificações específicas com mensagens personalizadas
      if (this.pacienteForm.get('data_nascimento')?.hasError('futureDate')) {
        this.notificacaoService.mostrarAviso('Data de nascimento não pode ser no futuro.');
        return false;
      }
      
      if (this.pacienteForm.get('data_validade')?.hasError('pastDate')) {
        this.notificacaoService.mostrarAviso('Data de validade não pode ser no passado.');
        return false;
      }

      if (this.pacienteForm.get('cpf')?.hasError('cpfInvalido')) {
        this.notificacaoService.mostrarAviso('O CPF informado não é válido.');
        return false;
      }
      
      this.notificacaoService.mostrarAviso('Por favor, preencha todos os campos obrigatórios corretamente.');
      return false;
    }
    
    return true;
  }

  /**
   * Marca todos os campos do formulário como touched para exibir validações
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
   * Verifica se um campo do formulário é inválido
   */
  isFieldValid(field: string): boolean {
    const control = this.pacienteForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  /**
   * Verifica se um campo de endereço é inválido
   */
  isEnderecoFieldValid(field: string): boolean {
    const control = this.pacienteForm.get('endereco')?.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  /**
   * Limpa o formulário e restaura valores padrão
   */
  limparFormulario(): void {
    this.pacienteForm.reset({
      status: StatusPaciente.ATIVO,
      nacionalidade: 'Brasileiro(a)'
    });
    
    // Desabilitar campo de plano
    this.pacienteForm.get('plano_id')?.disable();
    
    // Limpar listas
    this.planosFiltrados = [];
  }
  
  /**
   * Recupera classes CSS para estilização do status
   */
  getStatusClasses(status: string): string {
    return this.statusStyle.getAllClasses(status);
  }
}