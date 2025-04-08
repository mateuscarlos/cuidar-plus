import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';
import { UsuarioRoutesService } from '../services/usuario-routes.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-usuarios-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './usuarios-list.component.html',
  styleUrls: ['./usuarios-list.component.scss']
})
export class UsuariosListComponent implements OnInit {
  usuarios: any[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(
    private usuarioService: UsuarioService,
    private usuarioRoutes: UsuarioRoutesService
  ) { }

  ngOnInit(): void {
    this.carregarUsuarios();
  }

  carregarUsuarios(): void {
    this.isLoading = true;
    this.error = null;

    this.usuarioService.listarTodos()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (data) => {
          this.usuarios = data;
        },
        error: (err) => {
          this.error = 'Erro ao carregar os usuários';
          console.error('Erro:', err);
        }
      });
  }

  navegarParaCadastro(): void {
    this.usuarioRoutes.navegarParaCadastro();
  }

  navegarParaEdicao(id: string): void {
    this.usuarioRoutes.navegarParaEdicao(id);
  }

  navegarParaVisualizacao(id: string): void {
    this.usuarioRoutes.navegarParaVisualizacao(id);
  }
}