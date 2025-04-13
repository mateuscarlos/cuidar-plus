import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { finalize, switchMap, map } from 'rxjs/operators';
import { of, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificacaoService } from '../../../shared/services/notificacao.service';

// Novo serviço unificado
import { UsuarioService } from '../services/usuario.service';
import { UsuarioRoutesService } from '../services/usuario-routes.service';
import { UserStatusStyleService } from '../services/user-status-style.service';
import { ConselhosProfissionaisService } from '../services/conselhos-profissionais.service';
import { CepService } from '../../../core/services/cep.service';
import { DatePipe } from '@angular/common';

// Componentes
import { PasswordFormComponent } from '../password/password-form.component';
import { Usuario, Endereco, UserStatus } from '../models/user.model';
import { Funcao } from '../models/funcao.model';
import { Setor } from '../models/setor.model';
import { SetorProfissional } from '../models/conselhos-profissionais.model';

@Component({
  selector: 'app-cadastrar-usuario',
  templateUrl: './cadastrar-usuario.component.html',
  styleUrls: ['./cadastrar-usuario.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    PasswordFormComponent
  ],
  providers: [DatePipe]
})
export class CadastrarUsuarioComponent implements OnInit, OnDestroy {
  usuarioForm!: FormGroup;
  setores: Setor[] = [];
  funcoes: Funcao[] = [];
  isLoading = false;
  error: string | null = null;
  modoEdicao = false;
  userId?: number;
  funcaoSubscription?: Subscription;
  
  // Status de usuário
  userStatusOptions = Object.values(UserStatus);
  
  // Controle do fluxo de steps
  currentStep: 'userForm' | 'passwordForm' = 'userForm';
  tempUsuarioData: any = null;

  // Tipos de contratação para o select
  tiposContratacao = [
    { value: 'c', viewValue: 'Contratada' },
    { value: 't', viewValue: 'Terceirizada' },
    { value: 'p', viewValue: 'Pessoa Jurídica' }
  ];

  // Tipos de acesso para o select
  tiposAcesso = [
    { value: 'admin', viewValue: 'Administrador' },
    { value: 'gestor', viewValue: 'Gestor' },
    { value: 'padrao', viewValue: 'Padrão' },
    { value: 'restrito', viewValue: 'Restrito' }
  ];

