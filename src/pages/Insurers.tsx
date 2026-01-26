import { useEffect, useState } from "react";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Plus, Building2, Phone, Mail, MapPin, FileText } from "lucide-react";
import { Insurer } from "@/modules/insurers";
import { InsurerService } from "@/modules/insurers/data/insurer.service";

const InsurersPage = () => {
  const [insurers, setInsurers] = useState<Insurer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInsurers();
  }, []);

  const loadInsurers = async () => {
    try {
      const data = await InsurerService.findAll();
      setInsurers(data);
    } catch (error) {
      console.error('Erro ao carregar operadoras:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'SUSPENDED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'Ativo';
      case 'INACTIVE':
        return 'Inativo';
      case 'SUSPENDED':
        return 'Suspenso';
      default:
        return status;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'MEDICINA_GRUPO':
        return 'Medicina de Grupo';
      case 'COOPERATIVA':
        return 'Cooperativa';
      case 'AUTOGESTAO':
        return 'Autogestão';
      case 'FILANTROPIA':
        return 'Filantropia';
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando operadoras...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Operadoras de Saúde</h2>
          <p className="text-muted-foreground">Gerencie operadoras de saúde e seus planos.</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Nova Operadora
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Operadoras</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insurers.length}</div>
            <p className="text-xs text-muted-foreground">Cadastradas no sistema</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Operadoras Ativas</CardTitle>
            <Building2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {insurers.filter(i => i.status === 'ACTIVE').length}
            </div>
            <p className="text-xs text-muted-foreground">Com contratos ativos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Planos</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {insurers.reduce((acc, insurer) => acc + insurer.plans.length, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Planos disponíveis</p>
          </CardContent>
        </Card>
      </div>

      {/* Insurers List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {insurers.map((insurer) => (
          <Card key={insurer.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{insurer.name}</CardTitle>
                    <CardDescription>{insurer.tradeName}</CardDescription>
                  </div>
                </div>
                <Badge className={getStatusColor(insurer.status)}>
                  {getStatusLabel(insurer.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Type and Registration */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Tipo:</span>
                <span className="font-medium">{getTypeLabel(insurer.type)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Registro ANS:</span>
                <span className="font-medium">{insurer.registrationNumber}</span>
              </div>

              {/* Contact Info */}
              <div className="pt-4 border-t space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  {insurer.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {insurer.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {insurer.address.city}, {insurer.address.state}
                </div>
              </div>

              {/* Plans */}
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Planos</span>
                  <Badge variant="secondary" className="text-xs">
                    {insurer.plans.length} {insurer.plans.length === 1 ? 'plano' : 'planos'}
                  </Badge>
                </div>
                <div className="space-y-1">
                  {insurer.plans.slice(0, 2).map((plan) => (
                    <div key={plan.id} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground truncate">{plan.name}</span>
                      <Badge 
                        variant="outline" 
                        className={plan.active ? 'text-green-600 border-green-200' : 'text-gray-600'}
                      >
                        {plan.active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                  ))}
                  {insurer.plans.length > 2 && (
                    <p className="text-xs text-muted-foreground pt-1">
                      + {insurer.plans.length - 2} {insurer.plans.length - 2 === 1 ? 'outro' : 'outros'}
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  Ver Detalhes
                </Button>
                <Button variant="ghost" size="sm" className="flex-1">
                  Editar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {insurers.length === 0 && (
        <Card className="p-12">
          <div className="text-center">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma operadora cadastrada</h3>
            <p className="text-muted-foreground mb-4">
              Comece cadastrando a primeira operadora de saúde.
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" /> Cadastrar Operadora
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default InsurersPage;
