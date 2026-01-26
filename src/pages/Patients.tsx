import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";

const Patients = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Pacientes</h2>
          <p className="text-muted-foreground">Gerenciamento de admissões e prontuários.</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Novo Paciente
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Lista de Pacientes</CardTitle>
            <div className="flex gap-2">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Buscar paciente..."
                  className="pl-9 w-[200px] lg:w-[300px]"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                <tr>
                  <th className="px-4 py-3">Nome</th>
                  <th className="px-4 py-3">Diagnóstico</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Última Visita</th>
                  <th className="px-4 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {[
                  { name: "Maria Silva", diag: "DPOC", status: "Ativo", last: "Hoje" },
                  { name: "João Santos", diag: "Pós-Op Ortopédico", status: "Ativo", last: "Ontem" },
                  { name: "Ana Oliveira", diag: "Diabetes Tipo 2", status: "Pendente", last: "12/05/2024" },
                ].map((patient, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{patient.name}</td>
                    <td className="px-4 py-3">{patient.diag}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {patient.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{patient.last}</td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                        Detalhes
                      </Button>
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
};

export default Patients;