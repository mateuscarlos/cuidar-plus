/**
 * Inventory Business Rules
 */

import { InventoryItem, ItemStatus, MovementType } from './InventoryItem.entity';

export class InventoryValidator {
  /**
   * Validar dados do item
   */
  static validate(item: Partial<InventoryItem>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!item.name || item.name.trim().length < 2) {
      errors.push('Nome deve ter pelo menos 2 caracteres');
    }

    if (item.quantity !== undefined && item.quantity < 0) {
      errors.push('Quantidade não pode ser negativa');
    }

    if (item.minQuantity !== undefined && item.minQuantity < 0) {
      errors.push('Quantidade mínima não pode ser negativa');
    }

    if (item.costPrice !== undefined && item.costPrice < 0) {
      errors.push('Preço de custo não pode ser negativo');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Verificar se item está com estoque baixo
   */
  static isLowStock(item: InventoryItem): boolean {
    return item.quantity <= item.minQuantity && item.quantity > 0;
  }

  /**
   * Verificar se item está sem estoque
   */
  static isOutOfStock(item: InventoryItem): boolean {
    return item.quantity === 0;
  }

  /**
   * Verificar se item está vencido
   */
  static isExpired(item: InventoryItem): boolean {
    if (!item.expirationDate) return false;
    return new Date(item.expirationDate) < new Date();
  }

  /**
   * Calcular status automático
   */
  static calculateStatus(item: InventoryItem): ItemStatus {
    if (this.isExpired(item)) return ItemStatus.EXPIRED;
    if (this.isOutOfStock(item)) return ItemStatus.OUT_OF_STOCK;
    if (this.isLowStock(item)) return ItemStatus.LOW_STOCK;
    return ItemStatus.AVAILABLE;
  }

  /**
   * Verificar se pode realizar saída
   */
  static canPerformOutput(item: InventoryItem, quantity: number): boolean {
    return item.quantity >= quantity && !this.isExpired(item);
  }

  /**
   * Calcular valor total em estoque
   */
  static calculateTotalValue(item: InventoryItem): number {
    return item.quantity * item.costPrice;
  }
}

/**
 * Helpers para cores de status
 */
export function getItemStatusColor(status: ItemStatus): string {
  const colors: Record<ItemStatus, string> = {
    [ItemStatus.AVAILABLE]: 'bg-green-100 text-green-800',
    [ItemStatus.LOW_STOCK]: 'bg-yellow-100 text-yellow-800',
    [ItemStatus.OUT_OF_STOCK]: 'bg-red-100 text-red-800',
    [ItemStatus.EXPIRED]: 'bg-gray-100 text-gray-800',
    [ItemStatus.RESERVED]: 'bg-blue-100 text-blue-800',
  };
  return colors[status];
}

export function getMovementTypeColor(type: MovementType): string {
  const colors: Record<MovementType, string> = {
    [MovementType.IN]: 'bg-green-100 text-green-800',
    [MovementType.OUT]: 'bg-red-100 text-red-800',
    [MovementType.ADJUSTMENT]: 'bg-blue-100 text-blue-800',
    [MovementType.TRANSFER]: 'bg-purple-100 text-purple-800',
  };
  return colors[type];
}
