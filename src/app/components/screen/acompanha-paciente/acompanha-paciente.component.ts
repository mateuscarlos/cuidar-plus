import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PacienteService, Paciente } from '../../../services/paciente.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ModalConfirmacaoComponent } from '../../modal/modal-confirmacao/modal-confirmacao.component';

@Component({
  selector: 'app-acompanha-paciente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './acompanha-paciente.component.html',
  styleUrls: ['./acompanha-paciente.component.scss']
})
export class AcompanhaPacienteComponent implements OnInit {
  pacienteId?: number;
  paciente: Paciente = {
    id: 0,
    nome_completo: '',
    cpf: '',
    operadora: '',
    identificador_prestadora: '',
    acomodacao: '',
    telefone: '',
    alergias: '',
    cid_primario: '',
    cid_secundario: '',
    data_nascimento: '',
    rua: '',
    numero: '',
    complemento: '',
    cep: '',
    bairro: '',
    cidade: '',
    estado: '',
    created_at: '',
    updated_at: '',
    status: '',
  };
  novoAcompanhamento: string = '';

  constructor(private route: ActivatedRoute, private pacienteService: PacienteService, private router: Router, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.pacienteId = params['id'];
      this.carregarPaciente();
    });
  }

  carregarPaciente(): void {
    if (this.pacienteId) {
      this.pacienteService.getPacienteById(this.pacienteId).subscribe(
        (paciente: Paciente) => {
          this.paciente = paciente;
        },
        (error) => {
          console.error('Erro ao carregar paciente:', error);
        }
      );
    }
  }

  editarPaciente(): void {
    this.router.navigate(['/cadastro-pacientes', this.paciente.id]);
  }

  confirmarExclusao(): void {
    const dialogRef = this.dialog.open(ModalConfirmacaoComponent, {
      width: '300px',
      data: { mensagem: 'Tem certeza que deseja excluir este paciente?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.excluirPaciente();
      }
    });
  }

  excluirPaciente(): void {
    this.pacienteService.deletarPaciente(this.paciente.cpf).subscribe(
      () => {
        console.log('Paciente excluído com sucesso');
        this.router.navigate(['/pacientes']);
      },
      (error) => {
        console.error('Erro ao excluir paciente:', error);
      }
    );
  }

  adicionarAcompanhamento(): void {
    if (this.novoAcompanhamento.trim()) {
      const acompanhamento = {
        pacienteId: this.paciente.id,
        descricao: this.novoAcompanhamento,
        data: new Date()
      };

      this.pacienteService.adicionarAcompanhamento(acompanhamento).subscribe(
        () => {
          console.log('Acompanhamento adicionado com sucesso');
          this.novoAcompanhamento = '';
          this.carregarPaciente();
        },
        (error) => {
          console.error('Erro ao adicionar acompanhamento:', error);
        }
      );
    }
  }
}