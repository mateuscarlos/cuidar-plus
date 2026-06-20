/**
 * Inventory Page
 */

import { useState, useMemo } from 'react';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Plus, Package, AlertTriangle, TrendingDown } from 'lucide-react';
import { useInventoryItems } from '../hooks';
import { InventoryFilters, ItemStatus } from '../../domain';
import { Badge } from '@/shared/ui/badge';
import { getItemStatusColor } from '../../domain/InventoryItem.rules';
import { formatCurrency } from '@/core/lib/formatters';

export function InventoryPage() {
  const [filters, setFilters] = useState<InventoryFilters>({ page: 1, pageSize: 20 });
  const { data, isLoading } = useInventoryItems(filters);

  const stats = useMemo(() => {
    const items = data?.data || [];
    return items.reduce(
      (acc, item) => {
        acc.total++;
        if (item.status === ItemStatus.LOW_STOCK) acc.lowStock++;
        else if (item.status === ItemStatus.OUT_OF_STOCK) acc.outOfStock++;
        else if (item.status === ItemStatus.EXPIRED) acc.expired++;
        return acc;
      },
      { total: 0, lowStock: 0, outOfStock: 0, expired: 0 }
    );
  }, [data?.data]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Inventário</h2>
          <p className="text-muted-foreground">Controle de estoque e insumos</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Novo Item
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
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
                <TrendingDown className="h-6 w-6 text-yellow-600" />
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
                <AlertTriangle className="h-6 w-6 text-red-600" />
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
                <Package className="h-6 w-6 text-gray-600" />
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
                  <th className="px-4 py-3 text-left">Código</th>
                  <th className="px-4 py-3 text-left">Nome</th>
                  <th className="px-4 py-3 text-left">Categoria</th>
                  <th className="px-4 py-3 text-right">Quantidade</th>
                  <th className="px-4 py-3 text-right">Valor Unit.</th>
                  <th className="px-4 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {isLoading ? (
                  <tr><td colSpan={6} className="px-4 py-8 text-center">Carregando...</td></tr>
                ) : data?.data.map((item) => (
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
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default InventoryPage;
