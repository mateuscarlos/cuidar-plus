import { Component } from '@angular/core';
import { UsuarioService } from '../../../services/usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro-usuarios',
  standalone: true,
  template: `
    <form (ngSubmit)="cadastrarUsuario()" class="form-user p-4 shadow rounded">
      <div class="mb-3">
        <label for="nome" class="form-label">Nome Completo</label>
        <input type="text" id="nome" class="form-control" placeholder="Digite o nome completo" required>
      </div>
      <div class="mb-3">
        <label for="cpf" class="form-label">CPF</label>
        <input type="text" id="cpf" class="form-control" placeholder="Digite o CPF" required>
      </div>
      <div class="mb-3">
        <label for="endereco" class="form-label">Endereço</label>
        <input type="text" id="endereco" class="form-control" placeholder="Digite o endereço completo">
      </div>
      <div class="mb-3">
        <label for="setor" class="form-label">Setor</label>
        <select id="setor" class="form-select" required>
          <option selected>Selecione...</option>
          <option value="Operacao">Operação</option>
          <option value="Farmacia">Farmácia</option>
          <option value="Administrativo">Administrativo</option>
          <option value="Auditoria">Auditoria</option>
          <option value="Gestao">Gestão</option>
        </select>
      </div>
      <div class="mb-3">
        <label for="funcao" class="form-label">Função</label>
        <select id="funcao" class="form-select" required>
          <option selected>Selecione...</option>
        </select>
      </div>
      <div class="mb-3 d-none" id="campo-especialidade">
        <label for="especialidade" class="form-label">Especialidade</label>
        <input type="text" id="especialidade" class="form-control" placeholder="Digite a especialidade">
      </div>
      <div class="mb-3" id="campo-registro-categoria">
        <label for="registro" class="form-label">Número de Registro de Categoria</label>
        <input type="text" id="registro" class="form-control" placeholder="Digite o número de registro">
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
  constructor(private usuarioService: UsuarioService, private router: Router) {}

  cadastrarUsuario(): void {
    const usuario = {
      nome: (document.getElementById('nome') as HTMLInputElement).value,
      cpf: (document.getElementById('cpf') as HTMLInputElement).value,
      endereco: (document.getElementById('endereco') as HTMLInputElement).value,
      setor: (document.getElementById('setor') as HTMLSelectElement).value,
      funcao: (document.getElementById('funcao') as HTMLSelectElement).value,
      especialidade: (document.getElementById('especialidade') as HTMLInputElement).value || '',
      registro_categoria: (document.getElementById('registro') as HTMLInputElement).value || ''
    };

    this.usuarioService.criarUsuario(usuario).subscribe(
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