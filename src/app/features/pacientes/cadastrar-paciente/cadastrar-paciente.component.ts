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
import { ConvenioPlanoService } from '../services/convenio-plano.service';
import { DateFormatterService } from '../../../core/services/date-formatter.service';

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
    private cepService: CepService,
    private convenioPlanoService: ConvenioPlanoService, 
    private dateFormatter: DateFormatterService
  ) {}

  // Formatos para os controles de data
  readonly dateFormat = 'YYYY-MM-DD';
  maxDate!: string;

  ngOnInit(): void {
    console.log('Inicializando componente CadastrarPacienteComponent');
    this.maxDate = this.dateFormatter.toHtmlDateFormat(new Date());
    this.initForm();
    this.carregarConvenios();
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
      status: [StatusPaciente.ATIVO],
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
    console.log('Carregando convênios...');
    this.isLoading = true;
    this.convenioPlanoService.listarConvenios().pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (convenios) => {
        console.log(`Convênios recebidos (${convenios.length}):`, convenios);
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
    console.log(`Carregando planos para o convênio ID: ${convenioId}`);
    
    this.convenioPlanoService.listarPlanosPorConvenio(convenioId).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (planos) => {
        console.log(`Planos recebidos (${planos.length}):`, planos);
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
      this.pacienteForm.markAllAsTouched();
      this.notificacaoService.mostrarAviso('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Obter valores do formulário
    let formValues = { ...this.pacienteForm.value };

    // Processar todos os campos de data para o formato do backend
    formValues = this.processarDatasFormulario(formValues);
    
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
      try {
        // Verifica se já está no formato yyyy-mm-dd
        if (!/^\d{4}-\d{2}-\d{2}$/.test(processedValues.data_nascimento)) {
          const dateParts = processedValues.data_nascimento.split('/');
          if (dateParts.length === 3) {
            // Converte de DD/MM/YYYY para YYYY-MM-DD
            const day = dateParts[0].padStart(2, '0');
            const month = dateParts[1].padStart(2, '0');
            const year = dateParts[2];
            processedValues.data_nascimento = `${year}-${month}-${day}`;
          } else {
            console.error('Formato de data não reconhecido:', processedValues.data_nascimento);
          }
        }
      } catch (error) {
        console.error('Erro ao processar data de nascimento:', error);
      }
    }
    
    // Processa data de validade do plano
    if (processedValues.data_validade) {
      try {
        // Verifica se já está no formato yyyy-mm-dd
        if (!/^\d{4}-\d{2}-\d{2}$/.test(processedValues.data_validade)) {
          const dateParts = processedValues.data_validade.split('/');
          if (dateParts.length === 3) {
            // Converte de DD/MM/YYYY para YYYY-MM-DD
            const day = dateParts[0].padStart(2, '0');
            const month = dateParts[1].padStart(2, '0');
            const year = dateParts[2];
            processedValues.data_validade = `${year}-${month}-${day}`;
          } else {
            console.error('Formato de data não reconhecido:', processedValues.data_validade);
          }
        }
      } catch (error) {
        console.error('Erro ao processar data de validade:', error);
      }
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
  
  // Método auxiliar para validar o formulário com mensagens específicas
  validarFormulario(): boolean {
    if (this.pacienteForm.invalid) {
      this.markFormGroupTouched(this.pacienteForm);
      
      // Verificações específicas com mensagens personalizadas
      const campos = [
        { nome: 'nome_completo', mensagem: 'Nome completo é obrigatório' },
        { nome: 'cpf', mensagem: 'CPF é obrigatório e deve ser válido' },
        { nome: 'data_nascimento', mensagem: 'Data de nascimento é obrigatória e deve ser válida' },
        { nome: 'telefone', mensagem: 'Telefone é obrigatório' },
        { nome: 'cid_primario', mensagem: 'CID primário é obrigatório' },
        { nome: 'acomodacao', mensagem: 'Acomodação é obrigatória' }
      ];
      
      for (const campo of campos) {
        const control = this.pacienteForm.get(campo.nome);
        if (control?.invalid && control.touched) {
          this.notificacaoService.mostrarAviso(campo.mensagem);
          return false;
        }
      }
      
      // Verificação específica para campos de data
      const nascimentoControl = this.pacienteForm.get('data_nascimento');
      if (nascimentoControl?.hasError('futureDate')) {
        this.notificacaoService.mostrarAviso('Data de nascimento não pode ser no futuro');
        return false;
      }
      
      const validadeControl = this.pacienteForm.get('data_validade');
      if (validadeControl?.hasError('pastDate')) {
        this.notificacaoService.mostrarAviso('Data de validade não pode ser no passado');
        return false;
      }
      
      // Verificar campos de endereço
      const enderecoCampos = [
        { nome: 'cep', mensagem: 'CEP é obrigatório' },
        { nome: 'logradouro', mensagem: 'Logradouro é obrigatório' },
        { nome: 'numero', mensagem: 'Número é obrigatório' },
        { nome: 'bairro', mensagem: 'Bairro é obrigatório' },
        { nome: 'cidade', mensagem: 'Cidade é obrigatória' },
        { nome: 'estado', mensagem: 'Estado é obrigatório' }
      ];
      
      for (const campo of enderecoCampos) {
        const control = this.pacienteForm.get('endereco')?.get(campo.nome);
        if (control?.invalid && control.touched) {
          this.notificacaoService.mostrarAviso(campo.mensagem);
          return false;
        }
      }
      
      // Verificação específica para convênio
      const convenioId = this.pacienteForm.get('convenio_id')?.value;
      if (!convenioId) {
        this.notificacaoService.mostrarAviso('Por favor, selecione um convênio.');
        return false;
      }
      
      // Verificação para plano apenas se o campo estiver habilitado
      const planoControl = this.pacienteForm.get('plano_id');
      if (planoControl?.enabled && !planoControl.value) {
        this.notificacaoService.mostrarAviso('Por favor, selecione um plano.');
        return false;
      }
      
      // Verificar carteirinha e validade
      if (!this.pacienteForm.get('numero_carteirinha')?.value) {
        this.notificacaoService.mostrarAviso('Por favor, informe o número da carteirinha.');
        return false;
      }
      
      if (!this.pacienteForm.get('data_validade')?.value) {
        this.notificacaoService.mostrarAviso('Por favor, informe a data de validade.');
        return false;
      }
      
      this.notificacaoService.mostrarAviso('Por favor, preencha todos os campos obrigatórios corretamente.');
      return false;
    }
    
    return true;
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
  }
}