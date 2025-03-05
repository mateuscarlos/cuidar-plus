import { Component } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-busca-paciente',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './modal-busca-paciente.component.html',
  styleUrls: ['./modal-busca-paciente.component.scss']
})
export class ModalBuscaPacienteComponent {
  constructor(public dialogRef: MatDialogRef<ModalBuscaPacienteComponent>) {}

  onClose(): void {
    this.dialogRef.close();
  }
}