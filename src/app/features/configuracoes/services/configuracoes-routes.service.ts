import { Injectable, inject } from '@angular/core';
import { RoutesService } from '../../../core/services/routes.service';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracoesRoutesService {
  private readonly routesService = inject(RoutesService);
  
  navegarParaInicio(): void {
    this.routesService.navegarParaConfiguracoes();
  }
  
  navegarParaSetores(): void {
    this.routesService.navegarParaSetores();
  }
  
  navegarParaNovoSetor(): void {
    this.routesService.navegarParaNovoSetor();
  }
  
  navegarParaEditarSetor(id: string | number): void {
    this.routesService.navegarParaEditarSetor(id);
  }
  
  navegarParaFuncoes(): void {
    this.routesService.navegarParaFuncoes();
  }
  
  navegarParaNovaFuncao(): void {
    this.routesService.navegarParaNovaFuncao();
  }
  
  navegarParaEditarFuncao(id: string | number): void {
    this.routesService.navegarParaEditarFuncao(id);
  }
}