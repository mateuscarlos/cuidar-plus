import { Injectable } from '@angular/core';
import { ConselhoProfissional, FuncoesComRegistro, FUNCOES_DETALHES, SetorProfissional, SETOR_CONSELHO_MAP } from '../models/conselhos-profissionais.model';
import { Funcao } from '../models/funcao.model';

@Injectable({
  providedIn: 'root'
})
export class ConselhosProfissionaisService {
  /**
   * Verifica se um setor requer algum tipo de conselho profissional
   * @param setorId ID do setor a ser verificado
   * @returns O conselho profissional ou undefined se não exigir
   */
  verificarConselhoSetor(setorId: number): ConselhoProfissional | undefined {
    return SETOR_CONSELHO_MAP[setorId as SetorProfissional];
  }
  
  /**
   * Verifica se uma função requer registro em conselho profissional
   * @param funcaoId ID da função
   * @returns Informações do conselho ou null se não exigir registro
   */
  verificarConselhoFuncao(funcaoId: number): { conselho: ConselhoProfissional; label: string } | null {
    const detalhes = FUNCOES_DETALHES[funcaoId as FuncoesComRegistro];
    
    if (detalhes) {
      return {
        conselho: detalhes.conselho,
        label: `Número do ${detalhes.conselho}`
      };
    }
    
    return null;
  }
  
  /**
   * Verifica dinamicamente no banco de dados se uma função requer conselho
   * @param funcaoId ID da função
   * @param funcoes Lista de funções recuperadas do backend
   * @returns Informações do conselho ou null se não exigir registro
   */
  verificarConselhoFuncaoDinamico(funcaoId: number, funcoes: Funcao[]): { conselho: string; label: string } | null {
    const funcao = funcoes.find(f => f.id === funcaoId);
    
    if (funcao && funcao.conselho_profissional) {
      return {
        conselho: funcao.conselho_profissional,
        label: `Número do ${funcao.conselho_profissional}`
      };
    }
    
    return null;
  }
  
  /**
   * Obtém todas as funções que exigem registro em conselho profissional
   * @returns Lista de IDs das funções que exigem registro
   */
  obterFuncoesComRegistro(): number[] {
    return Object.keys(FUNCOES_DETALHES).map(id => Number(id));
  }
  
  /**
   * Obtém as funções com registro de um setor específico
   * @param setorId ID do setor
   * @returns Lista de IDs das funções que exigem registro nesse setor
   */
  obterFuncoesComRegistroPorSetor(setorId: SetorProfissional): number[] {
    return Object.entries(FUNCOES_DETALHES)
      .filter(([_, detalhe]) => detalhe.setorId === setorId)
      .map(([id, _]) => Number(id));
  }
}