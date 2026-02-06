/**
 * Patients Page
 * Página principal de gerenciamento de pacientes
 * Arquitetura modular: separação de domínio, dados e apresentação
 */

import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { Plus } from 'lucide-react';
import { PatientList, PatientFilters, PatientForm } from '../components';
import { usePatients } from '../hooks';
import { PatientStatus, PatientPriority, PatientFilters as IPatientFilters } from '../../domain';
import { PatientFormData } from '../forms/PatientFormSchema';
import { useToast } from '@/shared/hooks/use-toast';

export function PatientsPage() {
  const [filters, setFilters] = useState<IPatientFilters>({
    page: 1,
    pageSize: 20,
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();

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

  const handleClearFilters = () => {
    setFilters({
      page: 1,
      pageSize: 20,
    });
  };

  const hasActiveFilters = !!(filters.search || filters.status || filters.priority);

  const handleViewDetails = (id: string) => {
    // TODO: Navegar para página de detalhes ou abrir modal
    console.log('Ver detalhes do paciente:', id);
  };

  const handleCreatePatient = () => {
    setIsFormOpen(true);
  };

  const handleSubmitPatient = (data: PatientFormData) => {
    // TODO: Implementar chamada ao backend quando estiver pronto
    console.log('Dados do paciente:', data);
    
    toast({
      title: 'Paciente cadastrado com sucesso!',
      description: `${data.name} foi adicionado ao sistema.`,
    });
    
    setIsFormOpen(false);
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
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
            currentSearch={filters.search}
            currentStatus={filters.status}
            currentPriority={filters.priority}
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
            hasActiveFilters={hasActiveFilters}
            onClearFilters={handleClearFilters}
          />
        </CardContent>
      </Card>

      {/* Modal do Formulário de Cadastro */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] p-0">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle>Cadastro de Paciente</DialogTitle>
            <DialogDescription>
              Preencha os dados do paciente. Campos marcados com * são obrigatórios.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[calc(90vh-100px)] px-6">
            <div className="pb-6">
              <PatientForm 
                onSubmit={handleSubmitPatient} 
                onCancel={handleCancelForm}
              />
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default PatientsPage;
