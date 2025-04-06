// O modelo atual já está correto, mantendo a FK para convênio
export interface Plano {
  id?: number;
  convenio_id: number;
  nome: string;
  codigo?: string;
  tipo_acomodacao?: string;
  ativo: boolean;
  created_at?: string;
  updated_at?: string;
  convenio?: {
    id: number;
    nome: string;
  };
}