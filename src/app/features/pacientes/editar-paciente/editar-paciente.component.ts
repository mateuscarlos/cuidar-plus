import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BuscaPacienteComponent } from '../busca-paciente/busca-paciente.component';

// Interface para representar os dados de um paciente
interface Paciente {
  id: string;
  nome_completo: string;
  cpf: string;
  data_nascimento: string;
  genero?: string;
  estado_civil?: string;
  profissao?: string;
  nacionalidade?: string;
  telefone: string;
  telefone_secundario?: string;
  email?: string;
  endereco: {
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
  };
  status: string;
  cid_primario: string;
  cid_secundario?: string;
  acomodacao: string;
  medico_responsavel?: string;
  alergias?: string;
  convenio_id?: number;
  plano_id?: number;
  numero_carteirinha?: string;
  data_validade?: string;
  contato_emergencia?: string;
  telefone_emergencia?: string;
  case_responsavel?: string;
}

@Component({
  selector: 'app-editar-paciente',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BuscaPacienteComponent],
  templateUrl: './editar-paciente.component.html',
  styleUrls: ['./editar-paciente.component.scss']
})
export class EditarPacienteComponent implements OnInit {
  pacienteForm!: FormGroup;
  estadosCivis = ['Solteiro(a)', 'Casado(a)', 'Divorciado(a)', 'Viúvo(a)', 'União Estável', 'Separado(a)'];
  generos = ['Masculino', 'Feminino', 'Não-binário', 'Prefiro não informar', 'Outro'];
  acomodacoes = ['Enfermaria', 'Apartamento', 'UTI', 'Semi-intensiva', 'Home Care'];
  
  // Mock de pacientes para simular resultados da busca
  pacientesMock: Paciente[] = [
    {
      id: '12345',
      nome_completo: 'Maria Rodrigues',
      cpf: '12345678901',
      data_nascimento: '1980-05-15',
      genero: 'Feminino',
      estado_civil: 'Casado(a)',
      profissao: 'Engenheira',
      nacionalidade: 'Brasileiro(a)',
      telefone: '(11) 99999-8888',
      telefone_secundario: '(11) 3333-4444',
      email: 'maria@email.com',
      endereco: {
        cep: '01234-567',
        logradouro: 'Rua das Flores',
        numero: '123',
        complemento: 'Apto 45',
        bairro: 'Jardim Primavera',
        cidade: 'São Paulo',
        estado: 'SP'
      },
      status: 'em-avaliacao',
      cid_primario: 'J11',
      cid_secundario: 'E10',
      acomodacao: 'Apartamento',
      medico_responsavel: 'Dr. Carlos Silva',
      alergias: 'Penicilina',
      convenio_id: 1,
      plano_id: 2,
      numero_carteirinha: '987654321',
      data_validade: '2026-12-31',
      contato_emergencia: 'João Rodrigues',
      telefone_emergencia: '(11) 98765-4321',
      case_responsavel: 'Dra. Ana Paula'
    },
    {
      id: '12346',
      nome_completo: 'João Silva',
      cpf: '98765432101',
      data_nascimento: '1975-08-22',
      genero: 'Masculino',
      estado_civil: 'Solteiro(a)',
      profissao: 'Administrador',
      nacionalidade: 'Brasileiro(a)',
      telefone: '(11) 99888-7777',
      email: 'joao@email.com',
      endereco: {
        cep: '04321-567',
        logradouro: 'Av. Principal',
        numero: '500',
        bairro: 'Centro',
        cidade: 'São Paulo',
        estado: 'SP'
      },
      status: 'ativo',
      cid_primario: 'I10',
      acomodacao: 'Enfermaria',
      medico_responsavel: 'Dra. Marina Costa',
      alergias: 'Nenhuma'
    },
    {
      id: '12347',
      nome_completo: 'Maria Santos',
      cpf: '45678912301',
      data_nascimento: '1990-03-10',
      genero: 'Feminino',
      estado_civil: 'Casado(a)',
      profissao: 'Professora',
      nacionalidade: 'Brasileiro(a)',
      telefone: '(11) 97777-6666',
      email: 'mariasantos@email.com',
      endereco: {
        cep: '06789-123',
        logradouro: 'Rua dos Girassóis',
        numero: '789',
        bairro: 'Jardim Europa',
        cidade: 'Osasco',
        estado: 'SP'
      },
      status: 'ativo',
      cid_primario: 'K29',
      acomodacao: 'Apartamento',
      convenio_id: 3,
      plano_id: 1,
      numero_carteirinha: '123456789',
      data_validade: '2025-10-15'
    }
  ];

