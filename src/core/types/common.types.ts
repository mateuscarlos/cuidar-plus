/**
 * Tipos Compartilhados
 * Tipos e interfaces usados em todo o projeto
 */

/**
 * Entidade Base
 * Todas as entidades de domínio devem estender esta interface
 */
export interface BaseEntity {
  id: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

/**
 * Resposta Paginada
 * Padrão para endpoints que retornam listas paginadas
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

/**
 * Estados de Carregamento
 * Para controle de estado de requisições assíncronas
 */
export enum LoadingState {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error',
}

/**
 * Resultado Assíncrono
 * Wrapper para operações assíncronas com estado e erro
 */
export interface AsyncResult<T> {
  data: T | null;
  state: LoadingState;
  error: string | null;
}

/**
 * Filtros de Pesquisa Comuns
 * Base para filtros de listagem
 */
export interface BaseFilters {
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Opções de Select
 * Para dropdowns e selects
 */
export interface SelectOption<T = string> {
  label: string;
  value: T;
  disabled?: boolean;
}

/**
 * Resposta de API Genérica
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * Erro de Validação
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Metadados de Arquivo
 */
export interface FileMetadata {
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: Date | string;
}

/**
 * Opções de Ordenação
 */
export type SortDirection = 'asc' | 'desc';

export interface SortOptions {
  field: string;
  direction: SortDirection;
}

/**
 * Range de Datas
 */
export interface DateRange {
  startDate: Date | string;
  endDate: Date | string;
}

/**
 * Status Genérico
 */
export enum Status {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  ARCHIVED = 'archived',
}
