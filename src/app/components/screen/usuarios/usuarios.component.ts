import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../services/usuario.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // Importe o Router

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2 class="text-center mb-4">Bem-vindo à Gestão de Usuários</h2>
    <section class="row justify-content-center text-center">
      <article class="col-md-6 col-lg-4 mb-4">
        <div class="card h-100 shadow">
          <header class="card-header">
            <h2 class="card-title text-primary">Cadastro de Usuários</h2>
          </header>
          <div class="card-body">
            <p class="card-text">Realize o cadastro de novos usuários no sistema.</p>
            <button class="btn btn-primary" (click)="navegarPara('cadastro-usuarios')">Acessar</button>
          </div>
        </div>
      </article>
      <h2 class="text-center mt-5">Lista de Usuários</h2>
      <table id="tabela-usuarios" class="table table-striped">
        <tr *ngFor="let usuario of usuarios">
          <td>{{ usuario.nome }}</td>
          <td>{{ usuario.cpf }}</td>
          <td>{{ usuario.setor }}</td>
          <td>{{ usuario.funcao }}</td>
          <td><button class="btn btn-danger" (click)="removerUsuario(usuario.cpf)">Excluir</button></td>
        </tr>
      </table>
    </section>
    <div class="d-flex justify-content-center mt-4">
      <button class="btn btn-primary" (click)="navegarPara('home')">Voltar à Página Inicial</button>
    </div>
  `,
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {
  usuarios: any[] = [];

  constructor(
    private usuarioService: UsuarioService,
    private router: Router // Injete o Router
  ) {}

  ngOnInit(): void {
    this.carregarUsuarios();
  }

  carregarUsuarios(): void {
    this.usuarioService.getUsuarios().subscribe(
      (data) => {
        this.usuarios = data;
      },
      (error) => {
        console.error('Erro ao carregar usuários:', error);
      }
    );
  }

  removerUsuario(cpf: string): void {
    this.usuarioService.deletarUsuario(cpf).subscribe(
      () => {
        alert('Usuário removido com sucesso!');
        this.carregarUsuarios();
      },
      (error) => {
        console.error('Erro ao remover usuário:', error);
      }
    );
  }

  // Método para navegar entre as páginas
  navegarPara(pagina: string): void {
    this.router.navigate([pagina]);
  }
}