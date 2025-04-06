import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

import { Paciente, StatusPaciente } from '../models/paciente.model';
import { Endereco } from '../models/endereco.model';
import { Convenio } from '../models/convenio.model';
import { Plano } from '../models/plano.model';
import { ConvenioPlanoService } from '../services/convenio-plano.service';
import { CepService } from '../../../core/services/cep.service';
import { DateFormatterService } from '../../../core/services/date-formatter.service';
import { DateInputComponent } from '../../../shared/components/date-input/date-input.component';


@Component({
  selector: 'app-paciente-form',
  templateUrl: './paciente-form.component.html',
  styleUrls: ['./paciente-form.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DateInputComponent]
})
export class PacienteFormComponent implements OnInit, OnChanges, OnDestroy {
  @Input() paciente: Paciente | null = null;
  @Input() isEditMode = false;
  @Output() formSubmit = new EventEmitter<Paciente>();
  @Output() formCancel = new EventEmitter<void>();

  form!: FormGroup;
  convenios: Convenio[] = [];
  planos: Plano[] = [];
  statusOptions = Object.values(StatusPaciente);
  generoOptions = ['Masculino', 'Feminino', 'Não-binário', 'Outro', 'Prefiro não informar'];
  estadoCivilOptions = ['Solteiro(a)', 'Casado(a)', 'Divorciado(a)', 'Viúvo(a)', 'União estável', 'Outro'];
  acomodacaoOptions = ['Enfermaria', 'Apartamento', 'Semi-privativo', 'UTI', 'Day Hospital'];
  
  isLoading = false;
  isLoadingCep = false;
  
  private destroy$ = new Subject<void>();
  private _paciente: Paciente | null = null;

  constructor(
    private fb: FormBuilder,
    private convenioPlanoService: ConvenioPlanoService,
    private cepService: CepService,
    private dateFormatter: DateFormatterService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.setupConvenioListener();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['paciente'] && changes['paciente'].currentValue) {
      console.log('Dados recebidos do backend:', this.paciente);
      this.updateFormWithPacienteData();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForm(): void {
    this.form = this.fb.group({
      // Informações pessoais
      nome_completo: ['', [Validators.required]],
      data_nascimento: ['', [Validators.required]],
      cpf: ['', [Validators.required]],
      genero: [''],
      estado_civil: [''],
      profissao: [''],
      nacionalidade: [''],
      
      // Contato
      telefone: ['', [Validators.required]],
      telefone_secundario: [''],
      email: ['', [Validators.email]],
      contato_emergencia: [''],
      telefone_emergencia: [''],
      
      // Informações clínicas
      status: [StatusPaciente.ATIVO, [Validators.required]],
      cid_primario: ['', [Validators.required]],
      cid_secundario: [''],
      acomodacao: ['', [Validators.required]],
      medico_responsavel: [''],
      alergias: [''],
      case_responsavel: [''],
      
      // Convenio e Plano - Notar que plano_id está desabilitado por padrão
      convenio_id: [''],
      plano_id: [{ value: '', disabled: true }],
      numero_carteirinha: [''],
      data_validade: [''],
      
      // Endereço
      endereco: this.fb.group({
        cep: [''],
        logradouro: [''],
        numero: [''],
        complemento: [''],
        bairro: [''],
        cidade: [''],
        estado: [''],
      })
    });
  }

  private patchFormValues(): void {
    if (!this.paciente) return;

    const formattedDataNascimento = this.dateFormatter.toBackendDateOnlyFormat(this.paciente.data_nascimento);
    const formattedDataValidade = this.paciente.data_validade ? 
      this.dateFormatter.toBackendDateOnlyFormat(this.paciente.data_validade) : '';

    this.form.patchValue({
      nome: this.paciente.nome_completo,
      data_nascimento: formattedDataNascimento,
      cpf: this.paciente.cpf,
      genero: this.paciente.genero,
      estado_civil: this.paciente.estado_civil,
      profissao: this.paciente.profissao,
      nacionalidade: this.paciente.nacionalidade,
      
      telefone: this.paciente.telefone,
      telefone_secundario: this.paciente.telefone_secundario,
      email: this.paciente.email,
      contato_emergencia: this.paciente.contato_emergencia,
      telefone_emergencia: this.paciente.telefone_emergencia,
      
      status: this.paciente.status,
      cid_primario: this.paciente.cid_primario,
      cid_secundario: this.paciente.cid_secundario,
      acomodacao: this.paciente.acomodacao,
      medico_responsavel: this.paciente.medico_responsavel,
      alergias: this.paciente.alergias,
      case_responsavel: this.paciente.case_responsavel,
      
      convenio_id: this.paciente.convenio_id,
      plano_id: this.paciente.plano_id,
      numero_carteirinha: this.paciente.numero_carteirinha,
      data_validade: formattedDataValidade,
      
      endereco: this.paciente.endereco
    });

    // Carregar planos quando há convenio selecionado na edição
    if (this.paciente.convenio_id) {
      this.loadPlanos(Number(this.paciente.convenio_id));
    }
  }

  private loadConvenios(): void {
    this.isLoading = true;
    this.convenioPlanoService.listarConvenios()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (convenios) => {
          this.convenios = convenios;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erro ao carregar convênios:', error);
          this.isLoading = false;
        }
      });
  }

  private loadPlanos(convenioId: number): void {
    this.isLoading = true;
    this.planos = [];
    this.form.get('plano_id')?.setValue('');
    
    this.convenioPlanoService.listarPlanosPorConvenio(convenioId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (planos) => {
          this.planos = planos;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erro ao carregar planos:', error);
          this.isLoading = false;
        }
      });
  }

  private setupConvenioListener(): void {
    // Criar listener para o evento de foco no campo convenio_id
    const convenioControl = this.form.get('convenio_id');
    
    if (convenioControl) {
      // Carregar convênios apenas quando o usuário clicar no campo
      convenioControl.valueChanges
        .pipe(
          takeUntil(this.destroy$),
          // Verificar a primeira mudança que não seja vazia (seleção de convênio)
          filter(value => !!value)
        )
        .subscribe(convenioId => {
          // Se um convênio for selecionado, carrega os planos e habilita o campo
          this.loadPlanos(convenioId);
          const planoControl = this.form.get('plano_id');
          if (planoControl) {
            planoControl.enable();
          }
        });
    }
  }

  buscarCep(): void {
    const cep = this.form.get('endereco.cep')?.value;
    if (!cep || cep.length !== 8) return;

    this.isLoadingCep = true;
    this.cepService.consultarCep(cep)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (endereco) => {
          if (endereco) {
            this.form.patchValue({
              endereco: {
                logradouro: endereco.logradouro,
                bairro: endereco.bairro,
                cidade: endereco.localidade,
                estado: endereco.uf
              }
            });
          }
          this.isLoadingCep = false;
        },
        error: () => {
          this.isLoadingCep = false;
        }
      });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    
    const pacienteData = this.prepareFormData();
    this.formSubmit.emit(pacienteData);
  }

  onCancel(): void {
    this.formCancel.emit();
  }

  validarFormulario(): boolean {
    if (this.form.invalid) {
      this.markFormGroupTouched(this.form);
      return false;
    }
    return true;
  }

  prepareFormData(): Paciente {
    const formValue = this.form.value;
    
    // Usar o serviço DateFormatterService para tratar as datas
    const dataNascimento = this.dateFormatter.toBackendDateOnlyFormat(formValue.data_nascimento);
    const dataValidade = this.dateFormatter.toBackendDateOnlyFormat(formValue.data_validade);
    
    return {
      id: this.paciente?.id ?? 0, // Use 0 or '' instead of null as a default value
      nome_completo: formValue.nome_completo,
      cpf: formValue.cpf,
      data_nascimento: dataNascimento,
      genero: formValue.genero,
      estado_civil: formValue.estado_civil,
      profissao: formValue.profissao,
      nacionalidade: formValue.nacionalidade,
      
      telefone: formValue.telefone,
      telefone_secundario: formValue.telefone_secundario,
      email: formValue.email,
      contato_emergencia: formValue.contato_emergencia,
      telefone_emergencia: formValue.telefone_emergencia,
      
      status: formValue.status,
      cid_primario: formValue.cid_primario,
      cid_secundario: formValue.cid_secundario,
      acomodacao: formValue.acomodacao,
      medico_responsavel: formValue.medico_responsavel,
      alergias: formValue.alergias,
      case_responsavel: formValue.case_responsavel,
      
      convenio_id: formValue.convenio_id || null,
      plano_id: formValue.plano_id || null,
      numero_carteirinha: formValue.numero_carteirinha,
      data_validade: dataValidade,
      
      endereco: formValue.endereco,
      
      // Include the missing required properties
      created_at: this.paciente?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  private populateForm(paciente: Paciente): void {
    // Converter endereço de string JSON para objeto se necessário
    let endereco = paciente.endereco;
    if (typeof endereco === 'string') {
      try {
        endereco = JSON.parse(endereco);
        // Mapear 'rua' para 'logradouro' se necessário
        if (endereco && (endereco as any).rua && !endereco.logradouro) {
          endereco.logradouro = (endereco as any).rua;
        }
      } catch (error) {
        console.error('Erro ao parsear endereço:', error);
        endereco = {};
      }
    }
    
    console.log('Endereço parseado:', endereco);

    // Preencher o formulário com dados do paciente
    this.form.patchValue({
      nome_completo: paciente.nome_completo,
      cpf: paciente.cpf,
      data_nascimento: this.dateFormatter.toBackendDateOnlyFormat(paciente.data_nascimento),
      genero: paciente.genero || '',
      estado_civil: paciente.estado_civil || '',
      profissao: paciente.profissao || '',
      nacionalidade: paciente.nacionalidade || '',
      
      telefone: paciente.telefone,
      telefone_secundario: paciente.telefone_secundario || '',
      email: paciente.email || '',
      contato_emergencia: paciente.contato_emergencia || '',
      telefone_emergencia: paciente.telefone_emergencia || '',
      
      status: paciente.status,
      acomodacao: paciente.acomodacao,
      cid_primario: paciente.cid_primario,
      cid_secundario: paciente.cid_secundario || '',
      medico_responsavel: paciente.medico_responsavel || '',
      case_responsavel: paciente.case_responsavel || '',
      alergias: paciente.alergias || '',
      
      convenio_id: paciente.convenio_id || '',
      plano_id: paciente.plano_id || '',
      numero_carteirinha: paciente.numero_carteirinha || '',
      data_validade: this.dateFormatter.toBackendDateOnlyFormat(paciente.data_validade),
      
      endereco: {
        cep: endereco?.cep || '',
        logradouro: endereco?.logradouro || (endereco as any)?.rua || '',
        numero: endereco?.numero || '',
        complemento: endereco?.complemento || '',
        bairro: endereco?.bairro || '',
        cidade: endereco?.cidade || '',
        estado: endereco?.estado || ''
      }
    });
    
    // Se tiver convênio, carregue os planos disponíveis
    if (paciente.convenio_id) {
      this.loadPlanos(Number(paciente.convenio_id));
    }
    
    // Log para depuração
    console.log('Formulário preenchido com os dados do paciente:', this.form.value);
  }

  // Onvenio focus handler
  onConvenioFocus(): void {
    // Verificar se os convênios já foram carregados
    if (this.convenios.length === 0) {
      this.loadConvenios();
    }
  }

  private updateFormWithPacienteData(): void {
    if (!this.paciente || !this.form) return;
    
    console.log('Atualizando formulário com dados:', this.paciente);
    
    // Formatar datas usando o DateFormatterService
    const dataNascimento = this.dateFormatter.toBackendDateOnlyFormat(this.paciente.data_nascimento);
    const dataValidade = this.dateFormatter.toBackendDateOnlyFormat(this.paciente.data_validade);
    
    // Atualizar campos básicos
    this.form.patchValue({
      nome_completo: this.paciente.nome_completo,
      data_nascimento: dataNascimento,
      cpf: this.paciente.cpf,
      genero: this.paciente.genero,
      estado_civil: this.paciente.estado_civil,
      profissao: this.paciente.profissao,
      nacionalidade: this.paciente.nacionalidade,
      
      telefone: this.paciente.telefone,
      telefone_secundario: this.paciente.telefone_secundario,
      email: this.paciente.email,
      contato_emergencia: this.paciente.contato_emergencia,
      telefone_emergencia: this.paciente.telefone_emergencia,
      
      status: this.paciente.status,
      cid_primario: this.paciente.cid_primario,
      cid_secundario: this.paciente.cid_secundario,
      acomodacao: this.paciente.acomodacao,
      medico_responsavel: this.paciente.medico_responsavel,
      alergias: this.paciente.alergias,
      case_responsavel: this.paciente.case_responsavel,
      
      convenio_id: this.paciente.convenio_id,
      numero_carteirinha: this.paciente.numero_carteirinha,
      data_validade: dataValidade,
    });
    
    // Se houver convênio, habilitar o campo de plano e carregar os planos
    if (this.paciente.convenio_id) {
      this.loadPlanos(Number(this.paciente.convenio_id));
      const planoControl = this.form.get('plano_id');
      if (planoControl) {
        planoControl.enable();
        planoControl.setValue(this.paciente.plano_id);
      }
    }
    
    // Atualizar endereco
    if (this.paciente.endereco) {
      const enderecoForm = this.form.get('endereco');
      if (enderecoForm) {
        enderecoForm.patchValue({
          cep: this.paciente.endereco.cep,
          logradouro: this.paciente.endereco.logradouro,
          numero: this.paciente.endereco.numero,
          complemento: this.paciente.endereco.complemento,
          bairro: this.paciente.endereco.bairro,
          cidade: this.paciente.endereco.cidade,
          estado: this.paciente.endereco.estado
        });
      }
    }
  }
}