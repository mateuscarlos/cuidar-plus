/**
 * Inventory Page
 */

import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Skeleton } from '@/shared/ui/skeleton';
import { Plus, Package, AlertTriangle, TrendingDown, AlertCircle } from 'lucide-react';
import { useInventoryItems } from '../hooks';
import { InventoryFilters, ItemStatus } from '../../domain';
import { Badge } from '@/shared/ui/badge';
import { getItemStatusColor } from '../../domain/InventoryItem.rules';
import { formatCurrency } from '@/core/lib/formatters';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';

export function InventoryPage() {
  const [filters, setFilters] = useState<InventoryFilters>({ page: 1, pageSize: 20 });
  const { data, isLoading, isError, error } = useInventoryItems(filters);

  const stats = {
    total: data?.data.length || 0,
    lowStock: data?.data.filter(i => i.status === ItemStatus.LOW_STOCK).length || 0,
    outOfStock: data?.data.filter(i => i.status === ItemStatus.OUT_OF_STOCK).length || 0,
    expired: data?.data.filter(i => i.status === ItemStatus.EXPIRED).length || 0,
  };

  const handleClearFilters = () => {
    setFilters({ page: 1, pageSize: 20 });
  };

  if (isError) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>
            {error?.message || 'Ocorreu um erro ao carregar o inventário. Tente novamente mais tarde.'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

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
                <Package className="h-6 w-6 text-blue-600" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Itens</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-16 mt-1" />
                ) : (
                  <p className="text-2xl font-bold">{stats.total}</p>
                )}
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
                {isLoading ? (
                  <Skeleton className="h-8 w-16 mt-1" />
                ) : (
                  <p className="text-2xl font-bold">{stats.lowStock}</p>
                )}
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
                {isLoading ? (
                  <Skeleton className="h-8 w-16 mt-1" />
                ) : (
                  <p className="text-2xl font-bold">{stats.outOfStock}</p>
                )}
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
                {isLoading ? (
                  <Skeleton className="h-8 w-16 mt-1" />
                ) : (
                  <p className="text-2xl font-bold">{stats.expired}</p>
                )}
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
              <TableHeader className="bg-gray-50">
                <TableRow>
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
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-4 w-[60px] ml-auto" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-4 w-[80px] ml-auto" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-[100px] rounded-full" /></TableCell>
                    </TableRow>
                  ))
                ) : !data?.data || data.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-[300px] text-center">
                      <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                        <AlertCircle className="h-12 w-12 text-muted-foreground/50" aria-hidden="true" />
                        <h3 className="text-lg font-semibold text-foreground">Nenhum item encontrado</h3>
                        <p>Não encontramos itens com os filtros atuais.</p>
                        <Button variant="outline" className="mt-4" onClick={handleClearFilters}>
                          Limpar filtros
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  data.data.map((item) => (
                    <TableRow key={item.id} className="hover:bg-gray-50/50">
                      <TableCell className="font-mono text-xs font-medium">{item.code}</TableCell>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell className="text-right">
                        <span className={item.quantity <= item.minQuantity ? 'text-destructive font-semibold' : ''}>
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
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default InventoryPage;
