import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { DatePipe } from '@angular/common';

// Serviços
import { ApiUsuarioService } from '../services/api-usuario.service';
import { UsuarioRoutesService } from '../services/usuario-routes.service';
import { UserStatusStyleService } from '../services/user-status-style.service';
import { ConselhosProfissionaisService } from '../services/conselhos-profissionais.service';
import { CepService } from '../../../core/services/cep.service';
import { NotificacaoService } from '../../../shared/services/notificacao.service';

// Modelos
import { Usuario, UserStatus } from '../models/user.model';
import { Setor } from '../models/setor.model';
import { Funcao } from '../models/funcao.model';

@Component({
  selector: 'app-editar-usuario',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    RouterModule
  ],
  providers: [DatePipe],
  templateUrl: './editar-usuario.component.html',
  styleUrl: './editar-usuario.component.scss'
})
export class EditarUsuarioComponent implements OnInit, OnDestroy {
  usuarioForm!: FormGroup;
  setores: Setor[] = [];
  funcoes: Funcao[] = [];
  isLoading = false;
  error: string | null = null;
  userId?: number;
  funcaoSubscription?: Subscription;
  formSubmitted = false;

  // Status de usuário
  userStatusOptions = Object.values(UserStatus);
  
  // Configurações para formulário
  labelConselhoProfissional = ''; // Label dinâmica para o campo de conselho
  mostrarConselhoProfissional = false; // Controle de exibição do campo de conselho
  mostrarEspecialidade = false; // Controle de exibição do campo de especialidade

  tiposContratacao = [
    { value: 'contratada', viewValue: 'Contratada' },
    { value: 'terceirizada', viewValue: 'Terceirizada' },
    { value: 'pj', viewValue: 'Pessoa Jurídica' }
  ];

  tiposAcesso = [
    { value: 'admin', viewValue: 'Administrador' },
    { value: 'gestor', viewValue: 'Gestor' },
    { value: 'padrao', viewValue: 'Padrão' },
    { value: 'restrito', viewValue: 'Restrito' }
  ];

  constructor(
    private fb: FormBuilder,
    private apiUsuarioService: ApiUsuarioService,
    private usuarioRoutesService: UsuarioRoutesService,
    private cepService: CepService,
    private router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private conselhoService: ConselhosProfissionaisService,
    private userStatusStyle: UserStatusStyleService,
    private notificacaoService: NotificacaoService
  ) { }

