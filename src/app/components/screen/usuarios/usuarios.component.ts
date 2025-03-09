import { Component, OnInit } from '@angular/core';
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
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  mensagemBusca: string = 'Nenhum usuário encontrado.';

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.carregarUsuarios();
  }

  carregarUsuarios(): void {
    this.usuarioService.listarUsuarios().subscribe(
      (usuarios) => {
        this.usuarios = usuarios;
      },
      (error) => {
        console.error('Erro ao carregar usuários:', error);
      }
    );
  }

  editarUsuario(cpf: string): void {
    this.router.navigate(['/cadastro-usuarios', cpf]);
  }

  confirmarRemocao(cpf: string): void {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      this.usuarioService.deletarUsuario(cpf).subscribe(
        () => {
          alert('Usuário excluído com sucesso!');
          this.carregarUsuarios();
        },
        (error) => {
          console.error('Erro ao excluir usuário:', error);
        }
      );
    }
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

  navegarPara(pagina: string): void {
    this.router.navigate([pagina]);
  }
}