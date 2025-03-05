import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../models/usuario.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule], // Importe o CommonModule
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  ngOnInit(): void {
    this.carregarUsuarios();
  }

  carregarUsuarios(): void {
    this.usuarioService.getUsuarios().subscribe(
      (data) => {
        console.log('Dados recebidos:', data); // Depuração
        if (data.usuarios && Array.isArray(data.usuarios)) {
          this.usuarios = data.usuarios; // Acessa a propriedade "usuarios" do objeto
        } else {
          console.error('Formato de dados inválido:', data);
        }
      },
      (error) => {
        console.error('Erro ao carregar usuários:', error);
      }
    );
  }

  navegarPara(caminho: string): void {
    this.router.navigate([caminho]);
  }

  removerUsuario(cpf: string): void {
    if (confirm('Tem certeza que deseja remover este usuário?')) {
      this.usuarioService.deletarUsuario(cpf).subscribe(
        () => {
          this.usuarios = this.usuarios.filter((usuario) => usuario.cpf !== cpf); // Atualiza a lista
        },
        (error) => {
          console.error('Erro ao remover usuário:', error);
        }
      );
    }
  }
}