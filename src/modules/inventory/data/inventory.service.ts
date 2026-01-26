/**
 * Inventory Service
 */

import { apiClient } from '@/core/config/api.config';
import { PaginatedResponse } from '@/core/types';
import { InventoryItem, InventoryFilters, CreateInventoryItemDTO, UpdateInventoryItemDTO, StockMovement, MovementType } from '../domain';

const ENDPOINTS = {
  BASE: '/inventory',
  BY_ID: (id: string) => `/inventory/${id}`,
  MOVEMENTS: '/inventory/movements',
  LOW_STOCK: '/inventory/low-stock',
  EXPIRED: '/inventory/expired',
} as const;

export class InventoryService {
  static async fetchItems(filters: InventoryFilters = {}): Promise<PaginatedResponse<InventoryItem>> {
    const { data } = await apiClient.get<PaginatedResponse<InventoryItem>>(ENDPOINTS.BASE, { params: filters });
    return data;
  }

  static async getItemById(id: string): Promise<InventoryItem> {
    const { data } = await apiClient.get<InventoryItem>(ENDPOINTS.BY_ID(id));
    return data;
  }

  static async createItem(item: CreateInventoryItemDTO): Promise<InventoryItem> {
    const { data } = await apiClient.post<InventoryItem>(ENDPOINTS.BASE, item);
    return data;
  }

  static async updateItem(id: string, updates: UpdateInventoryItemDTO): Promise<InventoryItem> {
    const { data } = await apiClient.patch<InventoryItem>(ENDPOINTS.BY_ID(id), updates);
    return data;
  }

  static async deleteItem(id: string): Promise<void> {
    await apiClient.delete(ENDPOINTS.BY_ID(id));
  }

  static async registerMovement(
    itemId: string,
    type: MovementType,
    quantity: number,
    reason: string
  ): Promise<StockMovement> {
    const { data } = await apiClient.post<StockMovement>(ENDPOINTS.MOVEMENTS, {
      itemId,
      type,
      quantity,
      reason,
    });
    return data;
  }

  static async getLowStockItems(): Promise<InventoryItem[]> {
    const { data } = await apiClient.get<InventoryItem[]>(ENDPOINTS.LOW_STOCK);
    return data;
  }

  static async getExpiredItems(): Promise<InventoryItem[]> {
    const { data } = await apiClient.get<InventoryItem[]>(ENDPOINTS.EXPIRED);
    return data;
  }
}

export default InventoryService;
