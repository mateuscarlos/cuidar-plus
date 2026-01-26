import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Inventory = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Insumos & Farmácia</h2>
          <p className="text-muted-foreground">Controle de estoque e dispensação.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Entrada de Nota</Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Novo Item
          </Button>
        </div>
      </div>

      <Tabs defaultValue="medication" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-[400px]">
          <TabsTrigger value="medication">Medicamentos</TabsTrigger>
          <TabsTrigger value="supplies">Descartáveis</TabsTrigger>
          <TabsTrigger value="equipment">Equipamentos</TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Inventário Atual</CardTitle>
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Buscar item..."
                    className="pl-9"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                    <tr>
                      <th className="px-4 py-3">Item</th>
                      <th className="px-4 py-3">Lote</th>
                      <th className="px-4 py-3">Validade</th>
                      <th className="px-4 py-3">Qtd. Atual</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {[
                      { name: "Dipirona 500mg/ml", batch: "L2023-01", exp: "12/2025", qty: "150 frascos", status: "OK" },
                      { name: "Omeprazol 20mg", batch: "L2023-44", exp: "06/2025", qty: "400 caps", status: "OK" },
                      { name: "Soro Fisiológico 0.9%", batch: "S-992", exp: "01/2025", qty: "5 un", status: "Crítico" },
                    ].map((item, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{item.name}</td>
                        <td className="px-4 py-3 text-gray-500">{item.batch}</td>
                        <td className="px-4 py-3 text-gray-500">{item.exp}</td>
                        <td className="px-4 py-3 font-medium">{item.qty}</td>
                        <td className="px-4 py-3">
                          <span className={item.status === "Crítico" ? "text-red-600 font-medium" : "text-green-600 font-medium"}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <TabsContent value="medication">{/* Content handled above for demo */}</TabsContent>
        <TabsContent value="supplies">{/* Content handled above for demo */}</TabsContent>
      </Tabs>
    </div>
  );
};

export default Inventory;