import { Injectable, signal, computed, inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Paciente } from '../models/paciente.model';
import { PacienteService } from '../services/paciente.service';
import { switchMap, tap, catchError, of } from 'rxjs';

export type PacientesState = {
  pacientes: Paciente[];
  pacienteSelecionado: Paciente | null;
  carregando: boolean;
  erro: string | null;
};

@Injectable({
  providedIn: 'root'
})
export class PacienteStore {
  // Estado inicial
  private state = signal<PacientesState>({
    pacientes: [],
    pacienteSelecionado: null,
    carregando: false,
    erro: null
  });

  // Selectors
  pacientes = computed(() => this.state().pacientes);
  pacienteSelecionado = computed(() => this.state().pacienteSelecionado);
  carregando = computed(() => this.state().carregando);
  erro = computed(() => this.state().erro);

  private pacienteService = inject(PacienteService);

  // Actions
  buscarPacientes(filtro: { tipo: 'cpf' | 'id' | 'nome', valor: string }) {
    this.state.update(s => ({ ...s, carregando: true, erro: null }));

    this.pacienteService.buscarPacientes(filtro).pipe(
      tap(pacientes => {
        this.state.update(s => ({ ...s, pacientes, carregando: false }));
      }),
      catchError(erro => {
        this.state.update(s => ({ ...s, carregando: false, erro: 'Erro ao buscar pacientes' }));
        return of([]);
      })
    ).subscribe();
  }

  carregarPaciente(id: string) {
    this.state.update(s => ({ ...s, carregando: true, erro: null }));

    this.pacienteService.obterPacientePorId(id).pipe(
      tap(paciente => {
        if (paciente) {
          this.state.update(s => ({ ...s, pacienteSelecionado: paciente as Paciente, carregando: false }));
        } else {
          this.state.update(s => ({ ...s, erro: 'Paciente não encontrado', carregando: false }));
        }
      }),
      catchError(erro => {
        this.state.update(s => ({ ...s, carregando: false, erro: 'Erro ao carregar paciente' }));
        return of(null);
      })
    ).subscribe();
  }

  selecionarPaciente(paciente: Paciente) {
    this.state.update(s => ({ ...s, pacienteSelecionado: paciente }));
  }

  limparSelecao() {
    this.state.update(s => ({ ...s, pacienteSelecionado: null }));
  }

  criarPaciente(paciente: Omit<Paciente, 'id' | 'created_at' | 'updated_at'>) {
    this.state.update(s => ({ ...s, carregando: true, erro: null }));

    this.pacienteService.criarPaciente(paciente).pipe(
      tap(novoPaciente => {
        this.state.update(s => ({
          ...s,
          pacientes: [novoPaciente, ...s.pacientes],
          pacienteSelecionado: novoPaciente,
          carregando: false
        }));
      }),
      catchError(erro => {
        this.state.update(s => ({ ...s, carregando: false, erro: 'Erro ao criar paciente' }));
        return of(null);
      })
    ).subscribe();
  }

  atualizarPaciente(id: string | number, paciente: Partial<Paciente>) {
    this.state.update(s => ({ ...s, carregando: true, erro: null }));

    this.pacienteService.atualizarPaciente(String(id), paciente).pipe(
      tap(pacienteAtualizado => {
        this.state.update(s => ({
          ...s,
          pacientes: s.pacientes.map(p => p.id !== undefined && p.id.toString() === id.toString() ? pacienteAtualizado : p),
          pacienteSelecionado: pacienteAtualizado,
          carregando: false
        }));
      }),
      catchError(erro => {
        this.state.update(s => ({ ...s, carregando: false, erro: 'Erro ao atualizar paciente' }));
        return of(null);
      })
    ).subscribe();
  }
}