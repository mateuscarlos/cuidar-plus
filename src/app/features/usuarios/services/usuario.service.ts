import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Setor } from '../models/setor.model';
import { Funcao } from '../models/funcao.model';

export interface Endereco {
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  localidade?: string;
  estado?: string;
  uf?: string;
  cep?: string;
}

export interface Usuario {
  id?: number | string;
  nome: string;
  email: string;
  cpf?: string;
  document?: string; // Campo alternativo para CPF
  telefone?: string;
  setor?: string;
  funcao?: string;
  registroCategoria?: string;
  especialidade?: string;
  cep?: string;
  endereco?: Endereco;
  dataAdmissao?: Date | string;
  tipoContratacao?: string;
  tipoAcesso?: string;
  status?: string;
  ativo?: boolean;
  password_hash?: string; // Para criar novos usuários
  permissions?: string[];
}
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private baseApiUrl = environment.apiUrl;
  private apiUrl = `${this.baseApiUrl}/usuarios`;
  
  constructor(private http: HttpClient) { }
    
  listarTodos(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  obterPorId(id: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  criar(usuario: Usuario): Observable<any> {
    // Mapeia os valores de tipoContratacao para os valores esperados pelo backend
    const tipoContratacaoMap: { [key: string]: string } = {
      'Contratada': 'c',
      'Terceirizada': 't',
      'Pessoa Jurídica': 'p'
    };

    // Substitui o valor de tipoContratacao pelo mapeado
    usuario.tipoContratacao = tipoContratacaoMap[usuario.tipoContratacao || ''] || usuario.tipoContratacao;

    console.log('Enviando para API:', JSON.stringify(usuario)); // Log para depuração
    return this.http.post(this.apiUrl, usuario);
  }

  atualizar(id: string, usuario: Usuario): Observable<any> {
    console.log('Enviando para API (atualização):', JSON.stringify(usuario)); // Adicione este log
    return this.http.put(`${this.apiUrl}/${id}`, usuario);
  }

  excluir(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  ativarDesativar(id: string, ativo: boolean): Observable<Usuario> {
    return this.http.patch<Usuario>(`${this.apiUrl}/${id}/status`, { ativo });
  }

  listarSetores(): Observable<Setor[]> {
    return this.http.get<Setor[]>(`${this.baseApiUrl}/setores`);
  }

  listarFuncoes(): Observable<Funcao[]> {
    return this.http.get<Funcao[]>(`${this.baseApiUrl}/funcoes`);
  }
}
