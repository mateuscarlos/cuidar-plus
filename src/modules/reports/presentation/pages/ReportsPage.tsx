/**
 * Reports Page
 */

import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { FileText, Download, TrendingUp, DollarSign, Package, Users } from 'lucide-react';
import { useReports, useReportSummary } from '../hooks';
import { ReportFilters } from '../../domain';
import { Badge } from '@/shared/ui/badge';
import { formatCurrency, formatDate } from '@/core/lib/formatters';
import { ReportValidator } from '../../domain/Report.rules';

export function ReportsPage() {
  const [filters] = useState<ReportFilters>({ page: 1, pageSize: 20 });
  const { data, isLoading } = useReports(filters);
  
  const dateRange = ReportValidator.getDefaultDateRange('MONTHLY' as any);
  const { data: summary } = useReportSummary(dateRange.startDate, dateRange.endDate);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Relatórios</h2>
          <p className="text-muted-foreground">Análises e indicadores gerenciais</p>
        </div>
        <Button className="gap-2">
          <FileText className="h-4 w-4" /> Novo Relatório
        </Button>
      </div>

      {summary && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pacientes Ativos</p>
                  <p className="text-2xl font-bold">{summary.activePatients}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Receita</p>
                  <p className="text-2xl font-bold">{formatCurrency(summary.totalRevenue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Package className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Valor Estoque</p>
                  <p className="text-2xl font-bold">{formatCurrency(summary.inventoryValue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Lucro</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(summary.totalRevenue - summary.totalExpenses)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Relatórios Gerados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading ? (
              <div className="py-8 text-center">Carregando...</div>
            ) : data?.data.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-100 rounded">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{report.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(report.createdAt)} • {report.type}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={report.status === 'COMPLETED' ? 'default' : 'secondary'}>
                    {report.status}
                  </Badge>
                  {report.status === 'COMPLETED' && (
                    <Button size="sm" variant="outline" className="gap-2">
                      <Download className="h-4 w-4" /> Baixar
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ReportsPage;
