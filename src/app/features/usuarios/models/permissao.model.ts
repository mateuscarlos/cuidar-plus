export interface Permissao {
  id?: number | string;
  modulo: string;
  visualizar: boolean;
  criar: boolean;
  editar: boolean;
  excluir: boolean;
  usuario_id?: number | string;
}