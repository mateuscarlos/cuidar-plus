export interface Usuario {
  id?: number | string;
  nome: string;
  email: string;
  senha?: string;
  perfil?: string;
  status: string;
  ultimo_login?: Date | string | null;
  created_at?: Date | string;
  updated_at?: Date | string;
}