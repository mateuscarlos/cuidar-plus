import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule, DatePipe } from '@angular/common';

import { UsuarioService } from '../services/usuario.service';
import { SetoresFuncoesService } from '../services/setor-funcoes.service';
import { CepService } from '../../../core/services/cep.service';
import { User, Endereco } from '../models/user.model';
import { Funcao } from '../models/funcao.model';
import { Setor } from '../models/setor.model';

@Component({
  selector: 'app-cadastrar-usuario',
  templateUrl: './cadastrar-usuario.component.html',
  styleUrls: ['./cadastrar-usuario.component.scss'],
  imports: [ReactiveFormsModule, CommonModule],
  providers: [DatePipe], // Add DatePipe to providers
  standalone: true,
})
export class CadastrarUsuarioComponent implements OnInit {
  usuarioForm!: FormGroup;
  setores: Setor[] = [];
  funcoes: Funcao[] = [];
  isLoading = false;
  error: string | null = null;
  modoEdicao = false;
  userId?: number;
  
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
    private datePipe: DatePipe
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
      registroCategoria: [''],
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
      status: ['ativo']
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
          this.funcoes = funcoes.map(f => ({
            ...f,
            tipo_contratacao: f.tipo_contratacao as any
          }));
          
          // Reset função selecionada
          this.usuarioForm.get('funcao')?.setValue('');
          
          // Verificar se deve mostrar o campo de conselho profissional
          this.usuarioForm.get('funcao')?.valueChanges.subscribe(funcaoId => {
            if (funcaoId) {
              const funcaoSelecionada = this.funcoes.find(f => f.id === funcaoId);
              if (funcaoSelecionada && funcaoSelecionada.conselho_profissional) {
                this.mostrarConselhoProfissional = true;
                this.labelConselhoProfissional = `Digite o ${funcaoSelecionada.conselho_profissional}`;
              } else {
                this.mostrarConselhoProfissional = false;
              }
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
    if (cep && cep.length === 8) {
      this.isLoading = true;
      this.cepService.consultarCep(cep)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe({
          next: (endereco) => {
            if (endereco) {
              this.usuarioForm.patchValue({
                endereco: {
                  rua: endereco.logradouro || endereco.logradouro,
                  bairro: endereco.bairro,
                  cidade: endereco.localidade || endereco.localidade,
                  estado: endereco.uf || endereco.estado
                }
              });
            } else {
              this.showNotification('CEP não encontrado', 'warning');
            }
          },
          error: () => {
            this.showNotification('Erro ao consultar CEP', 'error');
          }
        });
    }
  }

  carregarUsuario(id: number): void {
    this.isLoading = true;
    this.usuarioService.obterPorId(id.toString())
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (usuario: any) => {
          if (usuario) {
            // Garantir que o endereço seja um objeto válido
            if (usuario.endereco && typeof usuario.endereco === 'string') {
              try {
                usuario.endereco = JSON.parse(usuario.endereco);
              } catch (e) {
                console.error('Erro ao desserializar o endereço:', e);
                usuario.endereco = {
                  rua: '',
                  numero: '',
                  bairro: '',
                  cidade: '',
                  estado: '',
                  cep: ''
                };
              }
            }

            // Formatar a data de admissão para o formato esperado pelo input date
            if (usuario.dataAdmissao) {
              const dataFormatada = this.datePipe.transform(usuario.dataAdmissao, 'yyyy-MM-dd');
              usuario.dataAdmissao = dataFormatada ? new Date(dataFormatada) : undefined;
            }

            // Preencher o formulário com os dados do usuário
            this.usuarioForm.patchValue({
              nome: usuario.nome,
              email: usuario.email,
              cpf: usuario.cpf,
              telefone: usuario.telefone || '',
              setor: usuario.setor,
              funcao: usuario.funcao,
              registroCategoria: usuario.registroCategoria || '',
              especialidade: usuario.especialidade || '',
              endereco: {
                cep: usuario.endereco?.cep || '',
                rua: usuario.endereco?.rua || '',
                numero: usuario.endereco?.numero || '',
                bairro: usuario.endereco?.bairro || '',
                cidade: usuario.endereco?.cidade || '',
                estado: usuario.endereco?.estado || ''
              },
              dataAdmissao: usuario.dataAdmissao,
              tipoContratacao: usuario.tipoContratacao || 'contratada',
              tipoAcesso: usuario.tipoAcesso || 'padrao',
              status: usuario.status || 'ativo'
            });

            // Carregar as funções depois de definir o setor
            if (usuario.setor) {
              const setorId = +usuario.setor;
              this.carregarFuncoes(setorId);
            }
          } else {
            this.error = 'Usuário não encontrado';
            this.showNotification('Usuário não encontrado', 'error');
          }
        },
        error: (err) => {
          this.error = 'Erro ao carregar dados do usuário';
          this.showNotification('Erro ao carregar dados do usuário', 'error');
        }
      });
  }

  onSubmit(): void {
    if (this.usuarioForm.invalid) {
      this.usuarioForm.markAllAsTouched();
      this.showNotification('Preencha todos os campos obrigatórios', 'warning');
      return;
    }

    const usuarioData = this.prepararDadosUsuario();
    this.isLoading = true;

    if (this.modoEdicao && this.userId) {
      this.usuarioService.atualizar(this.userId.toString(), usuarioData)
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
      this.usuarioService.criar(usuarioData)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe({
          next: () => {
            this.showNotification('Usuário cadastrado com sucesso', 'success');
            this.router.navigate(['/usuarios']);
          },
          error: (err) => {
            this.error = 'Erro ao cadastrar usuário';
            this.showNotification('Erro ao cadastrar usuário', 'error');
          }
        });
    }
  }

  private prepararDadosUsuario(): any {
    const formValues = this.usuarioForm.value;
    
    // Converter a data de string para objeto Date
    let dataAdmissao = formValues.dataAdmissao;
    if (dataAdmissao && typeof dataAdmissao === 'string') {
      dataAdmissao = new Date(dataAdmissao);
    }

    // Preparar o endereço para serialização se necessário
    const endereco = formValues.endereco;

    return {
      id: this.userId?.toString(),
      nome: formValues.nome,
      email: formValues.email,
      cpf: formValues.cpf,
      telefone: formValues.telefone,
      setor: formValues.setor,
      funcao: formValues.funcao,
      registroCategoria: formValues.registroCategoria,
      especialidade: formValues.especialidade,
      endereco: endereco,
      dataAdmissao: dataAdmissao,
      tipoContratacao: formValues.tipoContratacao,
      tipoAcesso: formValues.tipoAcesso,
      status: formValues.status,
      ativo: formValues.status === 'ativo'
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
}