/**
 * Patient List Component
 * Lista de pacientes com estados de loading e empty
 */

import { PatientCard } from './PatientCard';
import { Patient } from '../../domain';
import { Skeleton } from '@/shared/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/shared/ui/alert';
import { Card, CardContent } from '@/shared/ui/card';

interface PatientListProps {
  patients: Patient[];
  isLoading: boolean;
  isError: boolean;
  error?: Error | null;
  onViewDetails: (id: string) => void;
}

function PatientCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-start gap-3">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
          <div className="flex gap-1 flex-col items-end">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-14 rounded-full" />
          </div>
        </div>

        <div className="mb-3 p-2 bg-muted/50 rounded-md">
           <Skeleton className="h-4 w-full" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
             <Skeleton className="h-4 w-28" />
          </div>
        </div>

        <Skeleton className="h-9 w-full mt-4" />
      </CardContent>
    </Card>
  );
}

export function PatientList({ 
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
          <PatientCardSkeleton key={i} />
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
}
