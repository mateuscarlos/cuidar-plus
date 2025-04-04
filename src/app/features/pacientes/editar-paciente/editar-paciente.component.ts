import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BuscaPacienteComponent } from '../busca-paciente/busca-paciente.component';
import { Paciente, StatusPaciente } from '../models/paciente.model';
import { ResultadoBusca } from '../models/busca-paciente.model';
import { PacienteService } from '../services/paciente.service';
import { finalize, Observable, of, startWith, map } from 'rxjs';
import { ESTADOS_CIVIS, GENEROS, ACOMODACOES } from '../../../core/mocks/constantes.mock';
import { CustomValidators } from '../../../shared/validators/custom-validators';
import { NotificacaoService } from '../../../shared/services/notificacao.service';
import { CepService } from '../../../core/services/cep.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ConvenioService } from '../services/convenio.service';
import { PlanoService } from '../services/plano.service';
import { Convenio } from '../models/convenio.model';
import { Plano } from '../models/plano.model';

@Component({
  selector: 'app-editar-paciente',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    BuscaPacienteComponent,
    MatAutocompleteModule
  ],
  templateUrl: './editar-paciente.component.html',
  styleUrls: ['./editar-paciente.component.scss']
})
export class EditarPacienteComponent implements OnInit {
  pacienteForm!: FormGroup;
  estadosCivis = ESTADOS_CIVIS;
  generos = GENEROS;
  acomodacoes = ACOMODACOES;
  
  resultadosBusca: Paciente[] = [];
  pacienteSelecionado: Paciente | null = null;
  modoEdicao = false;
  isLoading = false;
  error: string | null = null;

  // Listas para os dropdowns
  convenios: Convenio[] = [];
  planos: Plano[] = [];
  planosFiltrados: Plano[] = [];
  
  // Observables para o autocomplete
  conveniosFiltrados$!: Observable<Convenio[]>;
  planosFiltrados$!: Observable<Plano[]>;
  
  // Propriedades para armazenar os objetos selecionados
  convenioSelecionado: Convenio | null = null;
  planoSelecionado: Plano | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private pacienteService: PacienteService,
    private notificacaoService: NotificacaoService,
    private cepService: CepService,
    private convenioService: ConvenioService,
    private planoService: PlanoService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.carregarConvenios();
    
    this.route.queryParams.subscribe(params => {
      if (params['pacienteId']) {
        this.carregarPaciente(params['pacienteId']);
      }
    });
    
