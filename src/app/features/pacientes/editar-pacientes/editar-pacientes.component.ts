import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { Paciente, StatusPaciente } from '../models/paciente.model';
import { PacienteService } from '../services/paciente.service';
import { NotificacaoService } from '../../../shared/services/notificacao.service';
import { CepService } from '../../../core/services/cep.service';
import { ConvenioPlanoService } from '../services/convenio-plano.service';
import { DateFormatterService } from '../../../core/services/date-formatter.service';
import { StatusStyleService } from '../../../core/services/status-style.service';
import { BuscaPacienteComponent } from '../busca-paciente/busca-paciente.component';
import { CustomValidators } from '../../../shared/validators/custom-validators';
import { ESTADOS_CIVIS, GENEROS, ACOMODACOES } from '../../../core/mocks/constantes.mock';
import { finalize } from 'rxjs/operators';
import { Endereco } from '../models/endereco.model';

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
  pacienteForm!: FormGroup;
  pacienteSelecionado: Paciente | null = null;
  estadosCivis = ESTADOS_CIVIS;
  generos = GENEROS;
  acomodacoes = ACOMODACOES;
  convenios: any[] = [];
  planos: any[] = [];
  planosFiltrados: any[] = [];
  isLoading = false;
  modoEdicao = false;
  resultadosBusca: Paciente[] = [];
  
  // Status disponíveis
  statusPaciente = Object.values(StatusPaciente);
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private pacienteService: PacienteService,
    private notificacaoService: NotificacaoService,
    private cepService: CepService,
    private convenioPlanoService: ConvenioPlanoService, 
    private dateFormatter: DateFormatterService,
    public statusStyle: StatusStyleService,
    // Removed Endereco as it is an interface and cannot be injected
  ) {}
  
  ngOnInit(): void {
    this.initForm();
    this.carregarConvenios();
    
    // Verificar se tem ID na rota para carregar o paciente diretamente
    this.route.paramMap.subscribe(params => {
      const pacienteId = params.get('id');
      if (pacienteId) {
        this.carregarPacientePorId(pacienteId);
      }
    });
  }
  
  initForm(): void {
    this.pacienteForm = this.fb.group({
      nome_completo: ['', [Validators.required, Validators.minLength(5)]],
      cpf: ['', [Validators.required, CustomValidators.cpf()]],
      data_nascimento: ['', [Validators.required, this.dateValidator()]],
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
      status: ['', Validators.required],
      cid_primario: ['', Validators.required],
      cid_secundario: [''],
      acomodacao: ['', Validators.required],
      medico_responsavel: [''],
      alergias: [''],
      convenio_id: ['', Validators.required],
      convenio_nome: [''],
      plano_id: [{value: '', disabled: true}, Validators.required],
      plano_nome: [{value: '', disabled: true}],
      numero_carteirinha: ['', Validators.required],
      data_validade: ['', [Validators.required, this.futureOrTodayDateValidator()]],
      contato_emergencia: [''],
      telefone_emergencia: [''],
      case_responsavel: ['']
    });

    // Listener para habilitar/desabilitar campos de plano baseado no convênio
    this.pacienteForm.get('convenio_id')?.valueChanges.subscribe(convenioId => {
      const planoIdControl = this.pacienteForm.get('plano_id');
      const planoNomeControl = this.pacienteForm.get('plano_nome');
      
      if (convenioId) {
        planoIdControl?.enable();
        planoNomeControl?.enable();
        this.carregarPlanos(convenioId);
      } else {
        planoIdControl?.disable();
        planoNomeControl?.disable();
        planoIdControl?.setValue('');
        planoNomeControl?.setValue('');
        this.planosFiltrados = [];
      }
    });
  }

  // Validador personalizado para datas
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
        if (date > today) {
          return { futureDate: true };
        }
        
        return null;
      } catch (error) {
        return { invalidDate: true };
      }
    };
  }

  // Validador para datas que devem ser futuras ou hoje (como data de validade)
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
        today.setHours(0, 0, 0, 0); // Ignora o horário para comparação apenas de data
        
        if (date < today) {
          return { pastDate: true };
        }
        
        return null;
      } catch (error) {
        return { invalidDate: true };
      }
    };
  }

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
        
        // Garantir que o plano esteja habilitado para seleção
        const planoIdControl = this.pacienteForm.get('plano_id');
        if (planoIdControl?.disabled) {
          planoIdControl.enable();
        }
        
        if (this.planosFiltrados.length === 0) {
          this.notificacaoService.mostrarAviso('Este convênio não possui planos cadastrados.');
          // Mesmo sem planos, manter o campo habilitado para permitir seleção quando houver
        } else {
          console.log(`${this.planosFiltrados.length} planos carregados para o convênio ${convenioId}`);
        }
      },
      error: (erro) => {
        console.error('Erro ao carregar planos:', erro);
        this.notificacaoService.mostrarErro('Erro ao carregar planos: ' + (erro.message || 'Falha na comunicação com o servidor'));
        this.planosFiltrados = [];
      }
    });
  }

  /* buscarPaciente(resultado: ResultadoBusca): void {
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
    } */

  onConvenioChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const convenioId = target?.value ? Number(target.value) : null;
    
    // Obter controles
    const planoIdControl = this.pacienteForm.get('plano_id');
    const planoNomeControl = this.pacienteForm.get('plano_nome');
    
    // Limpar o valor do plano atual
    if (planoIdControl) {
      planoIdControl.setValue('');
    }
    
    // Garantir que está habilitado, independente do valor
    if (planoIdControl?.disabled) {
      planoIdControl.enable();
    }
    
    if (planoNomeControl?.disabled) {
      planoNomeControl.enable();
    }
    
    if (!convenioId) {
      // Se não houver convênio selecionado, desabilitar campos de plano
      if (planoIdControl) planoIdControl.disable();
      if (planoNomeControl) planoNomeControl.disable();
      this.planosFiltrados = [];
      return;
    }
    
    // Sempre que trocar o convênio, garantir que o plano esteja habilitado e carregue os planos
    this.carregarPlanos(convenioId);
    
    // Log para depuração
    console.log(`Convênio alterado para ID: ${convenioId}. Plano habilitado: ${!planoIdControl?.disabled}`);
  }

  onCepChange(): void {
  const cepControl = this.pacienteForm.get('endereco')?.get('cep');
  const cep = cepControl?.value;

  if (cep && cep.length === 8) {
    this.isLoading = true;
    this.cepService.consultarCep(cep).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (endereco) => {
        console.log('Dados do CEP recebidos:', endereco);
        
        if (endereco) {
          const enderecoForm = this.pacienteForm.get('endereco');
          
          if (enderecoForm) {
            // Atualizar os campos com os nomes exatos recebidos da API
            enderecoForm.get('logradouro')?.setValue(endereco.logradouro || '');
            enderecoForm.get('bairro')?.setValue(endereco.bairro || '');
            
            // Mapeamento direto para os campos usados no formulário
            enderecoForm.get('cidade')?.setValue(endereco.localidade || '');
            enderecoForm.get('estado')?.setValue(endereco.uf || '');
            
            this.notificacaoService.mostrarSucesso('CEP encontrado e endereço preenchido');
          }
        } else {
          this.notificacaoService.mostrarAviso('CEP não encontrado.');
        }
      },
      error: (erro) => {
        console.error('Erro ao consultar o CEP:', erro);
        this.notificacaoService.mostrarErro('Erro ao consultar o CEP.');
      }
    });
  } else {
    this.notificacaoService.mostrarAviso('CEP inválido. Certifique-se de que possui 8 dígitos.');
  }
}

  onPacienteSelecionado(paciente: Paciente): void {
    this.pacienteSelecionado = paciente;
    this.preencherFormularioComDadosPaciente(paciente);
    this.modoEdicao = true;
  }

  carregarPacientePorId(id: string): void {
    this.isLoading = true;
    this.pacienteService.obterPacientePorId(id).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (paciente) => {
        this.pacienteSelecionado = paciente;
        this.preencherFormularioComDadosPaciente(paciente);
        this.modoEdicao = true;
      },
      error: (erro) => {
        console.error('Erro ao carregar paciente:', erro);
        this.notificacaoService.mostrarErro('Erro ao carregar dados do paciente: ' + (erro.message || 'Paciente não encontrado'));
        this.router.navigate(['/pacientes']);
      }
    });
  }

  preencherFormularioComDadosPaciente(paciente: Paciente): void {
  console.log('Dados do paciente recebidos:', paciente);

  const dataNascimentoFormatada = this.formatarDataParaInput(paciente.data_nascimento);
  const dataValidadeFormatada = this.formatarDataParaInput(paciente.data_validade);

  // Corrigir mapeamento de convenioId e numeroCarteirinha
  const convenioId = paciente.convenioId || paciente.convenio_id || '';
  const numeroCarteirinha = paciente.numeroCarteirinha || paciente.numero_carteirinha || '';
  const planoId = paciente.planoId || paciente.plano_id || '';

  // Corrigir mapeamento do endereço
  let endereco = paciente.endereco || {};
  console.log('Endereço original do paciente:', endereco);
  
  if (typeof endereco === 'string') {
    try {
      endereco = JSON.parse(endereco);
      console.log('Endereço parseado:', endereco);
    } catch (error) {
      console.error('Erro ao parsear o endereço:', error);
      endereco = {};
    }
  }

  // Mapear explicitamente cada campo do endereço
  const enderecoFormatado = {
    cep: (endereco as Endereco).cep || '',
    logradouro: (endereco as Endereco).logradouro || '',
    numero: (endereco as Endereco).numero || '',
    complemento: (endereco as Endereco).complemento || '',
    bairro: (endereco as Endereco).bairro || '',
    cidade: (endereco as Endereco).localidade || '', // Usar diretamente o campo localidade
    estado: (endereco as Endereco).uf || ''          // Usar diretamente o campo uf
  };
  
  console.log('Endereço formatado para o formulário:', enderecoFormatado);

  // Primeiro preencher todos os campos exceto plano_id
    this.pacienteForm.patchValue({
        nome_completo: paciente.nome_completo || paciente.nome,
        cpf: paciente.cpf,
        data_nascimento: dataNascimentoFormatada,
        genero: paciente.genero || '',
        estado_civil: paciente.estado_civil || '',
        profissao: paciente.profissao || '',
        nacionalidade: paciente.nacionalidade || '',
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
        numero_carteirinha: numeroCarteirinha,
        data_validade: dataValidadeFormatada,
        contato_emergencia: paciente.contato_emergencia || '',
        telefone_emergencia: paciente.telefone_emergencia || '',
        case_responsavel: paciente.case_responsavel || '',
        endereco: enderecoFormatado
    });

    // Se tiver convênio, carregar os planos associados e depois preencher plano_id
    if (convenioId) {
        const planoControl = this.pacienteForm.get('plano_id');
        
        // Ativar o campo plano_id para poder receber valor
        if (planoControl) {
            planoControl.enable();
        }
        
        // Carregar os planos e então definir o valor do plano selecionado
        this.convenioPlanoService.listarPlanosPorConvenio(Number(convenioId))
            .subscribe({
                next: (planos) => {
                    this.planosFiltrados = planos;
                    
                    // Depois que os planos estiverem carregados, selecionar o plano do paciente
                    if (planoId && planoControl) {
                        planoControl.setValue(planoId);
                    }
                    
                    if (this.planosFiltrados.length === 0) {
                        this.notificacaoService.mostrarAviso('Este convênio não possui planos cadastrados.');
                        planoControl?.disable();
                    }
                },
                error: (erro) => {
                    console.error('Erro ao carregar planos:', erro);
                    this.notificacaoService.mostrarErro('Erro ao carregar planos: ' + (erro.message || 'Falha na comunicação com o servidor'));
                }
            });
    } else {
        // Se não tiver convênio, desabilitar o campo plano_id
        const planoControl = this.pacienteForm.get('plano_id');
        if (planoControl) {
            planoControl.disable();
            planoControl.setValue('');
        }
    }
  }

  /**
   * Método de submissão atualizado para logging adicional
   */
  onSubmit(): void {
    if (!this.pacienteSelecionado || !this.pacienteSelecionado.id) {
      this.notificacaoService.mostrarErro('É necessário selecionar um paciente para editar.');
      return;
    }
    
    if (this.pacienteForm.invalid) {
      this.markFormGroupTouched(this.pacienteForm);
      this.notificacaoService.mostrarAviso('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Obter valores do formulário
    let formValues = { ...this.pacienteForm.value };
    console.log('Valores do formulário antes de processar datas:', formValues);

    // Processar todos os campos de data para o formato do backend
    formValues = this.processarDatasFormulario(formValues);
    console.log('Valores do formulário após processar datas:', formValues);
    
    // Enviar dados para o serviço
    this.isLoading = true;
    this.pacienteService.atualizarPaciente(String(this.pacienteSelecionado.id), formValues).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (response) => {
        this.notificacaoService.mostrarSucesso('Paciente atualizado com sucesso!');
        this.router.navigate(['/pacientes/visualizar', this.pacienteSelecionado?.id]);
      },
      error: (error) => {
        console.error('Erro ao atualizar paciente:', error);
        this.notificacaoService.mostrarErro('Erro ao atualizar paciente: ' + (error.message || 'Por favor, tente novamente.'));
      }
    });
  }

  /**
   * Processa todas as datas do formulário para o formato esperado pelo backend
   */
  processarDatasFormulario(formValues: any): any {
    // Cria uma cópia para não modificar o objeto original
    const processedValues = { ...formValues };
    
    // Processa data de nascimento - garantindo formato DD/MM/YYYY
    if (processedValues.data_nascimento) {
      processedValues.data_nascimento = this.dateFormatter.toBackendDateOnlyFormat(processedValues.data_nascimento);
      console.log('Data de nascimento processada:', processedValues.data_nascimento);
    }
    
    // Processa data de validade do plano - garantindo formato DD/MM/YYYY
    if (processedValues.data_validade) {
      processedValues.data_validade = this.dateFormatter.toBackendDateOnlyFormat(processedValues.data_validade);
      console.log('Data de validade processada:', processedValues.data_validade);
    }
    
    return processedValues;
  }

  /**
   * Formata uma data para exibição no formato brasileiro
   */
  formatarDataParaExibicao(data: string | Date | null | undefined): string {
    return this.dateFormatter.toDisplayDateOnly(data);
  }
  
  /**
   * Formata uma data para uso em inputs HTML do tipo date
   */
  formatarDataParaInput(data: string | Date | null | undefined): string {
    return this.dateFormatter.toHtmlDateFormat(data);
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
    
    // Redefinir valores padrão
    this.pacienteForm.get('status')?.setValue(StatusPaciente.ATIVO);
    
    // Desabilitar campos de plano
    this.pacienteForm.get('plano_id')?.disable();
    this.pacienteForm.get('plano_nome')?.disable();
    
    // Limpar listas
    this.planosFiltrados = [];
    
    // Reiniciar estado do componente
    this.pacienteSelecionado = null;
    this.modoEdicao = false;
  }
  
  // Método para obter as classes de estilo para cada status
  getStatusClasses(status: string): string {
    return this.statusStyle.getAllClasses(status);
  }
  
  // Método para obter o ícone para cada status
  getStatusIcon(status: string): string {
    return this.statusStyle.getIcon(status);
  }
  
  voltarParaBusca(): void {
    this.pacienteSelecionado = null;
    this.modoEdicao = false;
    this.limparFormulario();
  }

  // Método para quando o usuário clicar no dropdown de convênio
  onConvenioFocus(): void {
    console.log('Convênio recebeu foco');
    
    // Garantir que o plano seja habilitado para seleção quando o usuário decidir mudar o convênio
    const planoIdControl = this.pacienteForm.get('plano_id');
    const planoNomeControl = this.pacienteForm.get('plano_nome');
    
    if (planoIdControl && planoIdControl.disabled) {
      console.log('Habilitando campo de plano');
      planoIdControl.enable();
    }
    
    if (planoNomeControl && planoNomeControl.disabled) {
      planoNomeControl.enable();
    }
    
    // Verificar se o convênio tem valor e carregar os planos caso ainda não estejam carregados
    const convenioId = this.pacienteForm.get('convenio_id')?.value;
    if (convenioId && this.planosFiltrados.length === 0) {
      this.carregarPlanos(convenioId);
    }
  }
}
