import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';
import { Paciente, ResultadoBusca } from '../models/paciente.model';
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
        this.buscarPacientesPor('cpf', valor);
      }
    });

    // Monitor ID changes
    this.buscaForm.get('id')?.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(valor => {
      if (valor && valor.length > 0) {
        this.limparOutrosCampos('id');
        this.buscarPacientesPor('id', valor);
      }
    });

    // Monitor Nome changes
    this.buscaForm.get('nome')?.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(valor => {
      if (valor && valor.length > 0) {
        this.limparOutrosCampos('nome');
        this.buscarPacientesPor('nome', valor);
      }
    });
  }
  
  buscarPacientesPor(tipo: 'cpf' | 'id' | 'nome', valor: string): void {
    this.carregando = true;
    this.mensagemErro = '';
    
    // Create the appropriate search criteria based on field type
    const criterios: ResultadoBusca = {};
    if (tipo === 'cpf') criterios.cpf = valor;
    if (tipo === 'nome') criterios.nome = valor;
    // For ID, we'll handle it differently as it's not part of ResultadoBusca
    
    // Emit the search criteria
    this.resultadoBusca.emit(criterios);
    
    // If searching by ID, call the specific method
    if (tipo === 'id') {
      this.pacienteService.obterPacientePorId(valor)
        .pipe(
          finalize(() => {
            this.carregando = false;
            this.buscaRealizada = true;
          })
        )
        .subscribe({
          next: (paciente) => {
            this.pacientes = paciente ? [paciente] : [];
          },
          error: (erro) => {
            console.error('Erro ao buscar paciente por ID:', erro);
            this.mensagemErro = 'Ocorreu um erro ao buscar o paciente. Tente novamente.';
            this.pacientes = [];
          }
        });
    } else {
      // Otherwise use the search method
      this.pacienteService.buscarPacientes(criterios)
        .pipe(
          finalize(() => {
            this.carregando = false;
            this.buscaRealizada = true;
          })
        )
        .subscribe({
          next: (response) => {
            this.pacientes = response;
          },
          error: (erro) => {
            console.error('Erro ao buscar pacientes:', erro);
            this.mensagemErro = 'Ocorreu um erro ao buscar pacientes. Tente novamente.';
            this.pacientes = [];
          }
        });
    }
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
