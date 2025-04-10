import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { Paciente, StatusPaciente } from '../models/paciente.model';
import { Plano } from '../models/plano.model';
import { Convenio } from '../models/convenio.model';
import { Endereco } from '../models/endereco.model';
import { ResultadoBusca } from '../models/busca-paciente.model';
import { PacienteService } from '../services/paciente.service';
import { NotificacaoService } from '../../../shared/services/notificacao.service';
import { CepService } from '../../../core/services/cep.service';
import { ConvenioPlanoService } from '../services/convenio-plano.service';
import { DateFormatterService } from '../../../core/services/date-formatter.service';
import { StatusStyleService } from '../../../core/services/status-style.service';
import { BuscaPacienteComponent } from '../busca-paciente/busca-paciente.component';
import { CustomValidators } from '../../../shared/validators/custom-validators';
import { ESTADOS_CIVIS, GENEROS, ACOMODACOES } from '../../../core/mocks/constantes.mock';
import { BehaviorSubject, catchError, finalize, of, tap } from 'rxjs';

/**
 * Componente responsável pela edição de pacientes existentes
 */
@Component({
  selector: 'app-editar-pacientes',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    BuscaPacienteComponent,
    RouterModule
  ],
  templateUrl: './editar-pacientes.component.html',
  styleUrls: ['./editar-pacientes.component.scss']
})
export class EditarPacientesComponent implements OnInit {
  // Formulário e dados
  pacienteForm!: FormGroup;
  pacienteSelecionado: Paciente | null = null;
  estadosCivis = ESTADOS_CIVIS;
  generos = GENEROS;
  acomodacoes = ACOMODACOES;
  convenios: Convenio[] = [];
  planosFiltrados: Plano[] = [];
  
  // Estados de UI
  isLoading = false;
  isBuscandoCep = false;
  isBuscandoPlanos = false;
  modoEdicao = false;
  
  // Valores estáticos
  statusPaciente = Object.values(StatusPaciente);
  maxDate!: string;
  
