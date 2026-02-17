/**
 * Patient List Component
 * Lista de pacientes com estados de loading e empty
 */

import { memo } from 'react';
import { PatientCard } from './PatientCard';
import { Patient } from '../../domain';
import { Skeleton } from '@/shared/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/shared/ui/alert';

interface PatientListProps {
  patients: Patient[];
  isLoading: boolean;
  isError: boolean;
  error?: Error | null;
  onViewDetails: (id: string) => void;
}

export const PatientList = memo(function PatientList({
  patients, 
  isLoading, 
  isError, 
  error,
  onViewDetails 
}: PatientListProps) {
  // Loading State
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-48 w-full" />
          </div>
        ))}
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error?.message || 'Erro ao carregar pacientes. Tente novamente.'}
        </AlertDescription>
      </Alert>
    );
  }

  // Empty State
  if (patients.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Nenhum paciente encontrado</h3>
        <p className="text-muted-foreground">
          Ajuste os filtros ou cadastre um novo paciente
        </p>
      </div>
    );
  }

  // Success State
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {patients.map((patient) => (
        <PatientCard
          key={patient.id}
          patient={patient}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
});
