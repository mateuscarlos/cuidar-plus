import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  AppointmentService,
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
  AppointmentResponse,
} from '@/core/services/api';

/**
 * Hook para buscar compromisso por ID
 */
export function useAppointment(appointmentId: string) {
  return useQuery({
    queryKey: ['appointment', appointmentId],
    queryFn: () => AppointmentService.getById(appointmentId),
    enabled: !!appointmentId,
  });
}

/**
 * Hook para listar compromissos de um paciente
 */
export function useAppointmentsByPatient(
  patientId: string,
  filters?: {
    status?: string;
    start_date?: string;
    end_date?: string;
  }
) {
  return useQuery({
    queryKey: ['appointments', 'patient', patientId, filters],
    queryFn: () => AppointmentService.listByPatient(patientId, filters),
    enabled: !!patientId,
  });
}

/**
 * Hook para buscar próximos compromissos
 */
export function useUpcomingAppointments(patientId: string, days: number = 7) {
  return useQuery({
    queryKey: ['appointments', 'upcoming', patientId, days],
    queryFn: () => AppointmentService.getUpcoming(patientId, days),
    enabled: !!patientId,
    refetchInterval: 300000, // Atualiza a cada 5 minutos
  });
}

/**
 * Hook para criar compromisso
 */
export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAppointmentRequest) =>
      AppointmentService.create(data),
    onSuccess: (newAppointment: AppointmentResponse) => {
      queryClient.invalidateQueries({
        queryKey: ['appointments', 'patient', newAppointment.patient_id],
      });
      queryClient.invalidateQueries({
        queryKey: ['appointments', 'upcoming', newAppointment.patient_id],
      });
    },
  });
}

/**
 * Hook para atualizar compromisso
 */
export function useUpdateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateAppointmentRequest;
    }) => AppointmentService.update(id, data),
    onSuccess: (updatedAppointment: AppointmentResponse) => {
      queryClient.invalidateQueries({
        queryKey: ['appointment', updatedAppointment.id],
      });
      queryClient.invalidateQueries({
        queryKey: ['appointments', 'patient', updatedAppointment.patient_id],
      });
      queryClient.invalidateQueries({
        queryKey: ['appointments', 'upcoming', updatedAppointment.patient_id],
      });
    },
  });
}

/**
 * Hook para deletar compromisso
 */
export function useDeleteAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (appointmentId: string) =>
      AppointmentService.delete(appointmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}

/**
 * Hook para cancelar compromisso
 */
export function useCancelAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (appointmentId: string) =>
      AppointmentService.cancel(appointmentId),
    onSuccess: (updatedAppointment: AppointmentResponse) => {
      queryClient.invalidateQueries({
        queryKey: ['appointment', updatedAppointment.id],
      });
      queryClient.invalidateQueries({
        queryKey: ['appointments', 'patient', updatedAppointment.patient_id],
      });
    },
  });
}

/**
 * Hook para confirmar compromisso
 */
export function useConfirmAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (appointmentId: string) =>
      AppointmentService.confirm(appointmentId),
    onSuccess: (updatedAppointment: AppointmentResponse) => {
      queryClient.invalidateQueries({
        queryKey: ['appointment', updatedAppointment.id],
      });
      queryClient.invalidateQueries({
        queryKey: ['appointments', 'patient', updatedAppointment.patient_id],
      });
    },
  });
}

/**
 * Hook para completar compromisso
 */
export function useCompleteAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (appointmentId: string) =>
      AppointmentService.complete(appointmentId),
    onSuccess: (updatedAppointment: AppointmentResponse) => {
      queryClient.invalidateQueries({
        queryKey: ['appointment', updatedAppointment.id],
      });
      queryClient.invalidateQueries({
        queryKey: ['appointments', 'patient', updatedAppointment.patient_id],
      });
      queryClient.invalidateQueries({
        queryKey: ['appointments', 'upcoming', updatedAppointment.patient_id],
      });
    },
  });
}
