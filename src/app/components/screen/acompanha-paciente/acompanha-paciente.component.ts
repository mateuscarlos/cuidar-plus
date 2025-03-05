import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-acompanha-paciente',
  templateUrl: './acompanha-paciente.component.html',
  styleUrls: ['./acompanha-paciente.component.scss']
})
export class AcompanhaPacienteComponent implements OnInit {
  pacienteId?: number; // Marca a propriedade como opcional

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.pacienteId = +id;
    }
    // Aqui você pode adicionar a lógica para buscar os dados do paciente pelo ID
  }
}