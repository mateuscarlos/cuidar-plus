import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-farmacia',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './farmacia.component.html',
  styleUrls: ['./farmacia.component.scss']
})
export class FarmaciaComponent {
  expectedFeatures = [
    'Cadastro de medicamentos',
    'Controle de estoque',
    'Prescrições eletrônicas',
    'Gerenciamento de fornecedores',
    'Alertas de medicamentos vencidos',
    'Histórico de dispensação'
  ];
}
