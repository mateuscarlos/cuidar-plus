import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../../services/usuario.service';
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
  template: `
    <form (ngSubmit)="cadastrarUsuario()" class="form-user p-4 shadow rounded">
      <div class="mb-3">
        <label for="nome" class="form-label">Nome Completo</label>
        <input type="text" id="nome" class="form-control" [(ngModel)]="usuario.nome" name="nome" required>
      </div>
      <div class="mb-3">
        <label for="cpf" class="form-label">CPF</label>
        <input type="text" id="cpf" class="form-control" [(ngModel)]="usuario.cpf" name="cpf" required>
      </div>
      <div class="mb-3">
        <label for="endereco" class="form-label">Endereço</label>
        <input type="text" id="endereco" class="form-control" [(ngModel)]="usuario.endereco" name="endereco">
      </div>
      <div class="mb-3">
        <label for="setor" class="form-label">Setor</label>
        <select id="setor" class="form-select" [(ngModel)]="usuario.setor" name="setor" (change)="carregarFuncoes()" required>
          <option value="">Selecione...</option>
          <option *ngFor="let setor of setores" [value]="setor">{{ setor }}</option>
        </select>
      </div>
      <div class="mb-3">
        <label for="funcao" class="form-label">Função</label>
        <select id="funcao" class="form-select" [(ngModel)]="usuario.funcao" name="funcao" (change)="verificarCamposEspeciais()" required>
          <option value="">Selecione...</option>
          <option *ngFor="let funcao of funcoes" [value]="funcao">{{ funcao }}</option>
        </select>
      </div>
      <div class="mb-3" *ngIf="exibirEspecialidade">
        <label for="especialidade" class="form-label">Especialidade</label>
        <input type="text" id="especialidade" class="form-control" [(ngModel)]="usuario.especialidade" name="especialidade">
      </div>
      <div class="mb-3" *ngIf="exibirRegistroCategoria">
        <label for="registro" class="form-label">Número de Registro da Categoria</label>
        <input type="text" id="registro" class="form-control" [(ngModel)]="usuario.registroCategoria" name="registro">
      </div>
      <div class="text-center">
        <button type="submit" class="btn btn-primary">Salvar</button>
        <button type="reset" class="btn btn-secondary">Cancelar</button>
      </div>
    </form>
    <button class="btn btn-secondary mt-4" (click)="navegarPara('usuarios')">Voltar</button>
  `,
  styleUrls: ['./cadastro-usuarios.component.scss']
})
export class CadastroUsuariosComponent {
  FUNCOES_POR_SETOR = FUNCOES_POR_SETOR;
  setores: Setor[] = Object.keys(FUNCOES_POR_SETOR) as Setor[]; // Armazena as chaves do objeto
  funcoes: string[] = [];
  exibirEspecialidade = false;
  exibirRegistroCategoria = false;

  usuario = {
    nome: '',
    cpf: '',
    endereco: '',
    setor: '' as Setor,
    funcao: '',
    especialidade: '',
    registroCategoria: ''
  };

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  carregarFuncoes(): void {
    const setorSelecionado = this.usuario.setor;
    this.funcoes = this.FUNCOES_POR_SETOR[setorSelecionado] || [];
    this.usuario.funcao = ''; // Limpa a função selecionada ao mudar o setor
    this.verificarCamposEspeciais(); // Verifica os campos especiais
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

  cadastrarUsuario(): void {
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

  navegarPara(pagina: string): void {
    this.router.navigate([pagina]);
  }
}