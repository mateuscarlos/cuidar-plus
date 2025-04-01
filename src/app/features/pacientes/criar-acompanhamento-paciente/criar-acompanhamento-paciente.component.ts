import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BuscaPacienteComponent } from '../busca-paciente/busca-paciente.component';
import { 
  Acompanhamento,
  TipoAtendimento,
  MotivoAtendimento,
  NivelDor,
  CondicaoPaciente
} from '../models/acompanhamento.model';

// Interface para representar os dados de paciente
interface Paciente {
  id: string;
  nome_completo: string;
  cpf: string;
  data_nascimento: string;
  telefone: string;
  contato_emergencia?: string;
  telefone_emergencia?: string;
}

@Component({
  selector: 'app-acompanhamento-paciente',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BuscaPacienteComponent],
  templateUrl: './criar-acompanhamento-paciente.component.html',
  styleUrls: ['./criar-acompanhamento-paciente.component.scss']
})
export class AcompanhamentoPacienteComponent implements OnInit {
  acompanhamentoForm!: FormGroup;
  pacienteSelecionado: Paciente | null = null;
  modoEdicao = false;
  resultadosBusca: Paciente[] = [];
  
  // Enums para os selects
  tiposAtendimento = Object.values(TipoAtendimento);
  motivosAtendimento = Object.values(MotivoAtendimento);
  niveisDor = Object.values(NivelDor);
  condicoesPaciente = Object.values(CondicaoPaciente);
  
  // Pacientes mockados para teste
  pacientesMock: Paciente[] = [
    {
      id: '12345',
      nome_completo: 'Maria Rodrigues',
      cpf: '12345678901',
      data_nascimento: '1980-05-15',
      telefone: '(11) 99999-8888',
      contato_emergencia: 'João Rodrigues',
      telefone_emergencia: '(11) 98765-4321'
    },
    {
      id: '12346',
      nome_completo: 'João Silva',
      cpf: '98765432101',
      data_nascimento: '1975-08-22',
      telefone: '(11) 99888-7777'
    },
    {
      id: '12347',
      nome_completo: 'Maria Santos',
      cpf: '45678912301',
      data_nascimento: '1990-03-10',
      telefone: '(11) 97777-6666',
      contato_emergencia: 'Carlos Santos',
      telefone_emergencia: '(11) 96666-5555'
    }
  ];
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();
    
