import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [CommonModule, NgbModule],
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.scss']
})
export class PacientesComponent {
  // Aqui poderemos adicionar lógica para carregar e manipular pacientes posteriormente
}
