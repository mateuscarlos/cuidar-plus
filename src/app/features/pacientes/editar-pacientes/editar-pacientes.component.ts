import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
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

@Component({
  selector: 'app-editar-pacientes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BuscaPacienteComponent],
  templateUrl: './editar-pacientes.component.html',
  styleUrl: './editar-pacientes.component.scss'
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
    public statusStyle: StatusStyleService
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
    // Carregar planos do convênio do paciente (se houver)
    if (paciente.convenio_id) {
      this.carregarPlanos(Number(paciente.convenio_id));
    }
    
    // Formatar data de nascimento para o formato aceito pelo input date
    const dataNascimentoFormatada = this.formatarDataParaInput(paciente.data_nascimento);
    
    // Formatar data de validade para o formato aceito pelo input date
    const dataValidadeFormatada = this.formatarDataParaInput(paciente.data_validade);
    
    // Preencher o formulário com os dados do paciente
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
      convenio_id: paciente.convenio_id || '',
      numero_carteirinha: paciente.numero_carteirinha || '',
      data_validade: dataValidadeFormatada,
      contato_emergencia: paciente.contato_emergencia || '',
      telefone_emergencia: paciente.telefone_emergencia || '',
      case_responsavel: paciente.case_responsavel || ''
    });
    
    // Preencher o endereço
    if (paciente.endereco) {
      let enderecoData = paciente.endereco;
      
      // Se o endereço estiver como string (serializado), converter para objeto
      if (typeof paciente.endereco === 'string') {
        try {
          enderecoData = JSON.parse(paciente.endereco);
        } catch (error) {
          console.error('Erro ao processar endereço:', error);
          enderecoData = {};
        }
      }
      
      this.pacienteForm.patchValue({
        endereco: {
          cep: enderecoData.cep || '',
          logradouro: enderecoData.logradouro || '',
          numero: enderecoData.numero || '',
          complemento: enderecoData.complemento || '',
          bairro: enderecoData.bairro || '',
          cidade: enderecoData.cidade || '',
          estado: enderecoData.estado || ''
        }
      });
    }
    
    // Se tiver plano_id, habilitar o campo
    if (paciente.plano_id) {
      this.pacienteForm.get('plano_id')?.enable();
      this.pacienteForm.get('plano_id')?.setValue(paciente.plano_id);
    }
  }

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

    // Processar todos os campos de data para o formato do backend
    formValues = this.processarDatasFormulario(formValues);
    
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
}
