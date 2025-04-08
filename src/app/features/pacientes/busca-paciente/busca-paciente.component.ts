import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';
import { ResultadoBusca } from '../models/busca-paciente.model';
import { Paciente } from '../models/paciente.model';
import { PacienteService } from '../services/paciente.service';
import { CpfMaskPipe } from '../../../shared/pipes/cpf-mask.pipe';

@Component({
  selector: 'app-busca-paciente',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, CpfMaskPipe],
  templateUrl: './busca-paciente.component.html',
  styleUrls: ['./busca-paciente.component.scss']
})
export class BuscaPacienteComponent implements OnInit {
  @Output() resultadoBusca = new EventEmitter<ResultadoBusca>();
  @Output() pacienteSelecionado = new EventEmitter<Paciente>();
  @Output() pacienteSelecionadoParaEdicao = new EventEmitter<Paciente>();
  @Output() pacienteSelecionadoParaVisualizacao = new EventEmitter<Paciente>();
  @Input() modoVisualizacao: 'padrao' | 'editaPaciente' | 'acompanhamento' = 'padrao';
  
  buscaForm!: FormGroup;
  pacientes: Paciente[] = [];
  carregando = false;
  mensagemErro = '';
  buscaRealizada = false;
  
  constructor(
    private fb: FormBuilder,
    private pacienteService: PacienteService
  ) {}
  
  ngOnInit(): void {
    this.initForm();
    this.setupListeners();
  }
  
  initForm(): void {
    this.buscaForm = this.fb.group({
      cpf: [''],
      id: [''],
      nome: ['']
    });
  }
  
  setupListeners(): void {
    // Monitor CPF changes
    this.buscaForm.get('cpf')?.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(valor => {
      if (valor && valor.length > 0) {
        this.limparOutrosCampos('cpf');
        this.buscarPacientes('cpf', valor);
      }
    });

    // Monitor ID changes
    this.buscaForm.get('id')?.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(valor => {
      if (valor && valor.length > 0) {
        this.limparOutrosCampos('id');
        this.buscarPacientes('id', valor);
      }
    });

    // Monitor Nome changes
    this.buscaForm.get('nome')?.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(valor => {
      if (valor && valor.length > 0) {
        this.limparOutrosCampos('nome');
        this.buscarPacientes('nome', valor);
      }
    });
  }
  
  buscarPacientes(tipo: 'cpf' | 'id' | 'nome', valor: string): void {
    this.carregando = true;
    this.mensagemErro = '';
    
    this.resultadoBusca.emit({ tipo, valor });
    
    this.pacienteService.buscarPacientes({ tipo, valor })
      .pipe(
        finalize(() => {
          this.carregando = false;
          this.buscaRealizada = true;
        })
      )
      .subscribe({
        next: (response) => {
          // Map API response to match the Paciente model
            this.pacientes = response.map(item => ({
              id: item.id,
              nome: item.nome || '',
              nome_completo: item.nome_completo || item.nome || '',
              cpf: item.cpf || '',
              dataNascimento: item.dataNascimento || new Date(),
              data_nascimento: item.data_nascimento || item.dataNascimento || new Date(),
              genero: item.genero || '',
              estado_civil: item.estado_civil || '',
              profissao: item.profissao || '',
              nacionalidade: item.nacionalidade || '',
              telefone_secundario: item.telefone_secundario || '',
              telefone: item.telefone || '',
              data_validade: item.data_validade || '',
              contato_emergencia: item.contato_emergencia || '',
              telefone_emergencia: item.telefone_emergencia || '',
              case_responsavel: item.case_responsavel || '',
              alergias: item.alergias || '',
              medico_responsavel: item.medico_responsavel || '',
              email: item.email || '',
              endereco: typeof item.endereco === 'string' ? JSON.parse(item.endereco) : (item.endereco || {}),
              convenioId: item.convenio_id || 0,
              planoId: item.plano_id || 0,
              numeroCarteirinha: item.numero_carteirinha || '',
              status: item.status || '',
              cid_primario: item.cid_primario || '',
              cid_secundario: item.cid_secundario || '',
              acomodacao: item.acomodacao || '',
              created_at: item.created_at || new Date(),
              updated_at: item.updated_at || new Date()
            })) as Paciente[];
        },
        error: (erro) => {
          console.error('Erro ao buscar pacientes:', erro);
          this.mensagemErro = 'Ocorreu um erro ao buscar pacientes. Tente novamente.';
          this.pacientes = [];
        }
      });
  }
  
  limparOutrosCampos(campoAtual: string): void {
    const campos = ['cpf', 'id', 'nome'];
    campos.forEach(campo => {
      if (campo !== campoAtual && this.buscaForm.get(campo)?.value) {
        this.buscaForm.get(campo)?.setValue('', { emitEvent: false });
      }
    });
  }

  limparBusca(): void {
    this.buscaForm.reset();
    this.pacientes = [];
    this.mensagemErro = '';
    this.buscaRealizada = false;
  }
  
  selecionarPaciente(paciente: Paciente): void {
    this.pacienteSelecionado.emit(paciente);
  }

  editarPaciente(paciente: Paciente): void {
    this.pacienteSelecionadoParaEdicao.emit(paciente);
  }

  visualizarPaciente(paciente: Paciente): void {
    this.pacienteSelecionadoParaVisualizacao.emit(paciente);
  }
}
