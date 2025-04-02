export interface Convenio {
  id: number;
  nome: string;
}

export interface Plano {
  id: number;
  nome: string;
  convenio_id: number;
}