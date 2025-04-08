import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize, switchMap, map } from 'rxjs/operators';
import { of, Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule, DatePipe } from '@angular/common';

import { UsuarioService } from '../services/usuario.service';
import { SetoresFuncoesService } from '../services/setor-funcoes.service';
import { CepService } from '../../../core/services/cep.service';
import { Usuario, Endereco, UserStatus } from '../models/user.model'; // Adicionando a importação do UserStatus
import { Funcao } from '../models/funcao.model';
import { Setor } from '../models/setor.model';
import { UserStatusStyleService } from '../services/user-status-style.service'; // Importando o serviço de estilo

import { PasswordFormComponent } from '../password/password-form.component';

import { ConselhosProfissionaisService } from '../services/conselhos-profissionais.service';


@Component({
  selector: 'app-cadastrar-usuario',
  templateUrl: './cadastrar-usuario.component.html',
  styleUrls: ['./cadastrar-usuario.component.scss'],
  imports: [
    ReactiveFormsModule, 
    CommonModule,
    PasswordFormComponent // Importando diretamente o componente (assumindo que é standalone)
  ],
  providers: [DatePipe],
  standalone: true,
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
  
  // Adicionar a propriedade userStatusOptions
  userStatusOptions = Object.values(UserStatus);
  
  // Controle do fluxo de steps
  currentStep: 'userForm' | 'passwordForm' = 'userForm';
  tempUsuarioData: any = null;
  
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

  labelConselhoProfissional = 'Conselho Profissional';
  mostrarConselhoProfissional = false;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private setoresFuncoesService: SetoresFuncoesService,
    private cepService: CepService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private conselhoService: ConselhosProfissionaisService,
    private userStatusStyle: UserStatusStyleService // Adicionando o serviço ao construtor
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
        estado: ['', [Validators.required]]
      }),
      dataAdmissao: [''],
      tipoContratacao: ['contratada', [Validators.required]],
      tipoAcesso: ['padrao', [Validators.required]],
      status: [UserStatus.ATIVO] // Agora usando o enum UserStatus
    });
  }

  carregarSetores(): void {
    this.isLoading = true;
    this.setoresFuncoesService.getSetores()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (setores) => {
          this.setores = setores;
        },
        error: (err) => {
          this.error = 'Erro ao carregar setores';
          this.showNotification('Erro ao carregar setores', 'error');
        }
      });
  }

  // Atualizando o método carregarFuncoes com a lógica para mostrar o campo de conselho profissional

  carregarFuncoes(setorId: number): void {
    this.isLoading = true;
    // Verificar se já existe uma subscription para evitar duplicações
    if (this.funcaoSubscription) {
      this.funcaoSubscription.unsubscribe();
    }

    this.setoresFuncoesService.getFuncoesPorSetor(setorId)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (funcoes) => {
          this.funcoes = funcoes.map(f => ({
            ...f,
            tipo_contratacao: f.tipo_contratacao as any
          }));
          
          // Limpar as seleções e campos anteriores se não estiver em modo de edição
          if (!this.modoEdicao) {
            this.usuarioForm.get('funcao')?.setValue('');
            this.usuarioForm.get('registroCategoria')?.setValue('');
            this.usuarioForm.get('especialidade')?.setValue('');
            
            // Inicialmente ocultar o campo de conselho profissional
            this.mostrarConselhoProfissional = false;
            this.usuarioForm.get('registroCategoria')?.clearValidators();
            this.usuarioForm.get('registroCategoria')?.updateValueAndValidity();
          }
          
          // Configurar listener para mudanças na função selecionada
          this.funcaoSubscription = this.usuarioForm.get('funcao')?.valueChanges.subscribe(funcaoId => {
            if (funcaoId) {
              // Usar o serviço para verificar se a função requer registro
              const conselhoInfo = this.conselhoService.verificarConselhoFuncaoDinamico(+funcaoId, this.funcoes);
              
              if (conselhoInfo) {
                // Função requer registro em conselho profissional
                this.mostrarConselhoProfissional = true;
                this.labelConselhoProfissional = conselhoInfo.label;
                
                // Tornar o campo obrigatório
                this.usuarioForm.get('registroCategoria')?.setValidators([Validators.required]);
              } else {
                // Função não requer registro
                this.mostrarConselhoProfissional = false;
                this.usuarioForm.get('registroCategoria')?.clearValidators();
                this.usuarioForm.get('registroCategoria')?.setValue('');
                this.usuarioForm.get('especialidade')?.setValue('');
              }
              
              this.usuarioForm.get('registroCategoria')?.updateValueAndValidity();
            } else {
              // Sem função selecionada
              this.mostrarConselhoProfissional = false;
              this.usuarioForm.get('registroCategoria')?.clearValidators();
              this.usuarioForm.get('registroCategoria')?.updateValueAndValidity();
            }
          });
          
          // Verificar para modo de edição
          if (this.modoEdicao && this.usuarioForm.get('funcao')?.value) {
            const funcaoId = +this.usuarioForm.get('funcao')?.value;
            const conselhoInfo = this.conselhoService.verificarConselhoFuncaoDinamico(funcaoId, this.funcoes);
            
            if (conselhoInfo) {
              this.mostrarConselhoProfissional = true;
              this.labelConselhoProfissional = conselhoInfo.label;
              this.usuarioForm.get('registroCategoria')?.setValidators([Validators.required]);
              this.usuarioForm.get('registroCategoria')?.updateValueAndValidity();
            }
          }
        },
        error: (err) => {
          this.error = 'Erro ao carregar funções';
          this.showNotification('Erro ao carregar funções', 'error');
        }
      });
  }

  consultarCep(): void {
    const cep = this.usuarioForm.get('endereco.cep')?.value; // Atualizado o caminho
    
    if (cep && cep.length === 8) {
      this.isLoading = true;
      this.cepService.consultarCep(cep)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe({
          next: (endereco) => {
            console.log('Resposta da API ViaCEP:', endereco);
            if (endereco && !endereco.erro) {
              // Mapear os dados da API para o formulário
              this.usuarioForm.patchValue({
                endereco: {
                  rua: endereco.logradouro || '',
                  bairro: endereco.bairro || '',
                  cidade: endereco.localidade || '',
                  estado: endereco.uf || ''
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
              this.showNotification('CEP não encontrado', 'warning');
            }
          },
          error: (err) => {
            console.error('Erro na consulta do CEP:', err);
            this.showNotification('Erro ao consultar CEP', 'error');
          }
        });
    }
  }

  // Versão melhorada do carregarUsuario utilizando observáveis

  carregarUsuario(id: number): void {
    this.isLoading = true;
    this.usuarioService.obterPorId(id.toString())
      .pipe(
        switchMap(usuario => {
          // Preenchimento do formulário com os dados do usuário
          this.usuarioForm.patchValue({
            nome: usuario.nome,
            email: usuario.email,
            cpf: usuario.cpf || '', // Handling both property names
            telefone: usuario.telefone || '',
            setor: usuario.setor,
            funcao: usuario.funcao,
            registroCategoria: usuario.registroCategoria || '',
            especialidade: usuario.especialidade || '',
            endereco: {
              cep: usuario.cep || '',
              rua: usuario.endereco?.logradouro || '',
              numero: usuario.endereco?.numero || '',
              bairro: usuario.endereco?.bairro || '',
              cidade: usuario.endereco?.localidade || '',
              estado: usuario.endereco?.uf || usuario.endereco?.estado || ''
            },
            dataAdmissao: usuario.dataAdmissao ? this.datePipe.transform(usuario.dataAdmissao, 'yyyy-MM-dd') : '',
            tipoContratacao: usuario.tipoContratacao || 'contratada',
            tipoAcesso: usuario.tipoAcesso || 'padrao',
            status: usuario.status || 'ativo'
          });
          
          // Se o usuário tem um setor, carregamos as funções e depois voltamos para o fluxo principal
          if (usuario.setor) {
            const setorId = +usuario.setor;
            return this.setoresFuncoesService.getFuncoesPorSetor(setorId).pipe(
              map(funcoes => {
                this.funcoes = funcoes.map(f => ({
                  ...f,
                  tipo_contratacao: f.tipo_contratacao as any
                }));
                return usuario; // Retorna o usuário para continuar o fluxo
              })
            );
          }
          
          // Se não tiver setor, apenas continua o fluxo
          return of(usuario);
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (usuario) => {
          // Agora que temos as funções carregadas, podemos configurar o campo de conselho profissional
          if (usuario.funcao) {
            const funcaoId = +usuario.funcao;
            const funcaoSelecionada = this.funcoes.find(f => f.id === funcaoId);
            
            if (funcaoSelecionada && funcaoSelecionada.conselho_profissional) {
              this.mostrarConselhoProfissional = true;
              this.labelConselhoProfissional = `Número do ${funcaoSelecionada.conselho_profissional}`;
              
              // Definir validador de obrigatoriedade
              this.usuarioForm.get('registroCategoria')?.setValidators([Validators.required]);
              this.usuarioForm.get('registroCategoria')?.updateValueAndValidity();
            }
          }
        },
        error: (err) => {
          this.error = 'Erro ao carregar dados do usuário';
          this.showNotification('Erro ao carregar dados do usuário', 'error');
        }
      });
  }

  // Modificamos o método onSubmit para implementar o fluxo de steps
  onSubmit(): void {
    if (this.usuarioForm.invalid) {
      this.usuarioForm.markAllAsTouched();
      this.showNotification('Preencha todos os campos obrigatórios', 'warning');
      return;
    }

    // Preparar os dados do usuário
    this.tempUsuarioData = this.prepararDadosUsuario();

    if (this.modoEdicao && this.userId) {
      // Para edição, não solicitar senha, apenas atualizar o usuário
      this.isLoading = true;
      this.usuarioService.atualizar(this.userId.toString(), this.tempUsuarioData)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe({
          next: () => {
            this.showNotification('Usuário atualizado com sucesso', 'success');
            this.router.navigate(['/usuarios']);
          },
          error: (err) => {
            this.error = 'Erro ao atualizar usuário';
            this.showNotification('Erro ao atualizar usuário', 'error');
          }
        });
    } else {
      // Para cadastro novo, avançar para o passo de definição de senha
      this.currentStep = 'passwordForm';
      // Scroll para o topo da página para melhor visibilidade do novo formulário
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // Método para voltar ao formulário de usuário
  voltarParaFormulario(): void {
    this.currentStep = 'userForm';
  }

  // Método chamado quando a senha for definida pelo componente de senha
  onPasswordSubmitted(passwordHash: string): void {
    if (!this.tempUsuarioData) {
      this.showNotification('Erro ao processar dados do usuário', 'error');
      return;
    }
    
    // Adicionar o hash da senha aos dados do usuário
    this.tempUsuarioData.password_hash = passwordHash;
    
    // Enviar os dados do usuário com a senha para a API
    this.isLoading = true;
    this.usuarioService.criar(this.tempUsuarioData)
      .pipe(finalize(() => {
        this.isLoading = false;
        this.tempUsuarioData = null; // Limpar os dados temporários
      }))
      .subscribe({
        next: () => {
          this.showNotification('Usuário cadastrado com sucesso', 'success');
          this.router.navigate(['/usuarios']);
        },
        error: (err) => {
          this.error = 'Erro ao cadastrar usuário';
          this.showNotification('Erro ao cadastrar usuário: ' + 
            (err.error?.message || 'Verifique a conexão com o servidor'), 'error');
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
    console.log('Status selecionado para envio:', status);

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
    
    console.log('Dados do usuário preparados:', dadosUsuario);
    return dadosUsuario;
  }

  showNotification(message: string, type: 'success' | 'error' | 'warning'): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 5000,
      panelClass: [`notification-${type}`]
    });
  }
  cancelar(): void {
    this.router.navigate(['/usuarios']);
  }

  ngOnDestroy(): void {
    if (this.funcaoSubscription) {
      this.funcaoSubscription.unsubscribe();
    }
  }

  // Adicionar estes métodos ao componente
  getStatusClass(status: string): string {
    switch(status) {
      case UserStatus.ATIVO: return 'bg-success';
      case UserStatus.INATIVO: return 'bg-danger';
      case UserStatus.FERIAS: return 'bg-info';
      case UserStatus.LICENCA_MEDICA: 
      case UserStatus.LICENCA_MATERNIDADE:
      case UserStatus.LICENCA_PATERNIDADE: return 'bg-warning';
      default: return 'bg-secondary';
    }
  }
  
  getStatusIcon(status: string): string {
    switch(status) {
      case UserStatus.ATIVO: return 'bi bi-check-circle';
      case UserStatus.INATIVO: return 'bi bi-x-circle';
      case UserStatus.FERIAS: return 'bi bi-umbrella';
      case UserStatus.LICENCA_MEDICA: return 'bi bi-hospital';
      default: return 'bi bi-info-circle';
    }
  }
  
  getStatusTextClass(status: string): string {
    switch(status) {
      case UserStatus.ATIVO: return 'text-success';
      case UserStatus.INATIVO: return 'text-danger';
      default: return 'text-secondary';
    }
  }
}