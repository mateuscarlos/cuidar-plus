export interface Endereco {
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  localidade: string; // Usado pelo backend (equivalente a cidade)
  cidade?: string;    // Usado para formulários
  uf: string;         // Usado pelo backend (equivalente a estado)
  estado?: string;    // Usado para formulários
  ibge?: string;
  gia?: string;
  ddd?: string;
  siafi?: string;
  unidade?: string;
  regiao?: string;
}
