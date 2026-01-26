/**
 * Inventory Item Entity
 * Representa um item do inventário/estoque
 */

import { BaseEntity } from '@/core/types';

/**
 * Categoria de Item
 */
export enum ItemCategory {
  MEDICATION = 'Medicamento',
  EQUIPMENT = 'Equipamento',
  SUPPLIES = 'Insumos',
  CONSUMABLES = 'Consumíveis',
}

/**
 * Status do Item
 */
export enum ItemStatus {
  AVAILABLE = 'Disponível',
  LOW_STOCK = 'Estoque Baixo',
  OUT_OF_STOCK = 'Sem Estoque',
  EXPIRED = 'Vencido',
  RESERVED = 'Reservado',
}

/**
 * Unidade de Medida
 */
export enum MeasurementUnit {
  UNIT = 'Unidade',
  BOX = 'Caixa',
  BOTTLE = 'Frasco',
  TUBE = 'Tubo',
  SACHET = 'Sachê',
  ML = 'ML',
  MG = 'MG',
  G = 'G',
  KG = 'KG',
}

/**
 * Entidade InventoryItem
 */
export interface InventoryItem extends BaseEntity {
  // Informações Básicas
  name: string;
  code: string;
  barcode?: string;
  category: ItemCategory;
  description?: string;
  
  // Estoque
  quantity: number;
  minQuantity: number;
  maxQuantity: number;
  unit: MeasurementUnit;
  
  // Status e Controle
  status: ItemStatus;
  location: string;
  batch?: string;
  expirationDate?: Date | string;
  
  // Fornecedor e Preços
  supplier?: string;
  costPrice: number;
  salePrice?: number;
  
  // Observações
  notes?: string;
}

/**
 * DTO para criação de item
 */
export type CreateInventoryItemDTO = Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt' | 'code'>;

/**
 * DTO para atualização de item
 */
export type UpdateInventoryItemDTO = Partial<Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt' | 'code'>>;

/**
 * Filtros de busca de items
 */
export interface InventoryFilters {
  search?: string;
  category?: ItemCategory;
  status?: ItemStatus;
  lowStock?: boolean;
  expired?: boolean;
  page?: number;
  pageSize?: number;
}

/**
 * Movimento de Estoque
 */
export enum MovementType {
  IN = 'Entrada',
  OUT = 'Saída',
  ADJUSTMENT = 'Ajuste',
  TRANSFER = 'Transferência',
}

export interface StockMovement extends BaseEntity {
  itemId: string;
  type: MovementType;
  quantity: number;
  reason: string;
  performedBy: string;
  previousQuantity: number;
  newQuantity: number;
}
