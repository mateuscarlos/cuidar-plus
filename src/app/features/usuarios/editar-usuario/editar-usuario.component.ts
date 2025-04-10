import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { Usuario, UserStatus } from '../models/user.model';
import { UsuarioService } from '../services/usuario.service';
import { SetoresFuncoesService } from '../services/setor-funcoes.service';
import { CepService } from '../../../core/services/cep.service';
import { ConselhosProfissionaisService } from '../services/conselhos-profissionais.service';
import { UserStatusStyleService } from '../services/user-status-style.service';
import { Setor } from '../models/setor.model';
import { Funcao } from '../models/funcao.model';
import { FuncoesComRegistro, SetorProfissional, FUNCAO_SETOR_MAP, SETOR_CONSELHO_MAP } from '../models/conselhos-profissionais.model';

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

  // Adicionar a propriedade userStatusOptions
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

  formSubmitted = false; // Adicione esta propriedade

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
    private userStatusStyle: UserStatusStyleService
  ) { }

  ngOnInit(): void {
    this.inicializarFormulario();
    this.carregarSetores();
    
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.userId = +params['id'];
        this.carregarUsuario(this.userId);
      } else {
        this.showNotification('ID do usuário não fornecido', 'error');
        this.router.navigate(['/usuarios']);
      }
    });

    // Este subscribe já não precisa chamar carregarFuncoes diretamente
    // porque será feito no carregarUsuario
    this.usuarioForm.get('setor')?.valueChanges.subscribe(setorId => {
      if (setorId) {
        // Só carregamos funções novamente se o usuário mudar manualmente o setor
        if (!this.isLoading) { // Evita execução durante o carregamento inicial
          this.carregarFuncoes(setorId);
        }
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
        estado: ['', [Validators.required]],
        complemento: ['']
      }),
      dataAdmissao: [''],
      tipoContratacao: ['contratada', [Validators.required]],
      tipoAcesso: ['padrao', [Validators.required]],
      status: [UserStatus.ATIVO] // Usando o enum UserStatus
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

  carregarFuncoes(setorId: number): void {
    this.isLoading = true;
    this.setoresFuncoesService.getFuncoesPorSetor(setorId)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (funcoes) => {
          this.funcoes = funcoes;
          
          // Limpar os valores dependentes de função quando o setor muda
          this.usuarioForm.get('funcao')?.setValue('');
          this.usuarioForm.get('registroCategoria')?.setValue('');
          this.usuarioForm.get('especialidade')?.setValue('');
          this.mostrarConselhoProfissional = false;
          this.mostrarEspecialidade = false;

          // Subscribe to funcao valueChanges
          if (this.funcaoSubscription) {
            this.funcaoSubscription.unsubscribe();
          }
          
          this.funcaoSubscription = this.usuarioForm.get('funcao')?.valueChanges.subscribe((funcaoId: number) => {
            console.log('Função selecionada:', funcaoId);
            if (funcaoId) {
              const setor = FUNCAO_SETOR_MAP[funcaoId as FuncoesComRegistro]; // Mapear função para setor
              const conselho = SETOR_CONSELHO_MAP[setor as SetorProfissional]; // Mapear setor para conselho
              
              console.log(FUNCAO_SETOR_MAP, SETOR_CONSELHO_MAP);
              console.log('Setor encontrado:', setor);
              console.log('Conselho encontrado:', setor, conselho);
              if (conselho) {
                this.mostrarConselhoProfissional = true;
                this.labelConselhoProfissional = `Número do ${conselho}`; // Define o nome do conselho como label
                this.mostrarEspecialidade = true;

                // Tornar o campo "Registro de Conselho" obrigatório
                this.usuarioForm.get('registroCategoria')?.setValidators([Validators.required]);
              } else {
                this.mostrarConselhoProfissional = false;
                this.mostrarEspecialidade = false;
                this.usuarioForm.get('registroCategoria')?.clearValidators();
              }
              this.usuarioForm.get('registroCategoria')?.updateValueAndValidity();
            } else {
              this.mostrarConselhoProfissional = false;
              this.mostrarEspecialidade = false;
              this.usuarioForm.get('registroCategoria')?.clearValidators();
              this.usuarioForm.get('registroCategoria')?.updateValueAndValidity();
            }
          });
        },
        error: (err) => {
          this.error = 'Erro ao carregar funções';
          this.showNotification('Erro ao carregar funções', 'error');
        }
      });
  }

  consultarCep(): void {
    const cep = this.usuarioForm.get('endereco.cep')?.value;
    if (cep && cep.length >= 8) {
      this.isLoading = true;
      this.cepService.consultarCep(cep)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe({
          next: (data) => {
            if (data && !(data as any).erro) {
              this.usuarioForm.patchValue({
                endereco: {
                  rua: data.logradouro,
                  bairro: data.bairro,
                  cidade: data.localidade,
                  estado: data.uf
                }
              });
              
              // Focar no campo número após preenchimento automático
              setTimeout(() => {
                const numeroInput = document.getElementById('numero');
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

  carregarUsuario(id: number): void {
    this.isLoading = true;
    this.usuarioService.getUsuarioPorId(id)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (usuario) => {
          console.log('Dados recebidos do backend:', JSON.stringify(usuario, null, 2));
          console.log('Tipo de dados dos campos principais:');
          console.log('setor:', typeof usuario.setor, usuario.setor);
          console.log('funcao:', typeof usuario.funcao, usuario.funcao);
          
          // Mapear o tipoContratacao de volta para o formato esperado pelo frontend
          let tipoContratacaoFormatado = 'contratada'; // valor padrão
          if (usuario.tipo_contratacao) {
            switch (usuario.tipo_contratacao) {
              case 'c': tipoContratacaoFormatado = 'contratada'; break;
              case 't': tipoContratacaoFormatado = 'terceirizada'; break;
              case 'p': tipoContratacaoFormatado = 'pj'; break;
            }
          }
          
          // Primeiro vamos definir todos os outros campos
          this.usuarioForm.patchValue({
            nome: usuario.nome || '',
            email: usuario.email || '',
            cpf: usuario.cpf || '',
            telefone: usuario.telefone || '',
            // Não definimos setor e função aqui ainda
            registroCategoria: usuario.registro_categoria || '',
            especialidade: usuario.especialidade || '',
            endereco: {
              cep: usuario.cep || '',
              rua: usuario.endereco?.logradouro || usuario.endereco?.rua || '',
              numero: usuario.endereco?.numero || '',
              complemento: usuario.endereco?.complemento || '',
              bairro: usuario.endereco?.bairro || '',
              cidade: usuario.endereco?.localidade || usuario.endereco?.cidade || '',
              estado: usuario.endereco?.uf || usuario.endereco?.estado || ''
            },
            dataAdmissao: usuario.data_admissao ? this.datePipe.transform(usuario.data_admissao, 'yyyy-MM-dd') : '',
            tipoContratacao: tipoContratacaoFormatado,
            tipoAcesso: usuario.tipo_acesso || 'padrao',
            status: usuario.status || UserStatus.ATIVO
          });

          // Se tiver um setor, vamos usá-lo como base para carregar funções
          if (usuario.setor) {
            const setorId = +usuario.setor;
            
            // Primeiro definimos o setor
            this.usuarioForm.get('setor')?.setValue(setorId);
            
            // Depois carregamos as funções com base no setor, mas precisamos esperar
            // que as funções sejam carregadas antes de definir a função selecionada
            this.setoresFuncoesService.getFuncoesPorSetor(setorId)
              .subscribe({
                next: (funcoes) => {
                  this.funcoes = funcoes;
                  
                  // Agora que temos as funções, podemos definir a função no formulário
                  if (usuario.funcao) {
                    console.log('Definindo função:', usuario.funcao, 'Funções disponíveis:', this.funcoes);
                    this.usuarioForm.get('funcao')?.setValue(usuario.funcao);
                    
                    // Verificar se a função requer conselho profissional
                    const funcaoId = +usuario.funcao;
                    const funcaoSelecionada = this.funcoes.find(f => f.id === funcaoId);
                    
                    console.log('Função selecionada para conselho profissional:', funcaoSelecionada);
                    
                    if (funcaoSelecionada?.conselho_profissional) {
                      this.mostrarConselhoProfissional = true;
                      this.labelConselhoProfissional = `Número do ${funcaoSelecionada.conselho_profissional}`;
                      
                      this.usuarioForm.get('registroCategoria')?.setValidators([Validators.required]);
                      this.usuarioForm.get('registroCategoria')?.updateValueAndValidity();
                      this.mostrarEspecialidade = true;
                    }
                  }
                },
                error: (err) => {
                  console.error('Erro ao carregar funções para o setor:', err);
                  this.showNotification('Erro ao carregar funções para o setor', 'error');
                }
              });
          }

          // Após preencher o formulário, vamos mostrar os valores definidos
          setTimeout(() => {
            console.log('Valores definidos no formulário após processamento:');
            console.log('setor:', this.usuarioForm.get('setor')?.value);
            console.log('funcao:', this.usuarioForm.get('funcao')?.value);
            console.log('dataAdmissao:', this.usuarioForm.get('dataAdmissao')?.value);
            console.log('tipoContratacao:', this.usuarioForm.get('tipoContratacao')?.value);
            console.log('tipoAcesso:', this.usuarioForm.get('tipoAcesso')?.value);
            console.log('status:', this.usuarioForm.get('status')?.value);
          }, 1000);
        },
        error: (err) => {
          console.error('Erro ao carregar dados do usuário:', err);
          this.error = 'Erro ao carregar dados do usuário';
          this.showNotification('Erro ao carregar dados do usuário', 'error');
        }
      });
  }

  onSubmit(): void {
    this.formSubmitted = true; // Defina como true quando o formulário for submetido
    
    if (this.usuarioForm.invalid) {
      this.usuarioForm.markAllAsTouched();
      this.showNotification('Preencha todos os campos obrigatórios', 'warning');
      return;
    }

    if (!this.userId) {
      this.showNotification('ID do usuário não encontrado', 'error');
      return;
    }

    // Preparar os dados do usuário
    const dadosUsuario = this.prepararDadosUsuario();
    
    // Log dos dados que serão enviados ao backend
    console.log('Dados que serão enviados ao backend:', JSON.stringify(dadosUsuario, null, 2));
    
    this.isLoading = true;
    this.usuarioService.atualizarUsuario(this.userId, dadosUsuario)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response) => {
          console.log('Resposta do backend após atualização:', response);
          this.showNotification('Usuário atualizado com sucesso!', 'success');
          this.router.navigate(['/usuarios']);
        },
        error: (err) => {
          console.error('Erro ao atualizar usuário:', err);
          this.error = 'Erro ao atualizar usuário';
          this.showNotification('Erro ao atualizar usuário', 'error');
        }
      });
  }
  
  excluirUsuario(): void {
    if (!this.userId) {
      this.showNotification('ID do usuário não encontrado', 'error');
      return;
    }
    
    if (confirm('Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.')) {
      this.isLoading = true;
      this.usuarioService.excluirUsuario(this.userId)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe({
          next: () => {
            this.showNotification('Usuário excluído com sucesso!', 'success');
            this.router.navigate(['/usuarios']);
          },
          error: (err) => {
            this.error = 'Erro ao excluir usuário';
            this.showNotification('Erro ao excluir usuário', 'error');
          }
        });
    }
  }

  private prepararDadosUsuario(): any {
    const formValues = this.usuarioForm.value;
    
    // Extrair o CEP do objeto de endereço para tratá-lo separadamente
    const cep = formValues.endereco?.cep;
    const enderecoSemCep = { ...formValues.endereco };
    delete enderecoSemCep.cep;
    
    // Tratar a data de admissão - garantindo formato ISO 8601
    let dataAdmissao = formValues.dataAdmissao;
    if (dataAdmissao && typeof dataAdmissao === 'string') {
      dataAdmissao = dataAdmissao; // Manter no formato YYYY-MM-DD que é aceito pelo backend
    }
    
    // Mapear tipoContratacao para o formato esperado pelo backend
    let tipoContratacaoBackend;
    switch (formValues.tipoContratacao) {
      case 'contratada': tipoContratacaoBackend = 'c'; break;
      case 'terceirizada': tipoContratacaoBackend = 't'; break;
      case 'pj': tipoContratacaoBackend = 'p'; break;
      default: tipoContratacaoBackend = formValues.tipoContratacao;
    }
    
    // Deixar o campo status exatamente como está no formulário
    const status = formValues.status;
    
    // Usar os nomes de campo que o backend espera
    return {
      nome: formValues.nome,
      email: formValues.email,
      cpf: formValues.cpf,
      telefone: formValues.telefone,
      setor: formValues.setor,
      funcao: formValues.funcao,
      registro_categoria: formValues.registroCategoria, // Usar snake_case para o backend
      especialidade: formValues.especialidade,
      cep: cep,
      endereco: enderecoSemCep,
      data_admissao: dataAdmissao, // Usar snake_case para o backend
      tipo_contratacao: tipoContratacaoBackend, // Usar snake_case para o backend e formato correto
      tipo_acesso: formValues.tipoAcesso, // Usar snake_case para o backend
      status: status,
      ativo: status === UserStatus.ATIVO
    };
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

  shouldShowErrors(controlName: string): boolean {
    const control = this.usuarioForm.get(controlName);
    return control !== null && control.invalid && (control.touched || this.formSubmitted);
  }

  shouldShowNestedErrors(parentGroup: string, controlName: string): boolean {
    const control = this.usuarioForm.get(`${parentGroup}.${controlName}`);
    return control !== null && control.invalid && (control.touched || this.formSubmitted);
  }
}
