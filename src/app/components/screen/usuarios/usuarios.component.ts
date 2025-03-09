import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService, Usuario } from '../../../services/usuario.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ModalPesquisaUsuarioComponent } from '../../modal/modal-pesquisa-usuario/modal-pesquisa-usuario.component';
import { ModalConfirmacaoComponent } from '../../modal/modal-confirmacao/modal-confirmacao.component';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent {
  usuarios: Usuario[] = [];
  mensagemBusca: string = 'Nenhum usuário encontrado.';

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.listarUsuarios();
  }

  navegarPara(pagina: string): void {
    this.router.navigate([pagina]);
  }

  abrirModalBusca(): void {
    const dialogRef = this.dialog.open(ModalPesquisaUsuarioComponent, {
      width: '50%'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.usuarios = [result];
      }
    });
  }

  listarUsuarios(): void {
    this.usuarioService.listarUsuarios().subscribe(
      (data) => {
        this.usuarios = data;
      },
      (error) => {
        console.error('Erro ao listar usuários:', error);
      }
    );
  }

  editarUsuario(cpf: string): void {
    this.router.navigate(['/cadastro-usuarios', { cpf }]);
  }

  confirmarRemocao(cpf: string): void {
    const dialogRef = this.dialog.open(ModalConfirmacaoComponent, {
      width: '30%',
      data: { mensagem: 'Tem certeza que deseja excluir este usuário?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.removerUsuario(cpf);
      }
    });
  }

  removerUsuario(cpf: string): void {
    this.usuarioService.deletarUsuario(cpf).subscribe(
      () => {
        this.listarUsuarios();
      },
      (error) => {
        console.error('Erro ao remover usuário:', error);
      }
    );
  }
}