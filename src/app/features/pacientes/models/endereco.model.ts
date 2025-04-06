export interface Endereco {
  cep?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  localidade?: string;   // Cidade vinda da API
  cidade?: string;       // Campo legado, mantemos para compatibilidade
  uf?: string;           // Estado (sigla) vinda da API
  estado?: string;       // Campo legado, mantemos para compatibilidade  
  ibge?: string;
  gia?: string;
  ddd?: string;
  siafi?: string;
  unidade?: string;
  regiao?: string;
}