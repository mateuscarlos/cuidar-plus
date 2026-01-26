import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  PatientService,
  CreatePatientRequest,
  UpdatePatientRequest,
  PatientResponse,
} from '@/core/services/api';

/**
 * Hook para buscar paciente por ID
 */
export function usePatient(patientId: string) {
  return useQuery({
    queryKey: ['patient', patientId],
    queryFn: () => PatientService.getById(patientId),
    enabled: !!patientId,
  });
}

/**
 * Hook para listar pacientes de um cuidador
 */
export function usePatientsByCaregiver(caregiverId: string) {
  return useQuery({
    queryKey: ['patients', 'caregiver', caregiverId],
    queryFn: () => PatientService.listByCaregiver(caregiverId),
    enabled: !!caregiverId,
  });
}

/**
 * Hook para criar paciente
 */
export function useCreatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePatientRequest) => PatientService.create(data),
    onSuccess: (newPatient: PatientResponse) => {
      // Invalida cache de lista de pacientes do cuidador
      queryClient.invalidateQueries({
        queryKey: ['patients', 'caregiver', newPatient.caregiver_id],
      });
    },
  });
}

/**
 * Hook para atualizar paciente
 */
export function useUpdatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePatientRequest }) =>
      PatientService.update(id, data),
    onSuccess: (updatedPatient: PatientResponse) => {
      // Atualiza cache do paciente específico
      queryClient.invalidateQueries({
        queryKey: ['patient', updatedPatient.id],
      });
      // Invalida cache de lista de pacientes
      queryClient.invalidateQueries({
        queryKey: ['patients', 'caregiver', updatedPatient.caregiver_id],
      });
    },
  });
}

/**
 * Hook para deletar paciente
 */
export function useDeletePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (patientId: string) => PatientService.delete(patientId),
    onSuccess: () => {
      // Invalida todas as listas de pacientes
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
}

/**
 * Hook para ativar/desativar paciente
 */
export function useTogglePatientStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, activate }: { id: string; activate: boolean }) =>
      activate ? PatientService.activate(id) : PatientService.deactivate(id),
    onSuccess: (updatedPatient: PatientResponse) => {
      queryClient.invalidateQueries({
        queryKey: ['patient', updatedPatient.id],
      });
      queryClient.invalidateQueries({
        queryKey: ['patients', 'caregiver', updatedPatient.caregiver_id],
      });
    },
  });
}
