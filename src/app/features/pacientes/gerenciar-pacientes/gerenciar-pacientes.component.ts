import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BuscaPacienteComponent } from '../busca-paciente/busca-paciente.component';
import { PacienteFormComponent } from '../paciente-form/paciente-form.component';
import { PacienteService } from '../services/paciente.service';
import { NotificacaoService } from '../../../shared/services/notificacao.service';
import { Paciente } from '../models/paciente.model';
import { ResultadoBusca } from '../models/busca-paciente.model';
import { finalize } from 'rxjs/operators';
import { DateFormatterService } from '../../../core/services/date-formatter.service';

@Component({
  selector: 'app-gerenciar-pacientes',
  standalone: true,
  imports: [CommonModule, BuscaPacienteComponent, PacienteFormComponent],
  templateUrl: './gerenciar-pacientes.component.html',
  styleUrls: ['./gerenciar-pacientes.component.scss']
})
export class GerenciarPacientesComponent implements OnInit {
  pacienteSelecionado: Paciente | null = null;
  isLoading = false;
  mostrarModal = false;
  
  @ViewChild('pacienteForm') pacienteForm!: PacienteFormComponent;

  constructor(
    private pacienteService: PacienteService,
    private notificacaoService: NotificacaoService,
    private router: Router,
    private dataFormatter: DateFormatterService
  ) { }

  ngOnInit(): void {
  }

  // Método chamado quando o componente de busca retorna resultados
  buscarPaciente(resultado: ResultadoBusca): void {
    // Apenas armazena o resultado para uso dos outros componentes
    // Não é mais necessário gerenciar a lista de pacientes aqui
  }

  // Método chamado quando o usuário seleciona um paciente para edição no componente de busca
  selecionarPacienteParaEdicao(paciente: Paciente): void {
    this.isLoading = true;
    
    // Buscar os detalhes completos do paciente pelo ID
    this.pacienteService.obterPacientePorId(String(paciente.id)).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (pacienteCompleto) => {
        // Verificar se todas as propriedades necessárias estão presentes
        if (pacienteCompleto) {
          // Garantir que a data de nascimento esteja no formato correto para o formulário
          if (pacienteCompleto.dataNascimento) {
            pacienteCompleto.dataNascimento = new Date(pacienteCompleto.dataNascimento)
              .toISOString().substring(0, 10);
          }
          
          // Log para depuração
          console.log('Dados completos do paciente carregados:', pacienteCompleto);
        }
        
        this.pacienteSelecionado = pacienteCompleto;
      },
      error: (erro) => {
        console.error('Erro ao obter detalhes do paciente:', erro);
        this.notificacaoService.mostrarErro('Erro ao carregar dados do paciente. Por favor, tente novamente.');
      }
    });
  }

  // Método para navegar para a visualização de paciente
  visualizarPaciente(paciente: Paciente): void {
    this.router.navigate(['/pacientes/visualizar'], {
      queryParams: { pacienteId: paciente.id }
    });
  }

  cancelarEdicao(): void {
    this.pacienteSelecionado = null;
  }

  salvarAlteracoes(): void {
    if (!this.pacienteForm || !this.pacienteSelecionado) {
      return;
    }
    
    // Trigger a validação do formulário interno
    if (this.pacienteForm.validarFormulario()) {
      const dadosPaciente = this.pacienteForm.prepareFormData();
      this.isLoading = true;

      this.pacienteService.atualizarPaciente(String(this.pacienteSelecionado.id), dadosPaciente).pipe(
        finalize(() => this.isLoading = false)
      ).subscribe({
        next: (pacienteAtualizado) => {
          this.notificacaoService.mostrarSucesso('Paciente atualizado com sucesso!');
          this.pacienteSelecionado = pacienteAtualizado;
        },
        error: (erro) => {
          console.error('Erro ao atualizar paciente:', erro);
          this.notificacaoService.mostrarErro('Erro ao atualizar dados do paciente: ' + 
            (erro.error?.message || 'Falha na comunicação com o servidor'));
        }
      });
    }
  }

  abrirModalConfirmacao(): void {
    this.mostrarModal = true;
  }

  fecharModal(): void {
    this.mostrarModal = false;
  }

  excluirPaciente(): void {
    if (!this.pacienteSelecionado) {
      return;
    }

    this.isLoading = true;
    this.pacienteService.excluirPaciente(String(this.pacienteSelecionado.id)).pipe(
      finalize(() => {
        this.isLoading = false;
        this.fecharModal();
      })
    ).subscribe({
      next: () => {
        this.notificacaoService.mostrarSucesso('Paciente excluído com sucesso!');
        this.pacienteSelecionado = null;
      },
      error: (erro) => {
        console.error('Erro ao excluir paciente:', erro);
        this.notificacaoService.mostrarErro('Erro ao excluir paciente: ' + (erro.message || 'Por favor, tente novamente.'));
      }
    });
  }
}
