/**
 * Patients Page
 * Página principal de gerenciamento de pacientes
 * Arquitetura modular: separação de domínio, dados e apresentação
 */

import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Plus } from 'lucide-react';
import { PatientList, PatientFilters } from '../components';
import { usePatients } from '../hooks';
import { PatientStatus, PatientPriority, PatientFilters as IPatientFilters } from '../../domain';

export function PatientsPage() {
  const [filters, setFilters] = useState<IPatientFilters>({
    page: 1,
    pageSize: 20,
  });

  const { data, isLoading, isError, error } = usePatients(filters);

  const handleSearchChange = (search: string) => {
    setFilters(prev => ({ ...prev, search: search || undefined, page: 1 }));
  };

  const handleStatusChange = (status: PatientStatus | 'all') => {
    setFilters(prev => ({ 
      ...prev, 
      status: status === 'all' ? undefined : status,
      page: 1 
    }));
  };

  const handlePriorityChange = (priority: PatientPriority | 'all') => {
    setFilters(prev => ({ 
      ...prev, 
      priority: priority === 'all' ? undefined : priority,
      page: 1 
    }));
  };

  const handleViewDetails = (id: string) => {
    // TODO: Navegar para página de detalhes ou abrir modal
    console.log('Ver detalhes do paciente:', id);
  };

  const handleCreatePatient = () => {
    // TODO: Abrir modal ou navegar para página de criação
    console.log('Criar novo paciente');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Pacientes
          </h2>
          <p className="text-muted-foreground">
            Gerenciamento de admissões e prontuários
          </p>
        </div>
        <Button className="gap-2" onClick={handleCreatePatient}>
          <Plus className="h-4 w-4" /> Novo Paciente
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <PatientFilters
            onSearchChange={handleSearchChange}
            onStatusChange={handleStatusChange}
            onPriorityChange={handlePriorityChange}
          />
        </CardContent>
      </Card>

      {/* Patient List */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Lista de Pacientes</CardTitle>
            {data?.pagination && (
              <span className="text-sm text-muted-foreground">
                {data.pagination.total} paciente{data.pagination.total !== 1 ? 's' : ''} encontrado{data.pagination.total !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <PatientList
            patients={data?.data || []}
            isLoading={isLoading}
            isError={isError}
            error={error}
            onViewDetails={handleViewDetails}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default PatientsPage;
