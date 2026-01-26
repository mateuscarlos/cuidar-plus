import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  MedicationService,
  CreateMedicationRequest,
  UpdateMedicationRequest,
  MedicationResponse,
} from '@/core/services/api';

/**
 * Hook para buscar medicamento por ID
 */
export function useMedication(medicationId: string) {
  return useQuery({
    queryKey: ['medication', medicationId],
    queryFn: () => MedicationService.getById(medicationId),
    enabled: !!medicationId,
  });
}

/**
 * Hook para listar medicamentos de um paciente
 */
export function useMedicationsByPatient(
  patientId: string,
  activeOnly: boolean = false
) {
  return useQuery({
    queryKey: ['medications', 'patient', patientId, { activeOnly }],
    queryFn: () =>
      MedicationService.listByPatient(patientId, { active_only: activeOnly }),
    enabled: !!patientId,
  });
}

/**
 * Hook para buscar horário de medicamentos
 */
export function useMedicationSchedule(patientId: string, date?: string) {
  return useQuery({
    queryKey: ['medications', 'schedule', patientId, date],
    queryFn: () => MedicationService.getSchedule(patientId, date),
    enabled: !!patientId,
    refetchInterval: 60000, // Atualiza a cada 1 minuto
  });
}

/**
 * Hook para criar medicamento
 */
export function useCreateMedication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMedicationRequest) => MedicationService.create(data),
    onSuccess: (newMedication: MedicationResponse) => {
      // Invalida cache de medicamentos do paciente
      queryClient.invalidateQueries({
        queryKey: ['medications', 'patient', newMedication.patient_id],
      });
      // Invalida cache de horários
      queryClient.invalidateQueries({
        queryKey: ['medications', 'schedule', newMedication.patient_id],
      });
    },
  });
}

/**
 * Hook para atualizar medicamento
 */
export function useUpdateMedication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMedicationRequest }) =>
      MedicationService.update(id, data),
    onSuccess: (updatedMedication: MedicationResponse) => {
      queryClient.invalidateQueries({
        queryKey: ['medication', updatedMedication.id],
      });
      queryClient.invalidateQueries({
        queryKey: ['medications', 'patient', updatedMedication.patient_id],
      });
      queryClient.invalidateQueries({
        queryKey: ['medications', 'schedule', updatedMedication.patient_id],
      });
    },
  });
}

/**
 * Hook para deletar medicamento
 */
export function useDeleteMedication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (medicationId: string) => MedicationService.delete(medicationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications'] });
    },
  });
}

/**
 * Hook para marcar medicamento como tomado
 */
export function useMarkMedicationTaken() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      medicationId,
      scheduledTime,
    }: {
      medicationId: string;
      scheduledTime: string;
    }) => MedicationService.markAsTaken(medicationId, scheduledTime),
    onSuccess: () => {
      // Invalida cache de horários para atualizar status
      queryClient.invalidateQueries({
        queryKey: ['medications', 'schedule'],
      });
    },
  });
}

/**
 * Hook para ativar/desativar medicamento
 */
export function useToggleMedicationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, activate }: { id: string; activate: boolean }) =>
      activate
        ? MedicationService.activate(id)
        : MedicationService.deactivate(id),
    onSuccess: (updatedMedication: MedicationResponse) => {
      queryClient.invalidateQueries({
        queryKey: ['medication', updatedMedication.id],
      });
      queryClient.invalidateQueries({
        queryKey: ['medications', 'patient', updatedMedication.patient_id],
      });
    },
  });
}
