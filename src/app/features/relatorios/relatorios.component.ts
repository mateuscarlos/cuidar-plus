import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-relatorios',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './relatorios.component.html',
  styleUrls: ['./relatorios.component.scss']
})
export class RelatoriosComponent {
  expectedReports = [
    'Desempenho de atendimentos',
    'Métricas de pacientes',
    'Análise de prescrições',
    'Controle de estoque',
    'Indicadores financeiros',
    'Visualização de dados avançada'
  ];
}