  resultadosBusca: Paciente[] = [];
  pacienteSelecionado: Paciente | null = null;
  modoEdicao = false;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.pacienteForm = this.fb.group({
      nome_completo: ['', [Validators.required, Validators.maxLength(100)]],
      cpf: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
      convenio_id: [null],
      numero_carteirinha: [''],
      acomodacao: ['', Validators.required],
      telefone: ['', [Validators.required, Validators.maxLength(15)]],
      alergias: [''],
      cid_primario: ['', [Validators.required, Validators.maxLength(10)]],
      cid_secundario: ['', [Validators.maxLength(10)]],
      data_nascimento: ['', Validators.required],
      endereco: this.fb.group({
        cep: ['', Validators.required],
        logradouro: ['', Validators.required],
        numero: ['', Validators.required],
        complemento: [''],
        bairro: ['', Validators.required],
        cidade: ['', Validators.required],
        estado: ['', Validators.required]
      }),
      status: ['em-avaliacao'],
      email: ['', [Validators.email, Validators.maxLength(100)]],
      telefone_emergencia: ['', [Validators.maxLength(15)]],
      contato_emergencia: ['', [Validators.maxLength(100)]],
      case_responsavel: ['', [Validators.maxLength(100)]],
      medico_responsavel: ['', [Validators.maxLength(100)]],
      telefone_secundario: ['', [Validators.maxLength(15)]],
      genero: [''],
      estado_civil: [''],
      profissao: ['', [Validators.maxLength(50)]],
      nacionalidade: ['Brasileiro(a)', [Validators.maxLength(50)]],
      plano_id: [null],
      data_validade: ['']
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
    
    // Preencher o formulário com os dados do paciente
    this.pacienteForm.patchValue({
      nome_completo: paciente.nome_completo,
      cpf: paciente.cpf,
      data_nascimento: paciente.data_nascimento,
      genero: paciente.genero,
      estado_civil: paciente.estado_civil,
      profissao: paciente.profissao,
      nacionalidade: paciente.nacionalidade,
      telefone: paciente.telefone,
      telefone_secundario: paciente.telefone_secundario,
      email: paciente.email,
      endereco: {
        cep: paciente.endereco.cep,
        logradouro: paciente.endereco.logradouro,
        numero: paciente.endereco.numero,
        complemento: paciente.endereco.complemento,
        bairro: paciente.endereco.bairro,
        cidade: paciente.endereco.cidade,
        estado: paciente.endereco.estado
      },
      status: paciente.status,
      cid_primario: paciente.cid_primario,
      cid_secundario: paciente.cid_secundario,
      acomodacao: paciente.acomodacao,
      medico_responsavel: paciente.medico_responsavel,
      alergias: paciente.alergias,
      convenio_id: paciente.convenio_id,
      plano_id: paciente.plano_id,
      numero_carteirinha: paciente.numero_carteirinha,
      data_validade: paciente.data_validade,
      contato_emergencia: paciente.contato_emergencia,
      telefone_emergencia: paciente.telefone_emergencia,
      case_responsavel: paciente.case_responsavel
    });
  }

  salvarAlteracoes(): void {
    if (this.pacienteForm.valid && this.pacienteSelecionado) {
      // Em um cenário real, aqui faríamos uma chamada à API
      console.log('Dados do paciente atualizados:', this.pacienteForm.value);
      alert('Paciente atualizado com sucesso!');
      this.router.navigate(['/pacientes']);
    } else {
      this.markFormGroupTouched(this.pacienteForm);
      alert('Por favor, preencha corretamente todos os campos obrigatórios.');
    }
  }

  cancelarEdicao(): void {
    this.modoEdicao = false;
    this.pacienteSelecionado = null;
    this.pacienteForm.reset();
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
    const control = this.pacienteForm.get(field);
    return control && control.invalid && (control.dirty || control.touched);
  }

  isEnderecoFieldValid(field: string) {
    const control = this.pacienteForm.get('endereco')?.get(field);
    return control && control.invalid && (control.dirty || control.touched);
  }
}
