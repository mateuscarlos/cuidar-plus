import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Insumo {
  id: number;
  nome: string;
  quantidade: number;
  descricao: string;
  categoria: string; // Exemplo: Medicamento, Equipamento, etc.
  fornecedor: string; // Exemplo: Nome do fornecedor
}

@Injectable({
  providedIn: 'root' // Serviço standalone
})
export class FarmaciaService {
  private apiUrl = 'http://localhost:3000/insumos'; // URL da API

  constructor(private http: HttpClient) {}

  // Obter todos os insumos
  getInsumos(): Observable<Insumo[]> {
    return this.http.get<Insumo[]>(this.apiUrl);
  }

  // Obter um insumo por ID
  getInsumo(id: number): Observable<Insumo> {
    return this.http.get<Insumo>(`${this.apiUrl}/${id}`);
  }

  // Criar um novo insumo
  criarInsumo(insumo: Insumo): Observable<Insumo> {
    return this.http.post<Insumo>(this.apiUrl, insumo);
  }

  // Atualizar um insumo existente
  atualizarInsumo(id: number, insumo: Insumo): Observable<Insumo> {
    return this.http.put<Insumo>(`${this.apiUrl}/${id}`, insumo);
  }

  // Deletar um insumo
  deletarInsumo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}