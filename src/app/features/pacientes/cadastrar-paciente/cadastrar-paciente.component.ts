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
    private convenioPlanoService: ConvenioPlanoService // Serviço unificado
  ) {}

  ngOnInit(): void {
    console.log('Inicializando componente CadastrarPacienteComponent');
    this.initForm();
    this.carregarConvenios();
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
      status: [StatusPaciente.ATIVO],
      cid_primario: ['', Validators.required],
      cid_secundario: [''],
      acomodacao: ['', Validators.required],
      medico_responsavel: [''],
      alergias: [''],
      convenio_id: ['', Validators.required],
      convenio_nome: [''],  // Campo adicional para autocomplete (se implementado)
      plano_id: [{value: '', disabled: true}, Validators.required], // Começa desabilitado
      plano_nome: [{value: '', disabled: true}], // Campo adicional para autocomplete (se implementado)
      numero_carteirinha: ['', Validators.required],
      data_validade: ['', Validators.required],
      contato_emergencia: [''],
      telefone_emergencia: [''],
      case_responsavel: ['']
    });

    // Adicionar listener para habilitar/desabilitar campos de plano baseado no convênio
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
          
          // Desabilitar campo de plano já que não há opções
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
    
    // A lógica de habilitar/desabilitar e carregar planos já está no listener
    // do valueChanges de convenio_id no método initForm()
    
    // Caso ainda precise de lógica adicional específica para o evento de mudança
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
    // Verificar se o formulário está válido, ignorando campos desabilitados
    const formValido = this.validarFormulario();
    
    if (!formValido) {
      return;
    }
  
    this.isLoading = true;
  
    // Obter os valores do formulário, incluindo campos desabilitados se necessário
    const formValues = this.pacienteForm.getRawValue();
    
    // Formatar data de nascimento se necessário
    if (formValues.data_nascimento) {
      const data = new Date(formValues.data_nascimento);
      if (!isNaN(data.getTime())) {
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const ano = data.getFullYear();
        formValues.data_nascimento = `${dia}/${mes}/${ano}`;
      }
    }
    
    // Formatar data de validade se necessário
    if (formValues.data_validade) {
      const data = new Date(formValues.data_validade);
      if (!isNaN(data.getTime())) {
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const ano = data.getFullYear();
        formValues.data_validade = `${dia}/${mes}/${ano}`;
      }
    }
    
    // Para endereço, garantir compatibilidade com a API
    if (formValues.endereco) {
      formValues.endereco = {
        ...formValues.endereco,
        rua: formValues.endereco.logradouro
      };
    }
  
    // Remover campos auxiliares que não devem ser enviados à API
    delete formValues.convenio_nome;
    delete formValues.plano_nome;
  
    // Enviar os dados para o backend
    this.pacienteService.criarPaciente(formValues)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (paciente) => {
          this.notificacaoService.mostrarSucesso('Paciente cadastrado com sucesso!');
          this.router.navigate(['/pacientes/visualizar'], {
            queryParams: { pacienteId: paciente.id }
          });
        },
        error: (err) => {
          console.error('Erro ao cadastrar paciente:', err);
          this.notificacaoService.mostrarErro('Erro ao cadastrar paciente: ' + (err.error?.message || 'Tente novamente.'));
        }
      });
  }
  
  // Método auxiliar para validar o formulário com mensagens específicas
  validarFormulario(): boolean {
    if (this.pacienteForm.invalid) {
      this.markFormGroupTouched(this.pacienteForm);
      
      // Verificações específicas com mensagens personalizadas
      const campos = [
        { nome: 'nome_completo', mensagem: 'Nome completo é obrigatório' },
        { nome: 'cpf', mensagem: 'CPF é obrigatório e deve ser válido' },
        { nome: 'data_nascimento', mensagem: 'Data de nascimento é obrigatória' },
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