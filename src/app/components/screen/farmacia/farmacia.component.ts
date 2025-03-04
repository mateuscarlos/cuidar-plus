import { Component, OnInit } from '@angular/core';
import { FarmaciaService, Insumo } from '../../../services/farmacia.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-farmacia',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2 class="text-center mb-4">Bem-vindo à Gestão de Farmácia</h2>
    <section class="row justify-content-center text-center">
      <article class="col-md-6 col-lg-4 mb-4">
        <div class="card h-100 shadow">
          <header class="card-header">
            <h2 class="card-title text-success">Cadastro de Insumos</h2>
          </header>
          <div class="card-body">
            <p class="card-text">Realize o cadastro de novos insumos no sistema.</p>
            <button class="btn btn-success" (click)="navegarPara('cadastro-insumos')">Acessar</button>
          </div>
        </div>
      </article>
      <h2 class="text-center mt-5">Lista de Insumos</h2>
      <table id="tabela-insumos" class="table table-striped">
        <tr *ngFor="let insumo of insumos">
          <td>{{ insumo.nome }}</td>
          <td>{{ insumo.quantidade }}</td>
          <td>{{ insumo.categoria }}</td>
          <td>{{ insumo.fornecedor }}</td>
          <td><button class="btn btn-danger" (click)="removerInsumo(insumo.id)">Excluir</button></td>
        </tr>
      </table>
    </section>
    <div class="d-flex justify-content-center mt-4">
      <button class="btn btn-primary" (click)="navegarPara('home')">Voltar à Página Inicial</button>
    </div>
  `,
  styleUrls: ['./farmacia.component.scss']
})
export class FarmaciaComponent implements OnInit {
  insumos: Insumo[] = [];

  constructor(private farmaciaService: FarmaciaService) {}

  ngOnInit(): void {
    this.carregarInsumos();
  }

  carregarInsumos(): void {
    this.farmaciaService.getInsumos().subscribe(
      (data) => {
        this.insumos = data;
      },
      (error) => {
        console.error('Erro ao carregar insumos:', error);
      }
    );
  }

  removerInsumo(id: number): void {
    this.farmaciaService.deletarInsumo(id).subscribe(
      () => {
        alert('Insumo removido com sucesso!');
        this.carregarInsumos();
      },
      (error) => {
        console.error('Erro ao remover insumo:', error);
      }
    );
  }

  navegarPara(pagina: string): void {
    // Implemente a navegação para a página especificada
  }
}