    // Configurar os listeners para autocomplete
    this.setupAutoCompleteListeners();
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
      status: ['ativo'],
      cid_primario: ['', Validators.required],
      cid_secundario: [''],
      acomodacao: ['', Validators.required],
      medico_responsavel: [''],
      alergias: [''],
      convenio_id: [''],
      convenio_nome: [''],  // Campo para exibição do autocomplete
      plano_id: [''],
      plano_nome: [''],     // Campo para exibição do autocomplete
      numero_carteirinha: [''],
      data_validade: [''],
      contato_emergencia: [''],
      telefone_emergencia: [''],
      case_responsavel: ['']
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
            this.preencherFormulario(paciente);
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
    this.preencherFormulario(paciente);
  }
  
  preencherFormulario(paciente: Paciente): void {
    // Parse endereco if it's a string
    let endereco = paciente.endereco;
    if (typeof endereco === 'string') {
      try {
        endereco = JSON.parse(endereco);
      } catch (error) {
        console.error('Erro ao converter endereço:', error);
      }
    }

    this.pacienteForm.patchValue({
      nome_completo: paciente.nome_completo,
      cpf: paciente.cpf,
      data_nascimento: paciente.data_nascimento,
      genero: paciente.genero,
      estado_civil: paciente.estado_civil,
      profissao: paciente.profissao,
      nacionalidade: paciente.nacionalidade,
      telefone: paciente.telefone,
      telefone_secundario: paciente.telefone_secundario,
      email: paciente.email,
      endereco: {
        cep: endereco.cep,
        // Use rua OR logradouro, whichever is available
        logradouro: endereco.rua || endereco.logradouro || '',
        numero: endereco.numero,
        complemento: endereco.complemento,
        bairro: endereco.bairro,
        cidade: endereco.cidade,
        estado: endereco.estado
      },
      status: paciente.status,
      cid_primario: paciente.cid_primario,
      cid_secundario: paciente.cid_secundario,
      acomodacao: paciente.acomodacao,
      medico_responsavel: paciente.medico_responsavel,
      alergias: paciente.alergias,
      convenio_id: paciente.convenio_id,
      plano_id: paciente.plano_id,
      numero_carteirinha: paciente.numero_carteirinha,
      data_validade: paciente.data_validade,
      contato_emergencia: paciente.contato_emergencia,
      telefone_emergencia: paciente.telefone_emergencia,
      case_responsavel: paciente.case_responsavel
    });

    // Buscar informações do convênio e plano para exibir os nomes
    if (paciente.convenio_id) {
      this.convenioService.obterConvenio(paciente.convenio_id).subscribe({
        next: (convenio) => {
          if (convenio) {
            this.convenioSelecionado = convenio;
            this.pacienteForm.patchValue({
              convenio_nome: convenio.nome
            });
            
            // Carregar planos do convênio
            this.carregarPlanosPorConvenio(convenio.id);
            
            // Buscar informações do plano
            if (paciente.plano_id && paciente.convenio_id) {
              this.planoService.listarPorConvenio(paciente.convenio_id).subscribe({
                next: (planos) => {
                  if (planos && planos.length > 0) {
                    // Find the specific plan by ID
                    const planoEncontrado = planos.find(p => p.id === paciente.plano_id);
                    if (planoEncontrado) {
                      this.planoSelecionado = planoEncontrado;
                      this.pacienteForm.patchValue({
                        plano_nome: planoEncontrado.nome
                      });
                    }
                  }
                }
              });
            }
          }
        }
      });
    }
  }

  salvarAlteracoes(): void {
    if (this.pacienteForm.invalid) {
      this.markFormGroupTouched(this.pacienteForm);
      this.notificacaoService.mostrarAviso('Por favor, preencha todos os campos obrigatórios corretamente.');
      return;
    }

    this.isLoading = true;

    const pacienteId = this.pacienteSelecionado?.id; // ID do paciente selecionado
    const dadosAtualizados = { ...this.pacienteForm.value }; // Cria uma cópia dos dados do formulário
    
    // Fix endereco field mapping
    if (dadosAtualizados.endereco) {
      // Map logradouro to rua for API compatibility
      dadosAtualizados.endereco = {
        ...dadosAtualizados.endereco,
        rua: dadosAtualizados.endereco.logradouro
      };
    }
    
    // Converter formato de data de nascimento de yyyy-mm-dd para dd/mm/yyyy
    if (dadosAtualizados.data_nascimento) {
      const data = new Date(dadosAtualizados.data_nascimento);
      if (!isNaN(data.getTime())) {
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0'); // Janeiro é 0
        const ano = data.getFullYear();
        dadosAtualizados.data_nascimento = `${dia}/${mes}/${ano}`;
      }
    }
    
    // Converter formato da data de validade, se existir
    if (dadosAtualizados.data_validade) {
      const data = new Date(dadosAtualizados.data_validade);
      if (!isNaN(data.getTime())) {
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const ano = data.getFullYear();
        dadosAtualizados.data_validade = `${dia}/${mes}/${ano}`;
      }
    }

    if (pacienteId) {
      this.pacienteService.atualizarPaciente(pacienteId, dadosAtualizados)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe({
          next: () => {
            this.notificacaoService.mostrarSucesso('Paciente atualizado com sucesso!');
            this.voltarParaLista(); // Redirecionar para a lista de pacientes
          },
          error: (err) => {
            this.notificacaoService.mostrarErro('Erro ao atualizar paciente: ' + (err.error?.message || 'Tente novamente.'));
          }
        });
    }
  }

  cancelarEdicao(): void {
    this.modoEdicao = false;
    this.pacienteSelecionado = null;
    this.pacienteForm.reset();
    this.pacienteForm.get('status')?.setValue('ativo');
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
    const control = this.pacienteForm.get(field);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  isEnderecoFieldValid(field: string): boolean {
    const control = this.pacienteForm.get('endereco')?.get(field);
    return control ? control.invalid && (control.dirty || control.touched) : false;
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
                // O campo complemento não será preenchido automaticamente
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

  abrirModalExcluir(): void {
    // Ensure bootstrap is globally available or import it
    const modal = new (window as any).bootstrap.Modal(document.getElementById('modalExcluirPaciente')!);
    modal.show();
  }

  excluirPaciente(): void {
    if (!this.pacienteSelecionado?.id) {
      this.notificacaoService.mostrarErro('Paciente não encontrado.');
      return;
    }
  
    this.isLoading = true;
  
    this.pacienteService.excluirPaciente(this.pacienteSelecionado.id)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: () => {
          this.notificacaoService.mostrarSucesso('Paciente excluído com sucesso!');
          window.location.reload(); // Recarregar a página após a exclusão
        },
        error: () => {
          this.notificacaoService.mostrarErro('Erro ao excluir paciente. Tente novamente.');
        }
      });
  }

  carregarConvenios(): void {
    this.convenioService.obterConvenios().subscribe({
      next: (convenios) => {
        this.convenios = convenios;
      },
      error: (err) => {
        this.notificacaoService.mostrarErro('Erro ao carregar convênios');
      }
    });
  }

  carregarPlanosPorConvenio(convenioId: number): void {
    this.planoService.listarPorConvenio(convenioId).subscribe({
      next: (planos) => {
        this.planos = planos;
        this.planosFiltrados = planos;
        
        // Se havia um plano selecionado, tentar encontrá-lo na nova lista
        const planoIdAtual = this.pacienteForm.get('plano_id')?.value;
        if (planoIdAtual) {
          const planoEncontrado = this.planos.find(p => p.id === planoIdAtual);
          if (planoEncontrado) {
            this.planoSelecionado = planoEncontrado;
          } else {
            // Limpar seleção pois não existe plano correspondente no novo convênio
            this.pacienteForm.get('plano_id')?.setValue(null);
            this.planoSelecionado = null;
          }
        }
      },
      error: (err) => {
        this.notificacaoService.mostrarErro('Erro ao carregar planos');
      }
    });
  }

  setupAutoCompleteListeners(): void {
    // Autocomplete para convênios
    this.conveniosFiltrados$ = this.pacienteForm.get('convenio_nome')!.valueChanges.pipe(
      startWith(''),
      map(value => {
        const nome = typeof value === 'string' ? value : value?.nome;
        return nome ? this._filtrarConvenios(nome) : this.convenios.slice();
      })
    );
  
    // Autocomplete para planos
    this.planosFiltrados$ = this.pacienteForm.get('plano_nome')!.valueChanges.pipe(
      startWith(''),
      map(value => {
        const nome = typeof value === 'string' ? value : value?.nome;
        return nome ? this._filtrarPlanos(nome) : this.planosFiltrados.slice();
      })
    );
    
    // Observar mudanças no convênio para carregar os planos correspondentes
    this.pacienteForm.get('convenio_id')!.valueChanges.subscribe(convenioId => {
      if (convenioId) {
        this.carregarPlanosPorConvenio(convenioId);
      } else {
        this.planos = [];
        this.planosFiltrados = [];
        this.pacienteForm.get('plano_id')?.setValue(null);
        this.planoSelecionado = null;
      }
    });
  }
  
  private _filtrarConvenios(value: string): Convenio[] {
    const filterValue = value.toLowerCase();
    return this.convenios.filter(convenio => 
      convenio.nome.toLowerCase().includes(filterValue));
  }
  
  private _filtrarPlanos(value: string): Plano[] {
    const filterValue = value.toLowerCase();
    return this.planosFiltrados.filter(plano => 
      plano.nome.toLowerCase().includes(filterValue));
  }

  exibirConvenio(convenio: Convenio | null): string {
    return convenio ? convenio.nome : '';
  }
  
  exibirPlano(plano: Plano | null): string {
    return plano ? plano.nome : '';
  }
  
  selecionarConvenio(event: any): void {
    const convenio = event.option.value;
    this.convenioSelecionado = convenio;
    this.pacienteForm.patchValue({
      convenio_id: convenio.id,
      convenio_nome: convenio.nome
    });
    
    // Limpar plano e carregar planos do convênio selecionado
    this.pacienteForm.patchValue({ plano_id: null, plano_nome: '' });
    this.planoSelecionado = null;
    this.carregarPlanosPorConvenio(convenio.id);
  }
  
  selecionarPlano(event: any): void {
    const plano = event.option.value;
    this.planoSelecionado = plano;
    this.pacienteForm.patchValue({
      plano_id: plano.id,
      plano_nome: plano.nome
    });
  }
}