    // Se receber um ID de paciente pela rota, já carrega o paciente
    this.route.queryParams.subscribe(params => {
      if (params['pacienteId']) {
        const paciente = this.pacientesMock.find(p => p.id === params['pacienteId']);
        if (paciente) {
          this.pacienteSelecionado = paciente;
          this.modoEdicao = true;
        }
      }
    });
  }

  initForm(): void {
    const dataAtual = new Date().toISOString().split('T')[0];
    const horaAtual = new Date().toTimeString().substring(0, 5);

    this.acompanhamentoForm = this.fb.group({
      data_hora_atendimento: [dataAtual + 'T' + horaAtual, Validators.required],
      profissional: this.fb.group({
        nome: ['', Validators.required],
        cargo: ['', Validators.required]
      }),
      tipo_atendimento: [TipoAtendimento.PRESENCIAL, Validators.required],
      motivo_atendimento: [MotivoAtendimento.ROTINA, Validators.required],
      descricao_motivo: [''],
      sinais_vitais: this.fb.group({
        pressao_arterial: [''],
        frequencia_cardiaca: [null],
        temperatura: [null],
        saturacao_oxigenio: [null],
        glicemia: [null]
      }),
      condicao_paciente: [CondicaoPaciente.ESTAVEL, Validators.required],
      descricao_condicao: [''],
      nivel_dor: [NivelDor.SEM_DOR],
      localizacao_dor: [''],
      avaliacao_feridas: this.fb.group({
        aspecto: [''],
        sinais_infeccao: [false],
        tipo_curativo: ['']
      }),
      avaliacao_dispositivos: this.fb.group({
        funcionamento_adequado: [true],
        sinais_complicacao: ['']
      }),
      intervencoes: this.fb.group({
        medicacao_administrada: [''],
        curativo_realizado: [''],
        orientacoes_fornecidas: [''],
        procedimentos_realizados: [''],
        outras_intervencoes: ['']
      }),
      plano_acao: this.fb.group({
        data_proximo: [''],
        hora_proximo: [''],
        profissional_responsavel: [''],
        necessidade_contato_outros: [false],
        profissionais_contatar: [''],
        necessidade_exames: [false],
        exames_consultas: [''],
        outras_recomendacoes: ['']
      }),
      comunicacao_cuidador: this.fb.group({
        nome_cuidador: [''],
        informacoes_repassadas: [''],
        duvidas_questionamentos: ['']
      }),
      observacoes_gerais: ['']
    });
  }

  buscarPaciente(resultado: {tipo: 'cpf' | 'id' | 'nome', valor: string}) {
    // Simulando uma busca nos dados mockados
    this.resultadosBusca = [];
    this.modoEdicao = false;
    this.pacienteSelecionado = null;
    
    if (resultado.tipo === 'cpf') {
      this.resultadosBusca = this.pacientesMock.filter(p => p.cpf.includes(resultado.valor));
    } else if (resultado.tipo === 'id') {
      this.resultadosBusca = this.pacientesMock.filter(p => p.id.includes(resultado.valor));
    } else if (resultado.tipo === 'nome') {
      this.resultadosBusca = this.pacientesMock.filter(p => 
        p.nome_completo.toLowerCase().includes(resultado.valor.toLowerCase())
      );
    }
  }

  selecionarPaciente(paciente: Paciente) {
    this.pacienteSelecionado = paciente;
    this.modoEdicao = true;
    
    // Se o paciente tiver cuidador, preencher automaticamente
    if (paciente.contato_emergencia) {
      this.acompanhamentoForm.get('comunicacao_cuidador.nome_cuidador')?.setValue(paciente.contato_emergencia);
    }
  }

  salvarAcompanhamento(): void {
    if (this.acompanhamentoForm.valid && this.pacienteSelecionado) {
      const formData = this.acompanhamentoForm.value;
      
      // Montar objeto de acompanhamento
      const acompanhamento: Acompanhamento = {
        ...formData,
        paciente_id: parseInt(this.pacienteSelecionado.id)
      };
      
      console.log('Dados do acompanhamento:', acompanhamento);
      
      // Simulando o envio à API
      alert('Acompanhamento registrado com sucesso!');
      this.router.navigate(['/pacientes']);
    } else {
      this.markFormGroupTouched(this.acompanhamentoForm);
      alert('Por favor, preencha corretamente todos os campos obrigatórios.');
    }
  }

  cancelar(): void {
    this.modoEdicao = false;
    this.pacienteSelecionado = null;
    this.acompanhamentoForm.reset({
      data_hora_atendimento: new Date().toISOString().substring(0, 16),
      tipo_atendimento: TipoAtendimento.PRESENCIAL,
      motivo_atendimento: MotivoAtendimento.ROTINA,
      condicao_paciente: CondicaoPaciente.ESTAVEL,
      nivel_dor: NivelDor.SEM_DOR,
      avaliacao_dispositivos: { funcionamento_adequado: true },
      avaliacao_feridas: { sinais_infeccao: false },
      plano_acao: { necessidade_contato_outros: false, necessidade_exames: false }
    });
  }

  voltarParaLista(): void {
    this.router.navigate(['/pacientes']);
  }

  // Função auxiliar para marcar todos os campos como 'touched'
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Métodos auxiliares para verificação de campos
  isFieldValid(field: string) {
    const control = this.acompanhamentoForm.get(field);
    return control && control.invalid && (control.dirty || control.touched);
  }

  isNestedFieldValid(group: string, field: string) {
    const control = this.acompanhamentoForm.get(group)?.get(field);
    return control && control.invalid && (control.dirty || control.touched);
  }

  // Método para mostrar campos condicionais com base na seleção
  deveExibirCampo(condicao: string, valor: string): boolean {
    return this.acompanhamentoForm.get(condicao)?.value === valor;
  }
}
