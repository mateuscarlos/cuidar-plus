export interface Atividade {
  id?: number | string;
  usuario_id: number | string;
  tipo: string;
  descricao: string;
  data_hora: Date | string;
  ip?: string;
  detalhes?: string;
}