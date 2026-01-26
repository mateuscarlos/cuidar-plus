/**
 * Custom Hooks
 * Export all custom hooks for easy import
 */

export { useAuth } from './useAuth';
export { useApi } from './useApi';
export { 
  usePatient, 
  usePatientsByCaregiver,
  useCreatePatient,
  useUpdatePatient,
  useDeletePatient,
  useTogglePatientStatus
} from './usePatients';
export { 
  useMedication,
  useMedicationsByPatient,
  useMedicationSchedule,
  useCreateMedication,
  useUpdateMedication,
  useDeleteMedication,
  useMarkMedicationTaken,
  useToggleMedicationStatus
} from './useMedications';
export {
  useAppointment,
  useAppointmentsByPatient,
  useUpcomingAppointments,
  useCreateAppointment,
  useUpdateAppointment,
  useDeleteAppointment,
  useCancelAppointment,
  useConfirmAppointment,
  useCompleteAppointment
} from './useAppointments';
