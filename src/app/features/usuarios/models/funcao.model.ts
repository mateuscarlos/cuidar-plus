export type TipoContratacao = 'c' | 't' | 'p';

export interface Funcao {
  id: number;
  setor_id: number;
  nome: string;
  conselho_profissional?: string;
  especializacao_recomendada?: string;
  tipo_contratacao: TipoContratacao;
  tipo_contratacao_extenso?: string; // Pode vir do backend, se quiser enviar já traduzido
}
