import { ConselhoProfissional } from './conselhos-profissionais.model';

export type TipoContratacao = 'c' | 't' | 'p';

export interface Funcao {
  id: number;
  setor_id: number;
  nome: string;
  conselho_profissional?: string;
  especializacao_recomendada?: string;
  
}

export interface Funcao_Com_Registro {
  id: number;
  nome: string;
  
}

/**
 * Função utilitária para determinar se uma função requer registro em conselho profissional
 * @param funcaoId ID da função
 * @param funcoes Lista de funções disponíveis
 * @returns Objeto com informações do conselho ou null se não exigir registro
 */
export function verificarConselhoFuncao(
  funcaoId: number, 
  funcoes: Funcao[]
): { conselho: string; label: string } | null {
  const funcao = funcoes.find(f => f.id === funcaoId);
  
  if (funcao && funcao.conselho_profissional) {
    return {
      conselho: funcao.conselho_profissional,
      label: `Número do ${funcao.conselho_profissional}`
    };
  }
  
  return null;
}

