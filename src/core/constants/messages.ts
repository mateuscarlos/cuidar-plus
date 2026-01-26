/**
 * Mensagens do Sistema
 * Centraliza mensagens para facilitar i18n no futuro
 */

export const MESSAGES = {
  // Sucesso
  SUCCESS: {
    CREATED: 'Registro criado com sucesso!',
    UPDATED: 'Registro atualizado com sucesso!',
    DELETED: 'Registro excluído com sucesso!',
    SAVED: 'Salvo com sucesso!',
    OPERATION_COMPLETED: 'Operação concluída com sucesso!',
  },
  
  // Erros
  ERROR: {
    GENERIC: 'Ocorreu um erro. Tente novamente.',
    NETWORK: 'Erro de conexão. Verifique sua internet.',
    UNAUTHORIZED: 'Você não tem permissão para esta ação.',
    NOT_FOUND: 'Registro não encontrado.',
    VALIDATION: 'Verifique os campos e tente novamente.',
    SERVER: 'Erro no servidor. Tente novamente mais tarde.',
    TIMEOUT: 'Tempo de resposta excedido. Tente novamente.',
  },
  
  // Confirmações
  CONFIRM: {
    DELETE: 'Tem certeza que deseja excluir este registro?',
    DISCARD: 'Descartar alterações não salvas?',
    LOGOUT: 'Deseja realmente sair?',
  },
  
  // Loading
  LOADING: {
    DEFAULT: 'Carregando...',
    SAVING: 'Salvando...',
    DELETING: 'Excluindo...',
    PROCESSING: 'Processando...',
  },
  
  // Validação
  VALIDATION: {
    REQUIRED: 'Este campo é obrigatório',
    EMAIL: 'E-mail inválido',
    MIN_LENGTH: (min: number) => `Mínimo de ${min} caracteres`,
    MAX_LENGTH: (max: number) => `Máximo de ${max} caracteres`,
    PHONE: 'Telefone inválido',
    CPF: 'CPF inválido',
    DATE: 'Data inválida',
  },
  
  // Empty States
  EMPTY: {
    NO_DATA: 'Nenhum registro encontrado',
    NO_RESULTS: 'Nenhum resultado para sua busca',
    START_CREATING: 'Comece criando um novo registro',
  },
} as const;