  // Controle dos campos dinâmicos de conselho profissional
  labelConselhoProfissional = '';
  mostrarConselhoProfissional = false;
  mostrarEspecialidade = false;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
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
        this.modoEdicao = true;
        this.carregarUsuario(this.userId);
      }
    });

    // Observar mudanças no setor selecionado
    this.usuarioForm.get('setor')?.valueChanges.subscribe(setorId => {
      if (setorId) {
        this.carregarFuncoes(setorId);
      } else {
        this.funcoes = [];
        this.mostrarConselhoProfissional = false;
        this.mostrarEspecialidade = false;
      }
    });
    
    // Configurar valores iniciais para campos condicionais
    if (this.usuarioForm.get('funcao')?.value) {
      const funcaoId = +this.usuarioForm.get('funcao')?.value;
      setTimeout(() => this.verificarRequisitosConselhoProfissional(funcaoId), 200);
    }
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
    this.usuarioService.listarSetores()
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

    this.usuarioService.listarFuncoesPorSetor(setorId)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (funcoes) => {
          this.funcoes = funcoes;

          // Resetar campos do formulário apenas se não estiver em modo de edição ou se for a primeira carga
          if (!this.modoEdicao || !this.usuarioForm.get('funcao')?.value) {
            this.usuarioForm.get('funcao')?.setValue('');
            this.usuarioForm.get('registroCategoria')?.setValue('');
            this.usuarioForm.get('especialidade')?.setValue('');
            this.mostrarConselhoProfissional = false;
            this.mostrarEspecialidade = false;
          } else {
            // Se estamos em modo de edição, verificar se a função atual requer conselho
            const funcaoId = +this.usuarioForm.get('funcao')?.value;
            this.verificarRequisitosConselhoProfissional(funcaoId);
          }

          // Configura a observação de mudanças na função selecionada
          this.configuraObservadorFuncao();
        },
        error: (err) => {
          this.error = 'Erro ao carregar funções';
          this.notificacaoService.mostrarErro('Erro ao carregar funções');
        }
      });
  }

  
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
    // Verifica primeiro usando o método dinâmico com as funções carregadas
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

  // Novo método para filtrar caracteres não numéricos do CEP
  filtrarCep(event: any): void {
    const input = event.target;
    // Remove qualquer caractere que não seja número
    const valor = input.value.replace(/\D/g, '');
    
    // Atualiza o valor do campo com apenas os números
    this.usuarioForm.get('endereco.cep')?.setValue(valor, {emitEvent: false});
  }

  carregarUsuario(id: number): void {
    this.isLoading = true;
    this.usuarioService.obterUsuarioPorId(id.toString())
      .pipe(
        switchMap(usuario => {
          // Primeiro carregamos o setor, que disparará o carregamento das funções
          if (usuario.setor) {
            const setorId = +usuario.setor;
            return this.usuarioService.listarFuncoesPorSetor(setorId).pipe(
              map(funcoes => {
                this.funcoes = funcoes;
                return usuario; // Retorna o usuário para continuar o fluxo
              })
            );
          }
          return of(usuario);
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (usuario) => {
          // Preencher o formulário após termos as funções carregadas
          this.usuarioForm.patchValue({
            nome: usuario.nome,
            email: usuario.email,
            cpf: usuario.cpf || '',
            telefone: usuario.telefone || '',
            setor: usuario.setor,
            funcao: usuario.funcao,
            registroCategoria: usuario.registroCategoria || '',
            especialidade: usuario.especialidade || '',
            endereco: {
              cep: usuario.cep || '',
              rua: usuario.endereco?.logradouro || '',
              numero: usuario.endereco?.numero || '',
              complemento: usuario.endereco?.complemento || '',
              bairro: usuario.endereco?.bairro || '',
              cidade: usuario.endereco?.localidade || '',
              estado: usuario.endereco?.uf || usuario.endereco?.estado || ''
            },
            dataAdmissao: usuario.dataAdmissao ? this.datePipe.transform(usuario.dataAdmissao, 'yyyy-MM-dd') : '',
            tipoContratacao: usuario.tipoContratacao || 'contratada',
            tipoAcesso: usuario.tipoAcesso || 'padrao',
            status: usuario.status || UserStatus.ATIVO
          });

          // Verificar configuração dos campos condicionais após preencher o formulário
          if (usuario.funcao) {
            setTimeout(() => {
              // Usar setTimeout para garantir que o Angular tenha processado as mudanças no form
              const funcaoId = +(usuario.funcao ?? 0);
              this.verificarRequisitosConselhoProfissional(funcaoId);
            }, 100);
          }
        },
        error: (err) => {
          this.error = 'Erro ao carregar dados do usuário';
          this.notificacaoService.mostrarErro('Erro ao carregar dados do usuário');
        }
      });
  }

  onSubmit(): void {
    if (this.usuarioForm.invalid) {
      // Marcar todos os campos como tocados para exibir validações
      this.markFormGroupTouched(this.usuarioForm);
      this.notificacaoService.mostrarErro('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
  
    // Armazenar dados temporariamente e ir para o componente de senha
    this.tempUsuarioData = this.prepararDadosUsuario();
    this.currentStep = 'passwordForm';
    
    // Rolar para o topo da página para focar no novo componente
    window.scrollTo(0, 0);
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

  // Método para voltar ao formulário de usuário
  voltarParaFormulario(): void {
    this.currentStep = 'userForm';
  }

  // Método chamado quando a senha for definida pelo componente de senha
  onPasswordSubmitted(passwordHash: string): void {
    if (!this.tempUsuarioData) {
      this.notificacaoService.mostrarErro('Erro ao processar dados do usuário');
      return;
    }
    
    // Adicionar o hash da senha aos dados do usuário
    this.tempUsuarioData.password_hash = passwordHash;
    
    // Enviar os dados do usuário com a senha para a API
    this.isLoading = true;
    this.usuarioService.criarUsuario(this.tempUsuarioData)
      .pipe(finalize(() => {
        this.isLoading = false;
        this.tempUsuarioData = null; // Limpar os dados temporários
      }))
      .subscribe({
        next: () => {
          this.notificacaoService.mostrarSucesso('Usuário cadastrado com sucesso');
          this.usuarioRoutesService.navegarParaLista();
        },
        error: (err) => {
          this.error = 'Erro ao cadastrar usuário';
          this.notificacaoService.mostrarErro('Erro ao cadastrar usuário: ' + 
            (err.error?.message || 'Verifique a conexão com o servidor'));
          // Voltar para o formulário de dados do usuário em caso de erro
          this.currentStep = 'userForm';
        }
      });
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
      status: status, // Usando o valor exato selecionado no formulário
      ativo: status === UserStatus.ATIVO // Derivar o campo ativo do status
    };

    return dadosUsuario;
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
}