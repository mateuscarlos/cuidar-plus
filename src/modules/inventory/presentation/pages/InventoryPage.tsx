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
import { getItemStatusColor } from '../../domain/InventoryItem.rules';
import { formatCurrency } from '@/core/lib/formatters';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table';
import { Skeleton } from '@/shared/ui/skeleton';

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
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="w-[100px]" scope="col">Código</TableHead>
                  <TableHead scope="col">Nome</TableHead>
                  <TableHead scope="col">Categoria</TableHead>
                  <TableHead className="text-right" scope="col">Quantidade</TableHead>
                  <TableHead className="text-right" scope="col">Valor Unit.</TableHead>
                  <TableHead scope="col">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-4 w-[40px] ml-auto" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-4 w-[80px] ml-auto" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                    </TableRow>
                  ))
                ) : data?.data.map((item) => (
                  <TableRow key={item.id} className="hover:bg-gray-50">
                    <TableCell className="font-mono text-xs">{item.code}</TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell className="text-right">
                      <span className={item.quantity <= item.minQuantity ? 'text-red-600 font-semibold' : ''}>
                        {item.quantity} {item.unit}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(item.costPrice)}</TableCell>
                    <TableCell>
                      <Badge className={getItemStatusColor(item.status)} variant="secondary">
                        {item.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default InventoryPage;
