/**
 * Patient Card Component
 * Exibe informações resumidas de um paciente em formato de card
 */

import { memo } from 'react';
import { Card, CardContent } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { User, Calendar, Activity, Phone } from 'lucide-react';
import { Patient } from '../../domain';
import { getStatusColor, getPriorityColor, PatientValidator } from '../../domain/Patient.rules';
import { formatDate, formatPhone } from '@/core/lib/formatters';

interface PatientCardProps {
  patient: Patient;
  onViewDetails: (id: string) => void;
}

// Memoized to prevent re-renders when parent state changes
export const PatientCard = memo(function PatientCard({ patient, onViewDetails }: PatientCardProps) {
  const age = PatientValidator.calculateAge(patient.birthDate);
  
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onViewDetails(patient.id)}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{patient.name}</h3>
              <p className="text-sm text-muted-foreground">
                {patient.medicalRecordNumber}
              </p>
            </div>
          </div>
          <div className="flex gap-1 flex-col items-end">
            <Badge className={getStatusColor(patient.status)} variant="secondary">
              {patient.status}
            </Badge>
            {patient.priority && (
              <Badge className={getPriorityColor(patient.priority)} variant="secondary">
                {patient.priority}
              </Badge>
            )}
          </div>
        </div>

        {patient.diagnosis && (
          <div className="mb-3 p-2 bg-muted rounded-md">
            <p className="text-sm">
              <span className="font-medium">Diagnóstico:</span> {patient.diagnosis}
            </p>
          </div>
        )}

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>{age} anos • {patient.gender}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            <span>{formatPhone(patient.contact.phone)}</span>
          </div>

          {patient.attendingPhysician && (
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              <span>{patient.attendingPhysician}</span>
            </div>
          )}

          {patient.lastVisit && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Última visita: {formatDate(patient.lastVisit)}</span>
            </div>
          )}

          {patient.room && patient.bed && (
            <div className="mt-2 pt-2 border-t">
              <span className="font-medium">Leito:</span> Quarto {patient.room}, Leito {patient.bed}
            </div>
          )}
        </div>

        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full mt-4"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(patient.id);
          }}
        >
          Ver Detalhes
        </Button>
      </CardContent>
    </Card>
  );
});
