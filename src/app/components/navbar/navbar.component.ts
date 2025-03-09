import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ModalBuscaPacienteComponent } from '../modal/modal-busca-paciente/modal-busca-paciente.component';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  constructor(private router: Router, public dialog: MatDialog) {}

  navegarPara(pagina: string): void {
    this.router.navigate([pagina]);
  }

  abrirModalBusca(): void {
    const dialogRef = this.dialog.open(ModalBuscaPacienteComponent, {
      width: '50%' // Ajuste o tamanho do modal conforme necessário
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Paciente encontrado:', result);
        // Atualizar a lista de pacientes com o resultado da busca
      } else {
        console.log('O modal de busca foi fechado sem resultado');
      }
    });
  }
}