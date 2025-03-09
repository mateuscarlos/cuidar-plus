import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UsuarioService, Usuario } from '../../../services/usuario.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-pesquisa-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-pesquisa-usuario.component.html',
  styleUrls: ['./modal-pesquisa-usuario.component.scss']
})
export class ModalPesquisaUsuarioComponent {
  nome: string = '';
  usuarios: Usuario[] = [];

  constructor(
    private dialogRef: MatDialogRef<ModalPesquisaUsuarioComponent>,
    private usuarioService: UsuarioService
  ) {}

  pesquisar(): void {
    this.usuarioService.listarUsuarios().subscribe(
      (usuarios) => {
        this.usuarios = usuarios.filter(u => u.nome.includes(this.nome));
      },
      (error: any): void => {
        console.error('Erro ao buscar usuários:', error);
      }
    );
  }

  selecionarUsuario(usuario: Usuario): void {
    this.dialogRef.close(usuario);
  }

  fechar(): void {
    this.dialogRef.close();
  }
}
