/**
 * Inventory Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { QUERY_KEYS } from '@/core/lib/query-client';
import { MESSAGES } from '@/core/constants';
import { ENV } from '@/core/config';
import { InventoryService } from '../../data/inventory.service';
import { mockInventoryItems } from '../../data/inventory.mock';
import type { InventoryFilters, CreateInventoryItemDTO, UpdateInventoryItemDTO } from '../../domain';

export function useInventoryItems(filters: InventoryFilters = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.INVENTORY.list(filters),
    queryFn: async () => {
      if (ENV.ENABLE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 400));
        
        let filtered = [...mockInventoryItems];
        
        // ⚡ Bolt Performance Optimization: Single-pass filter with RegExp
        // Consolidates 4 separate .filter() passes into 1
        // Pre-compiling RegExp is significantly faster than repeated .toLowerCase().includes()
        const hasFilters = filters.search || filters.category || filters.status || filters.lowStock;
        
        if (hasFilters) {
          const searchRegex = filters.search
            ? new RegExp(filters.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
            : null;

          filtered = filtered.filter(i => {
            if (filters.category && i.category !== filters.category) return false;
            if (filters.status && i.status !== filters.status) return false;
            if (filters.lowStock && i.quantity > i.minQuantity) return false;

            if (searchRegex) {
              return searchRegex.test(i.name) || searchRegex.test(i.code);
            }

            return true;
          });
        }
        
        return {
          data: filtered,
          pagination: {
            total: filtered.length,
            page: 1,
            pageSize: 20,
            totalPages: Math.ceil(filtered.length / 20),
          },
        };
      }
      
      return InventoryService.fetchItems(filters);
    },
  });
}

export function useInventoryItem(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.INVENTORY.detail(id),
    queryFn: async () => {
      if (ENV.ENABLE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 300));
        const item = mockInventoryItems.find(i => i.id === id);
        if (!item) throw new Error('Item não encontrado');
        return item;
      }
      return InventoryService.getItemById(id);
    },
    enabled: !!id,
  });
}

export function useCreateInventoryItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (item: CreateInventoryItemDTO) => {
      if (ENV.ENABLE_MOCK_DATA) {
        return Promise.resolve({
          ...item,
          id: `mock-${Date.now()}`,
          code: `ITEM-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
      return InventoryService.createItem(item);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INVENTORY.all });
      toast.success('Item cadastrado', { description: MESSAGES.SUCCESS.CREATED });
    },
    onError: (error: Error) => {
      toast.error('Erro ao cadastrar item', { description: error.message });
    },
  });
}

export function useUpdateInventoryItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateInventoryItemDTO }) => {
      if (ENV.ENABLE_MOCK_DATA) {
        return Promise.resolve({ id, ...updates });
      }
      return InventoryService.updateItem(id, updates);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INVENTORY.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INVENTORY.detail(variables.id) });
      toast.success('Item atualizado', { description: MESSAGES.SUCCESS.UPDATED });
    },
  });
}

export function useDeleteInventoryItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => {
      if (ENV.ENABLE_MOCK_DATA) {
        return Promise.resolve();
      }
      return InventoryService.deleteItem(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INVENTORY.all });
      toast.success('Item removido', { description: MESSAGES.SUCCESS.DELETED });
    },
  });
}
