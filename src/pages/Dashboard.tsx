import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Users, AlertCircle, Package, Activity } from "lucide-react";
import { useAuth } from "@/core/hooks/useAuth";

const StatCard = ({ title, value, description, icon: Icon, trend }: any) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground mt-1">
        {description}
      </p>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const { user } = useAuth();
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          Bem vindo, {user?.name || 'Usuário'}
        </h2>
        <p className="text-muted-foreground">Visão geral da operação de Homecare.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total de Pacientes"
          value="128"
          description="+4 novos este mês"
          icon={Users}
        />
        <StatCard
          title="Atendimentos Hoje"
          value="45"
          description="12 pendentes"
          icon={Activity}
        />
        <StatCard
          title="Alerta de Estoque"
          value="7"
          description="Itens com estoque baixo"
          icon={AlertCircle}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Atendimentos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                  <div className="flex items-center gap-4">
                    <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Maria Silva</p>
                      <p className="text-xs text-gray-500">Fisioterapia Respiratória</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">Há 2 horas</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Alertas de Insumos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-red-50 rounded-lg border border-red-100">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-sm font-medium text-red-900">Soro Fisiológico 0.9%</p>
                  <p className="text-xs text-red-700">Estoque Crítico: 5 unidades</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                <Package className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium text-yellow-900">Luvas de Procedimento (M)</p>
                  <p className="text-xs text-yellow-700">Estoque Baixo: 20 caixas</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;