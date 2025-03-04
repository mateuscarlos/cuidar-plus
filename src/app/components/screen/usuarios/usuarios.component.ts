import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../services/usuario.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {
  usuarios: any[] = []; // Variável para armazenar a lista de usuários

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarUsuarios(); // Carrega os usuários ao inicializar o componente
  }

  // Método para carregar a lista de usuários
  carregarUsuarios(): void {
    this.usuarioService.getUsuarios().subscribe(
      (data) => {
        this.usuarios = data; // Atribui diretamente o array de usuários
      },
      (error) => {
        console.error('Erro ao carregar usuários:', error);
      }
    );
  }

  // Método para remover um usuário
  removerUsuario(cpf: string): void {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      this.usuarioService.deletarUsuario(cpf).subscribe(
        () => {
          alert('Usuário removido com sucesso!');
          this.carregarUsuarios(); // Recarrega a lista após a remoção
        },
        (error) => {
          console.error('Erro ao remover usuário:', error);
        }
      );
    }
  }

  // Método para navegar para a página de cadastro de usuários
  navegarPara(pagina: string): void {
    this.router.navigate([pagina]);
  }
}