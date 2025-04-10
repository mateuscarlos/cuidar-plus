import { Injectable, inject } from '@angular/core';
import { RoutesService } from '../../../core/services/routes.service';

@Injectable({
  providedIn: 'root'
})
export class PacienteRoutesService {
  private readonly routesService = inject(RoutesService);
  
  navegarParaLista(): void {
    this.routesService.navegarParaListaPacientes();
  }
  
  navegarParaCadastro(): void {
    this.routesService.navegarParaCadastroPaciente();
  }
  
  navegarParaEdicao(id: string | number): void {
    this.routesService.navegarParaEdicaoPaciente(id);
  }
  
  navegarParaVisualizacao(id: string | number): void {
    this.routesService.navegarParaVisualizacaoPaciente(id);
  }
  
  navegarParaAcompanhamento(): void {
    this.routesService.navegarParaAcompanhamentoPaciente();
  }
}