  // Streams de dados
  private convenioSelecionadoSubject = new BehaviorSubject<number | null>(null);
  convenioSelecionado$ = this.convenioSelecionadoSubject.asObservable();
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private pacienteService: PacienteService,
    private notificacaoService: NotificacaoService,
    private cepService: CepService,
    private convenioPlanoService: ConvenioPlanoService, 
    private dateFormatter: DateFormatterService,
    public statusStyle: StatusStyleService
  ) {
    this.maxDate = this.dateFormatter.toHtmlDateFormat(new Date());
  }
  
  ngOnInit(): void {
    this.initForm();
    this.carregarConvenios();
    this.setupSubscriptions();
    
    // Verificar se tem ID na rota para carregar o paciente diretamente
    this.route.params.subscribe(params => {
      const pacienteId = params['id'];
      if (pacienteId) {
        this.carregarPacientePorId(pacienteId);
      }
    });

    // Verificar query params (em caso de redirecionamento com parâmetros)
    this.route.queryParams.subscribe(params => {
      const pacienteId = params['pacienteId'];
      if (pacienteId && !this.pacienteSelecionado) {
        this.carregarPacientePorId(pacienteId);
      }
    });
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
      nacionalidade: ['Brasileiro(a)'],
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
      status: [StatusPaciente.ATIVO, Validators.required],
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
        
        // Verificar se a data não está no futuro
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
        
        // Verificar se a data não é passada (anterior a hoje)
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
  carregarConvenios(): void {
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
   * Handler para o evento de foco no campo convênio
   */
  onConvenioFocus(): void {
    // Garantir carregamento de planos se já tiver convênio selecionado
    const convenioId = this.pacienteForm.get('convenio_id')?.value;
    if (convenioId && this.planosFiltrados.length === 0) {
      this.carregarPlanos(convenioId);
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
   * Manipula o evento de paciente selecionado da busca
   */
  onPacienteSelecionado(paciente: Paciente): void {
    this.pacienteSelecionado = paciente;
    this.preencherFormularioComDadosPaciente(paciente);
    this.modoEdicao = true;
  }

  /**
   * Carrega dados de um paciente pelo ID
   */
  carregarPacientePorId(id: string): void {
    this.isLoading = true;
    
    this.pacienteService.obterPacientePorId(id).pipe(
      tap(paciente => {
        if (paciente) {
          this.pacienteSelecionado = paciente;
          this.preencherFormularioComDadosPaciente(paciente);
          this.modoEdicao = true;
        } else {
          this.notificacaoService.mostrarErro('Paciente não encontrado.');
          this.router.navigate(['/pacientes']);
        }
      }),
      catchError(erro => {
        this.notificacaoService.mostrarErro('Erro ao carregar paciente: ' + 
          (erro.message || 'Paciente não encontrado.'));
        this.router.navigate(['/pacientes']);
        return of(null);
      }),
      finalize(() => this.isLoading = false)
    ).subscribe();
  }

  /**
   * Preenche o formulário com os dados do paciente selecionado
   */
  preencherFormularioComDadosPaciente(paciente: Paciente): void {
    // Formatar datas para o formato aceito pelo input HTML
    const dataNascimentoFormatada = this.dateFormatter.toHtmlDateFormat(paciente.data_nascimento);
    const dataValidadeFormatada = this.dateFormatter.toHtmlDateFormat(paciente.data_validade);

    // Normalizar IDs para garantir compatibilidade
    const convenioId = this.normalizarValor(paciente.convenio_id);
    const planoId = this.normalizarValor(paciente.plano_id);
    
    // Processar endereço com segurança
    let endereco = this.processarEndereco(paciente.endereco);

    // Preencher todos os campos do formulário
    this.pacienteForm.patchValue({
      nome_completo: paciente.nome_completo,
      cpf: paciente.cpf,
      data_nascimento: dataNascimentoFormatada,
      genero: paciente.genero || '',
      estado_civil: paciente.estado_civil || '',
      profissao: paciente.profissao || '',
      nacionalidade: paciente.nacionalidade || 'Brasileiro(a)',
      telefone: paciente.telefone || '',
      telefone_secundario: paciente.telefone_secundario || '',
      email: paciente.email || '',
      status: paciente.status || StatusPaciente.ATIVO,
      cid_primario: paciente.cid_primario || '',
      cid_secundario: paciente.cid_secundario || '',
      acomodacao: paciente.acomodacao || '',
      medico_responsavel: paciente.medico_responsavel || '',
      alergias: paciente.alergias || '',
      convenio_id: convenioId,
      numero_carteirinha: paciente.numero_carteirinha || '',
      data_validade: dataValidadeFormatada,
      contato_emergencia: paciente.contato_emergencia || '',
      telefone_emergencia: paciente.telefone_emergencia || '',
      case_responsavel: paciente.case_responsavel || '',
      endereco: endereco
    });

    // Se tiver convênio, carregar os planos e depois definir o valor do plano
    if (convenioId) {
      const planoControl = this.pacienteForm.get('plano_id');
      if (planoControl) planoControl.enable();
      
      // Carregar planos do convênio selecionado
      this.carregarPlanos(convenioId);
      
      // Definir o plano após o carregamento dos planos
      if (planoId && planoControl) {
        // Verificamos após o carregamento se o plano existe na lista
        setTimeout(() => {
          if (this.planosFiltrados.some(p => p.id === planoId)) {
            planoControl.setValue(planoId);
          }
        }, 500);
      }
    }
  }

  /**
   * Processa o endereço do paciente de forma segura
   */
  private processarEndereco(enderecoOriginal: any): Endereco {
    let endereco = enderecoOriginal || {};
    
    // Se o endereço for uma string JSON, tentar parsear
    if (typeof endereco === 'string') {
      try {
        endereco = JSON.parse(endereco);
      } catch (error) {
        console.error('Erro ao parsear endereço:', error);
        endereco = {};
      }
    }

    // Mapear para o formato correto do formulário
    return {
      cep: this.getEnderecoField(endereco, 'cep'),
      logradouro: this.getEnderecoField(endereco, 'logradouro'),
      numero: this.getEnderecoField(endereco, 'numero'),
      complemento: this.getEnderecoField(endereco, 'complemento'),
      bairro: this.getEnderecoField(endereco, 'bairro'),
      cidade: this.getEnderecoField(endereco, 'localidade', 'cidade'),
      estado: this.getEnderecoField(endereco, 'uf', 'estado'),
      localidade: '', // Campos adicionais para compatibilidade com o modelo
      uf: ''
    };
  }

  /**
   * Helper para obter um campo do endereço com fallbacks
   */
  private getEnderecoField(endereco: any, campo: string, alternativa?: string): string {
    if (endereco[campo]) return endereco[campo];
    if (alternativa && endereco[alternativa]) return endereco[alternativa];
    return '';
  }

  /**
   * Normaliza valores para formulário
   */
  private normalizarValor(valor: any): any {
    if (valor === null || valor === undefined) return '';
    if (typeof valor === 'string' && valor.trim() === '') return '';
    
    // Se for string numérica, converter para número
    if (typeof valor === 'string' && !isNaN(Number(valor))) {
      return Number(valor);
    }
    
    return valor;
  }

  /**
   * Submete o formulário para atualizar dados do paciente
   */
  onSubmit(): void {
    if (!this.pacienteSelecionado || !this.pacienteSelecionado.id) {
      this.notificacaoService.mostrarErro('É necessário selecionar um paciente para editar.');
      return;
    }
    
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

    // Formatar datas para o padrão do backend
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
    this.isLoading = true;
    
    this.pacienteService.atualizarPaciente(String(this.pacienteSelecionado.id), formValues).pipe(
      tap(response => {
        this.notificacaoService.mostrarSucesso('Paciente atualizado com sucesso!');
        this.router.navigate(['/pacientes/visualizar', this.pacienteSelecionado?.id]);
      }),
      catchError(error => {
        console.error('Erro ao atualizar paciente:', error);
        
        let mensagemErro = 'Erro ao atualizar paciente.';
        if (error.error?.message) {
          mensagemErro = error.error.message;
        } else if (error.error?.error) {
          mensagemErro = error.error.error;
        }
        
        this.notificacaoService.mostrarErro(mensagemErro);
        return of(null);
      }),
      finalize(() => this.isLoading = false)
    ).subscribe();
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
    // Deixamos os valores do paciente selecionado e reconfiguramos o formulário
    if (this.pacienteSelecionado) {
      this.preencherFormularioComDadosPaciente(this.pacienteSelecionado);
      this.notificacaoService.mostrarInfo('Formulário restaurado aos valores originais.');
    } else {
      this.pacienteForm.reset({
        status: StatusPaciente.ATIVO,
        nacionalidade: 'Brasileiro(a)'
      });
    }
  }
  
  /**
   * Recupera classes CSS para estilização do status
   */
  getStatusClasses(status: string): string {
    return this.statusStyle.getAllClasses(status);
  }
  
  /**
   * Volta para o modo de busca de paciente
   */
  voltarParaBusca(): void {
    this.pacienteSelecionado = null;
    this.modoEdicao = false;
    this.initForm(); // Reiniciar o formulário com valores padrão
  }
}