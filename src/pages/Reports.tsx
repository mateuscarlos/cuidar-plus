import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/shared/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Label } from "@/shared/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { FileText, Download, Printer, Filter, Table as TableIcon } from "lucide-react";
import { toast } from "sonner";

const data = [
  { name: 'Jan', atendimentos: 400, novos: 24 },
  { name: 'Fev', atendimentos: 300, novos: 13 },
  { name: 'Mar', atendimentos: 550, novos: 38 },
  { name: 'Abr', atendimentos: 480, novos: 20 },
  { name: 'Mai', atendimentos: 600, novos: 45 },
  { name: 'Jun', atendimentos: 700, novos: 50 },
];

const Reports = () => {
  const [isGenerated, setIsGenerated] = useState(false);

  const handleGenerate = () => {
    setIsGenerated(true);
    toast.success("Relatório gerado com sucesso!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Relatórios e Acompanhamentos</h2>
        <p className="text-muted-foreground">Análise de métricas e performance.</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="custom">Relatório Personalizado</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Atendimentos por Mês</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                      />
                      <Bar dataKey="atendimentos" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Novos Pacientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                         contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                      />
                      <Line type="monotone" dataKey="novos" stroke="#10b981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="custom" className="mt-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-1 h-fit">
              <CardHeader>
                <CardTitle>Configurar Relatório</CardTitle>
                <CardDescription>Selecione os parâmetros para gerar.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Tipo de Relatório</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="patients">Pacientes Ativos</SelectItem>
                      <SelectItem value="inventory">Movimentação de Estoque</SelectItem>
                      <SelectItem value="financial">Faturamento por Convênio</SelectItem>
                      <SelectItem value="visits">Visitas Realizadas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Período</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground">Início</span>
                      <Input type="date" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground">Fim</span>
                      <Input type="date" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Filtrar por Status</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="active">Ativos</SelectItem>
                      <SelectItem value="inactive">Inativos/Finalizados</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full gap-2" onClick={handleGenerate}>
                  <FileText className="h-4 w-4" /> Gerar Relatório
                </Button>
              </CardFooter>
            </Card>

            <Card className="md:col-span-2 min-h-[500px]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardTitle>Pré-visualização</CardTitle>
                  <CardDescription>
                    {isGenerated ? "Resultados encontrados: 12 registros" : "Configure os filtros ao lado para visualizar os dados."}
                  </CardDescription>
                </div>
                {isGenerated && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Printer className="h-4 w-4 mr-2" /> Imprimir
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" /> Excel
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                {!isGenerated ? (
                  <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground border-2 border-dashed rounded-lg">
                    <Filter className="h-12 w-12 mb-4 opacity-20" />
                    <p>Aguardando geração do relatório...</p>
                  </div>
                ) : (
                  <div className="rounded-md border mt-4">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                        <tr>
                          <th className="px-4 py-3">Data</th>
                          <th className="px-4 py-3">Paciente / Item</th>
                          <th className="px-4 py-3">Categoria</th>
                          <th className="px-4 py-3 text-right">Valor / Qtd</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                          <tr key={i} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-gray-500">24/05/2024</td>
                            <td className="px-4 py-3 font-medium">Registro Exemplo #{i}</td>
                            <td className="px-4 py-3">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Categoria A
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right text-gray-600">
                              {Math.floor(Math.random() * 1000)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;