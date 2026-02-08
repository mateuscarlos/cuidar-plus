/**
 * Inventory Page
 */

import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Plus, Package, AlertTriangle, TrendingDown } from 'lucide-react';
import { useInventoryItems } from '../hooks';
import { InventoryFilters, ItemStatus } from '../../domain';
import { Badge } from '@/shared/ui/badge';
import { Skeleton } from '@/shared/ui/skeleton';
import { getItemStatusColor } from '../../domain/InventoryItem.rules';
import { formatCurrency } from '@/core/lib/formatters';

export function InventoryPage() {
  const [filters, setFilters] = useState<InventoryFilters>({ page: 1, pageSize: 20 });
  const { data, isLoading } = useInventoryItems(filters);

  const stats = {
    total: data?.data.length || 0,
    lowStock: data?.data.filter(i => i.status === ItemStatus.LOW_STOCK).length || 0,
    outOfStock: data?.data.filter(i => i.status === ItemStatus.OUT_OF_STOCK).length || 0,
    expired: data?.data.filter(i => i.status === ItemStatus.EXPIRED).length || 0,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Inventário</h2>
          <p className="text-muted-foreground">Controle de estoque e insumos</p>
        </div>
        <Button className="gap-2" aria-label="Adicionar novo item ao inventário">
          <Plus className="h-4 w-4" aria-hidden="true" /> Novo Item
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Itens</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <TrendingDown className="h-6 w-6 text-yellow-600" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Estoque Baixo</p>
                <p className="text-2xl font-bold">{stats.lowStock}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sem Estoque</p>
                <p className="text-2xl font-bold">{stats.outOfStock}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gray-100 rounded-lg">
                <Package className="h-6 w-6 text-gray-600" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Vencidos</p>
                <p className="text-2xl font-bold">{stats.expired}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Itens</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left">Código</th>
                  <th scope="col" className="px-4 py-3 text-left">Nome</th>
                  <th scope="col" className="px-4 py-3 text-left">Categoria</th>
                  <th scope="col" className="px-4 py-3 text-right">Quantidade</th>
                  <th scope="col" className="px-4 py-3 text-right">Valor Unit.</th>
                  <th scope="col" className="px-4 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={6} className="px-4 py-4">
                        <Skeleton className="h-8 w-full" />
                      </td>
                    </tr>
                  ))
                ) : data?.data && data.data.length > 0 ? (
                  data.data.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-xs">{item.code}</td>
                      <td className="px-4 py-3 font-medium">{item.name}</td>
                      <td className="px-4 py-3">{item.category}</td>
                      <td className="px-4 py-3 text-right">
                        <span className={item.quantity <= item.minQuantity ? 'text-red-600 font-semibold' : ''}>
                          {item.quantity} {item.unit}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">{formatCurrency(item.costPrice)}</td>
                      <td className="px-4 py-3">
                        <Badge className={getItemStatusColor(item.status)} variant="secondary">
                          {item.status}
                        </Badge>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Package className="h-8 w-8 text-muted-foreground/50" aria-hidden="true" />
                        <p>Nenhum item encontrado no inventário.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default InventoryPage;
