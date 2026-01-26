import { useEffect, useState } from "react";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Plus, Building, Phone, Mail, MapPin, Clock, Star } from "lucide-react";
import { Provider } from "@/modules/providers";
import { ProviderService } from "@/modules/providers/data/provider.service";

const ProvidersPage = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      const data = await ProviderService.findAll();
      setProviders(data);
    } catch (error) {
      console.error('Erro ao carregar prestadoras:', error);
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
      case 'PENDING_APPROVAL':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
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
      case 'PENDING_APPROVAL':
        return 'Pendente';
      default:
        return status;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'HOSPITAL':
        return 'Hospital';
      case 'CLINICA':
        return 'Clínica';
      case 'LABORATORIO':
        return 'Laboratório';
      case 'COOPERATIVA':
        return 'Cooperativa';
      case 'CONSULTORIO':
        return 'Consultório';
      case 'CENTRO_DIAGNOSTICO':
        return 'Centro Diagnóstico';
      case 'HOME_CARE':
        return 'Home Care';
      default:
        return type;
    }
  };

  const getSpecialtyLabel = (specialty: string) => {
    const labels: Record<string, string> = {
      'CARDIOLOGIA': 'Cardiologia',
      'ORTOPEDIA': 'Ortopedia',
      'PEDIATRIA': 'Pediatria',
      'GINECOLOGIA': 'Ginecologia',
      'NEUROLOGIA': 'Neurologia',
      'PSIQUIATRIA': 'Psiquiatria',
      'DERMATOLOGIA': 'Dermatologia',
      'OFTALMOLOGIA': 'Oftalmologia',
      'ONCOLOGIA': 'Oncologia',
      'GERAL': 'Geral',
    };
    return labels[specialty] || specialty;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando prestadoras...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Prestadoras de Serviço</h2>
          <p className="text-muted-foreground">Gerencie cooperativas e prestadores de serviços de saúde.</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Nova Prestadora
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{providers.length}</div>
            <p className="text-xs text-muted-foreground">Prestadoras</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ativas</CardTitle>
            <Building className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {providers.filter(p => p.status === 'ACTIVE').length}
            </div>
            <p className="text-xs text-muted-foreground">Em operação</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Com Emergência</CardTitle>
            <Clock className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {providers.filter(p => p.hasEmergency).length}
            </div>
            <p className="text-xs text-muted-foreground">Atendimento 24h</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Serviços</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {providers.reduce((acc, p) => acc + p.services.length, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Disponíveis</p>
          </CardContent>
        </Card>
      </div>

      {/* Providers List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {providers.map((provider) => (
          <Card key={provider.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">{provider.name}</CardTitle>
                    <CardDescription className="truncate">{provider.tradeName}</CardDescription>
                  </div>
                </div>
                <Badge className={getStatusColor(provider.status)}>
                  {getStatusLabel(provider.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Type and Rating */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Tipo:</span>
                <span className="font-medium">{getTypeLabel(provider.type)}</span>
              </div>
              
              {provider.rating && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Avaliação:</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{provider.rating.toFixed(1)}</span>
                  </div>
                </div>
              )}

              {/* Specialties */}
              <div>
                <span className="text-sm text-muted-foreground">Especialidades:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {provider.specialties.slice(0, 3).map((specialty) => (
                    <Badge key={specialty} variant="outline" className="text-xs">
                      {getSpecialtyLabel(specialty)}
                    </Badge>
                  ))}
                  {provider.specialties.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{provider.specialties.length - 3}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Emergency Badge */}
              {provider.hasEmergency && (
                <Badge className="bg-red-100 text-red-800 border-red-200 w-full justify-center">
                  <Clock className="h-3 w-3 mr-1" />
                  Atendimento de Emergência
                </Badge>
              )}

              {/* Contact Info */}
              <div className="pt-4 border-t space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  {provider.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{provider.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {provider.address.city}, {provider.address.state}
                </div>
              </div>

              {/* Services */}
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Serviços</span>
                  <Badge variant="secondary" className="text-xs">
                    {provider.services.length}
                  </Badge>
                </div>
                {provider.services.length > 0 && (
                  <div className="space-y-1">
                    {provider.services.slice(0, 2).map((service) => (
                      <div key={service.id} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground truncate">{service.name}</span>
                        <span className="text-xs font-medium">
                          R$ {service.price.toFixed(2)}
                        </span>
                      </div>
                    ))}
                    {provider.services.length > 2 && (
                      <p className="text-xs text-muted-foreground pt-1">
                        + {provider.services.length - 2} {provider.services.length - 2 === 1 ? 'outro' : 'outros'}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Capacity */}
              {provider.capacity && (
                <div className="flex items-center justify-between text-sm pt-4 border-t">
                  <span className="text-muted-foreground">Capacidade:</span>
                  <span className="font-medium">{provider.capacity} atendimentos/dia</span>
                </div>
              )}

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

      {providers.length === 0 && (
        <Card className="p-12">
          <div className="text-center">
            <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma prestadora cadastrada</h3>
            <p className="text-muted-foreground mb-4">
              Comece cadastrando a primeira prestadora de serviço.
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" /> Cadastrar Prestadora
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ProvidersPage;