  ngOnInit(): void {
    this.inicializarFormulario();
    this.carregarSetores();
    
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.userId = +params['id'];
        this.carregarUsuario(this.userId);
      } else {
        this.notificacaoService.mostrarErro('ID do usuário não encontrado');
        this.usuarioRoutesService.navegarParaLista();
      }
    });

    // Observar mudanças no setor selecionado
    this.usuarioForm.get('setor')?.valueChanges.subscribe(setorId => {
      if (setorId) {
        // Só carregamos funções novamente se o usuário mudar manualmente o setor
        if (!this.isLoading) { // Evita execução durante o carregamento inicial
          this.carregarFuncoes(setorId);
        }
      } else {
        this.funcoes = [];
        this.mostrarConselhoProfissional = false;
        this.mostrarEspecialidade = false;
      }
    });
  }

  inicializarFormulario(): void {
    this.usuarioForm = this.fb.group({
      nome: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', [Validators.required]],
      telefone: [''],
      setor: ['', [Validators.required]],
      funcao: ['', [Validators.required]],
      registroCategoria: [''], // Inicialmente sem validadores
      especialidade: [''],
      endereco: this.fb.group({
        cep: ['', [Validators.required]],
        rua: ['', [Validators.required]],
        numero: ['', [Validators.required]],
        bairro: ['', [Validators.required]],
        cidade: ['', [Validators.required]],
        estado: ['', [Validators.required]],
        complemento: ['']
      }),
      dataAdmissao: [''],
      tipoContratacao: ['contratada', [Validators.required]],
      tipoAcesso: ['padrao', [Validators.required]],
      status: [UserStatus.ATIVO]
    });
  }

  carregarSetores(): void {
    this.isLoading = true;
    this.apiUsuarioService.listarSetores()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (setores) => {
          this.setores = setores;
        },
        error: (err) => {
          this.error = 'Erro ao carregar setores';
          this.notificacaoService.mostrarErro('Erro ao carregar setores');
        }
      });
  }

  carregarFuncoes(setorId: number): void {
    this.isLoading = true;

    // Cancela a assinatura anterior, se existir
    if (this.funcaoSubscription) {
      this.funcaoSubscription.unsubscribe();
    }

    this.apiUsuarioService.listarFuncoesPorSetor(setorId)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (funcoes) => {
          this.funcoes = funcoes;
          
          // Limpar os valores dependentes de função quando o setor muda
          // apenas se não estamos no carregamento inicial do formulário
          if (!this.modoEdicaoInicial) {
            this.usuarioForm.get('funcao')?.setValue('');
            this.usuarioForm.get('registroCategoria')?.setValue('');
            this.usuarioForm.get('especialidade')?.setValue('');
            this.mostrarConselhoProfissional = false;
            this.mostrarEspecialidade = false;
          }
          
          this.configuraObservadorFuncao();
        },
        error: (err) => {
          this.error = 'Erro ao carregar funções';
          this.notificacaoService.mostrarErro('Erro ao carregar funções');
        }
      });
  }

  // Propriedade para controlar se estamos no carregamento inicial da edição
  private modoEdicaoInicial = false;

  // Método separado para configurar o observador de mudanças na função
  configuraObservadorFuncao(): void {
    // Cancela a assinatura anterior, se existir
    if (this.funcaoSubscription) {
      this.funcaoSubscription.unsubscribe();
    }
    
    // Nova assinatura para observar mudanças na função
    this.funcaoSubscription = this.usuarioForm.get('funcao')?.valueChanges.subscribe((funcaoId: number) => {
      if (funcaoId) {
        this.verificarRequisitosConselhoProfissional(funcaoId);
      } else {
        // Limpar os campos e esconder as seções condicionais quando nenhuma função estiver selecionada
        this.mostrarConselhoProfissional = false;
        this.mostrarEspecialidade = false;
        this.usuarioForm.get('registroCategoria')?.clearValidators();
        this.usuarioForm.get('registroCategoria')?.updateValueAndValidity();
      }
    });
  }

  // Método para verificar se a função requer conselho profissional
  verificarRequisitosConselhoProfissional(funcaoId: number): void {
    // Verifica usando o método dinâmico com as funções carregadas
    const conselhoInfo = this.conselhoService.verificarConselhoFuncaoDinamico(funcaoId, this.funcoes);
    
    if (conselhoInfo) {
      this.mostrarConselhoProfissional = true;
      this.labelConselhoProfissional = conselhoInfo.label;
      this.mostrarEspecialidade = true;

      // Tornar o campo "Registro de Conselho" obrigatório
      this.usuarioForm.get('registroCategoria')?.setValidators([Validators.required]);
      this.usuarioForm.get('registroCategoria')?.updateValueAndValidity();
    } else {
      // Se não encontrou pelo método dinâmico, tenta pelo método estático de backup
      const conselhoStaticInfo = this.conselhoService.verificarConselhoFuncao(funcaoId);
      
      if (conselhoStaticInfo) {
        this.mostrarConselhoProfissional = true;
        this.labelConselhoProfissional = conselhoStaticInfo.label;
        this.mostrarEspecialidade = true;

        // Tornar o campo "Registro de Conselho" obrigatório
        this.usuarioForm.get('registroCategoria')?.setValidators([Validators.required]);
        this.usuarioForm.get('registroCategoria')?.updateValueAndValidity();
      } else {
        this.mostrarConselhoProfissional = false;
        this.mostrarEspecialidade = false;
        this.usuarioForm.get('registroCategoria')?.clearValidators();
        this.usuarioForm.get('registroCategoria')?.updateValueAndValidity();
      }
    }
  }

  consultarCep(): void {
    const cep = this.usuarioForm.get('endereco.cep')?.value;
    if (cep && cep.length === 8) {
      this.isLoading = true;
      this.cepService.consultarCep(cep)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe({
          next: (endereco) => {
            if (endereco && !(endereco as any).erro) {
              // Mapear os dados da API para o formulário
              this.usuarioForm.patchValue({
                endereco: {
                  rua: endereco.logradouro || '',
                  bairro: endereco.bairro || '',
                  cidade: endereco.localidade || '',
                  estado: endereco.uf || '',
                }
              });
              
              // Focar no campo número após preencher o endereço
              setTimeout(() => {
                const numeroInput = document.querySelector('input[formControlName="numero"]');
                if (numeroInput) {
                  (numeroInput as HTMLElement).focus();
                }
              }, 100);
            } else {
              this.notificacaoService.mostrarAviso('CEP não encontrado');
            }
          },
          error: (err) => {
            console.error('Erro na consulta do CEP:', err);
            this.notificacaoService.mostrarErro('Erro ao consultar CEP');
          }
        });
    }
  }

  carregarUsuario(id: number): void {
    this.isLoading = true;
    this.modoEdicaoInicial = true;

    this.apiUsuarioService.obterUsuarioPorId(id.toString())
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe({
        next: (usuario) => {
          // Mapear o tipoContratacao de volta para o formato esperado pelo frontend
          let tipoContratacaoFormatado = usuario.tipoContratacao || 'contratada';
          if (usuario.tipo_contratacao) {
            switch (usuario.tipo_contratacao) {
              case 'c': tipoContratacaoFormatado = 'contratada'; break;
              case 't': tipoContratacaoFormatado = 'terceirizada'; break;
              case 'p': tipoContratacaoFormatado = 'pj'; break;
            }
          }

          // Preencher os campos do formulário
          this.usuarioForm.patchValue({
            nome: usuario.nome || '',
            email: usuario.email || '',
            cpf: usuario.cpf || '',
            telefone: usuario.telefone || '',
            endereco: {
              cep: usuario.cep || '',
              rua: usuario.endereco?.logradouro || usuario.endereco?.rua || '',
              numero: usuario.endereco?.numero || '',
              complemento: usuario.endereco?.complemento || '',
              bairro: usuario.endereco?.bairro || '',
              cidade: usuario.endereco?.localidade || usuario.endereco?.cidade || '',
              estado: usuario.endereco?.uf || usuario.endereco?.estado || ''
            },
            dataAdmissao: usuario.dataAdmissao || usuario.data_admissao ? 
                         this.datePipe.transform(usuario.dataAdmissao || usuario.data_admissao, 'yyyy-MM-dd') : '',
            tipoContratacao: tipoContratacaoFormatado,
            tipoAcesso: usuario.tipoAcesso || usuario.tipo_acesso || 'padrao',
            status: usuario.status || UserStatus.ATIVO
          });

          // Configurar setor e função
          if (usuario.setor) {
            this.usuarioForm.get('setor')?.setValue(+usuario.setor);

            this.apiUsuarioService.listarFuncoesPorSetor(+usuario.setor)
              .subscribe({
                next: (funcoes) => {
                  this.funcoes = funcoes;

                  if (usuario.funcao) {
                    const funcaoId = +usuario.funcao;
                    this.usuarioForm.get('funcao')?.setValue(funcaoId);

                    // Verificar requisitos do conselho profissional
                    this.verificarRequisitosConselhoProfissional(funcaoId);

                    // Aplicar os valores de registroCategoria e especialidade
                    this.usuarioForm.patchValue({
                      registroCategoria: usuario.registro_categoria || '',
                      especialidade: usuario.especialidade || ''
                    });
                  }

                  this.configuraObservadorFuncao();
                  this.modoEdicaoInicial = false;
                },
                error: () => {
                  this.notificacaoService.mostrarErro('Erro ao carregar funções para o setor');
                  this.modoEdicaoInicial = false;
                }
              });
          } else {
            this.modoEdicaoInicial = false;
          }
        },
        error: () => {
          this.notificacaoService.mostrarErro('Erro ao carregar dados do usuário');
          this.modoEdicaoInicial = false;
        }
      });
  }

  onSubmit(): void {
    this.formSubmitted = true;
    
    if (this.usuarioForm.invalid) {
      this.markFormGroupTouched(this.usuarioForm);
      this.notificacaoService.mostrarAviso('Preencha todos os campos obrigatórios');
      return;
    }

    if (!this.userId) {
      this.notificacaoService.mostrarErro('ID do usuário não encontrado');
      return;
    }

    // Preparar os dados do usuário
    const dadosUsuario = this.prepararDadosUsuario();
    
    this.isLoading = true;
    this.apiUsuarioService.atualizarUsuario(this.userId.toString(), dadosUsuario)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: () => {
          this.notificacaoService.mostrarSucesso('Usuário atualizado com sucesso!');
          this.usuarioRoutesService.navegarParaLista();
        },
        error: (err) => {
          this.error = 'Erro ao atualizar usuário';
          this.notificacaoService.mostrarErro('Erro ao atualizar usuário');
        }
      });
  }

  excluirUsuario(): void {
    if (!this.userId) {
      this.notificacaoService.mostrarErro('ID do usuário não encontrado');
      return;
    }
    
    if (confirm('Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.')) {
      this.isLoading = true;
      this.apiUsuarioService.excluirUsuario(this.userId)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe({
          next: () => {
            this.notificacaoService.mostrarSucesso('Usuário excluído com sucesso!');
            this.usuarioRoutesService.navegarParaLista();
          },
          error: (err) => {
            this.error = 'Erro ao excluir usuário';
            this.notificacaoService.mostrarErro('Erro ao excluir usuário');
          }
        });
    }
  }

  private prepararDadosUsuario(): Usuario {
    const formValues = this.usuarioForm.value;
    
    // Converter a data de string para objeto Date
    let dataAdmissao = formValues.dataAdmissao;
    if (dataAdmissao && typeof dataAdmissao === 'string') {
      dataAdmissao = new Date(dataAdmissao);
    }

    // Extrair o CEP do objeto endereco para enviá-lo separado
    const cep = formValues.endereco?.cep;
    const enderecoSemCep = { ...formValues.endereco };
    delete enderecoSemCep.cep; // Remover o CEP do objeto endereco

    // Obter o status diretamente do formulário para garantir que estamos enviando exatamente o que foi selecionado
    const status = formValues.status;
    
    const dadosUsuario = {
      id: this.userId?.toString(),
      nome: formValues.nome,
      email: formValues.email,
      cpf: formValues.cpf,
      telefone: formValues.telefone,
      setor: formValues.setor,
      funcao: formValues.funcao,
      registroCategoria: formValues.registroCategoria,
      especialidade: formValues.especialidade,
      cep: cep, // Enviar o CEP como campo separado
      endereco: enderecoSemCep, // Enviar o restante do endereço sem o CEP
      dataAdmissao: dataAdmissao,
      tipoContratacao: formValues.tipoContratacao,
      tipoAcesso: formValues.tipoAcesso,
      status: status,
      ativo: status === UserStatus.ATIVO
    };

    return dadosUsuario;
  }

  // Método para marcar todos os campos como touched para mostrar validações
  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
  
  cancelar(): void {
    this.usuarioRoutesService.navegarParaLista();
  }

  ngOnDestroy(): void {
    if (this.funcaoSubscription) {
      this.funcaoSubscription.unsubscribe();
    }
  }

  // Métodos para estilização dos status utilizando o serviço UserStatusStyleService
  getStatusClass(status: string): string {
    return this.userStatusStyle.getBadgeClass(status);
  }
  
  getStatusIcon(status: string): string {
    return this.userStatusStyle.getIcon(status);
  }
  
  getStatusTextClass(status: string): string {
    return this.userStatusStyle.getTextClass(status);
  }

  shouldShowErrors(controlName: string): boolean {
    const control = this.usuarioForm.get(controlName);
    return control !== null && control.invalid && (control.touched || this.formSubmitted);
  }

  shouldShowNestedErrors(parentGroup: string, controlName: string): boolean {
    const control = this.usuarioForm.get(`${parentGroup}.${controlName}`);
    return control !== null && control.invalid && (control.touched || this.formSubmitted);
  }
}