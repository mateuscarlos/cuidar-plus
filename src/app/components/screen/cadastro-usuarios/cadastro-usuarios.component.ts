import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UsuarioService, Usuario } from '../../../services/usuario.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

const FUNCOES_POR_SETOR = {
  Operacao: [
    "Auxiliar Administrativo",
    "Técnico de Enfermagem Atendimento",
    "Técnico de Enfermagem Plantonista",
    "Enfermeiro Atendimento (Case)",
    "Enfermeiro Plantonista",
    "Enfermeiro Visitador",
    "Enfermeiro Gestor de Escala",
    "Enfermeiro Especialista",
    "Fisioterapeuta",
    "Nutricionista",
    "Fonoaudiólogo",
    "Assistente Social",
    "Médico Visitador",
    "Médico Plantonista",
    "Médico Paliativista",
    "Médico Especialista",
    "Motorista"
  ],
  Farmacia: [
    "Auxiliar Administrativo",
    "Auxiliar de Farmácia",
    "Gestor de Insumos",
    "Farmacêutico"
  ],
  Administrativo: [
    "Recepcionista",
    "Assistente Administrativo",
    "Assistente de Recursos Humanos",
    "Assistente de Compras",
    "Assistente de Contabilidade",
    "Analista de Recursos Humanos",
    "Analista de Contabilidade",
    "Analista de Compras",
    "Assistente de Departamento Pessoal",
    "Analista de Departamento Pessoal",
    "Analista Financeiro"
  ],
  Auditoria: [
    "Enfermeiro Auditor Interno",
    "Enfermeiro Auditor Externo",
    "Médico Auditor Interno",
    "Médico Auditor Externo",
    "Assistente de Recurso de Glosa"
  ],
  Gestao: [
    "Gerente de Operações",
    "Gerente Administrativo",
    "Gerente de Auditoria",
    "Coordenador de Enfermagem",
    "Coordenador de Medicina",
    "Coordenador de Farmácia",
    "Coordenador de Recursos Humanos e Departamento Pessoal",
    "Coordenador Financeiro"
  ]
};

type Setor = keyof typeof FUNCOES_POR_SETOR;

@Component({
  selector: 'app-cadastro-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cadastro-usuarios.component.html',
  styleUrls: ['./cadastro-usuarios.component.scss']
})
export class CadastroUsuariosComponent implements OnInit {
  FUNCOES_POR_SETOR = FUNCOES_POR_SETOR;
  setores: Setor[] = Object.keys(FUNCOES_POR_SETOR) as Setor[];
  funcoes: string[] = [];
  exibirEspecialidade = false;
  exibirRegistroCategoria = false;

  usuario: Usuario = {
    nome: '',
    cpf: '',
    endereco: '',
    setor: '' as Setor,
    funcao: '',
    especialidade: '',
    registroCategoria: ''
  };

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const cpf = this.route.snapshot.paramMap.get('cpf');
    if (cpf) {
      this.usuarioService.listarUsuarios().subscribe(
        (usuarios) => {
          const usuario = usuarios.find(u => u.cpf === cpf);
          if (usuario) {
            this.usuario = {
              ...usuario,
              setor: usuario.setor as Setor,
              especialidade: usuario.especialidade || '',
              registroCategoria: usuario.registroCategoria || ''
            };
            this.carregarFuncoes();
            this.verificarCamposEspeciais();
          }
        },
        (error) => {
          console.error('Erro ao carregar usuário:', error);
        }
      );
    }
  }

  carregarFuncoes(): void {
    const setorSelecionado = this.usuario.setor as Setor;
    this.funcoes = this.FUNCOES_POR_SETOR[setorSelecionado] || [];
    this.usuario.funcao = '';
    this.verificarCamposEspeciais();
  }

  verificarCamposEspeciais(): void {
    // Exibe o campo de especialidade para Enfermeiro Especialista e Médico Especialista
    this.exibirEspecialidade = ['Enfermeiro Especialista', 'Médico Especialista'].includes(this.usuario.funcao);

    // Exibe o campo de registro da categoria para as funções especificadas
    const funcoesComRegistro = [
      "Técnico de Enfermagem Atendimento", "Técnico de Enfermagem Plantonista", "Enfermeiro Atendimento (Case)",
      "Enfermeiro Plantonista", "Enfermeiro Visitador", "Enfermeiro Gestor de Escala", "Enfermeiro Especialista",
      "Fisioterapeuta", "Nutricionista", "Fonoaudiólogo", "Assistente Social", "Médico Visitador", "Médico Plantonista",
      "Médico Paliativista", "Médico Especialista", "Gestor de Insumos", "Farmacêutico", "Enfermeiro Auditor Interno",
      "Enfermeiro Auditor Externo", "Médico Auditor Interno", "Médico Auditor Externo", "Coordenador de Enfermagem",
      "Coordenador de Medicina", "Coordenador de Farmácia"
    ];
    this.exibirRegistroCategoria = funcoesComRegistro.includes(this.usuario.funcao);
  }

  verificarUsuarioExistente(cpf: string): void {
    this.usuarioService.listarUsuarios().subscribe(
      (usuarios) => {
        const usuarioExistente = usuarios.find(u => u.cpf === cpf);
        if (usuarioExistente) {
          if (confirm('Usuário já existe. Deseja atualizar as informações?')) {
            this.atualizarUsuario();
          }
        } else {
          this.criarUsuario();
        }
      },
      (error) => {
        console.error('Erro ao verificar usuário:', error);
      }
    );
  }

  cadastrarUsuario(): void {
    if (this.usuario.cpf) {
      this.verificarUsuarioExistente(this.usuario.cpf);
    } else {
      this.criarUsuario();
    }
  }

  criarUsuario(): void {
    this.usuarioService.criarUsuario(this.usuario).subscribe(
      () => {
        alert('Usuário cadastrado com sucesso!');
        this.router.navigate(['/usuarios']);
      },
      (error) => {
        console.error('Erro ao cadastrar usuário:', error);
      }
    );
  }

  atualizarUsuario(): void {
    this.usuarioService.atualizarUsuario(this.usuario.cpf, this.usuario).subscribe(
      () => {
        alert('Usuário atualizado com sucesso!');
        this.router.navigate(['/usuarios']);
      },
      (error) => {
        console.error('Erro ao atualizar usuário:', error);
      }
    );
  }

  navegarPara(pagina: string): void {
    this.router.navigate([pagina]);
  }
}