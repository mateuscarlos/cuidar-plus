/**
 * API Services
 * Export all API services for easy import
 */

export { AuthService } from './auth.service';
export { UserService } from './user.service';
export { PatientService } from './patient.service';
export { MedicationService } from './medication.service';
export { AppointmentService } from './appointment.service';

export type { LoginRequest, LoginResponse } from './auth.service';
export type { CreateUserRequest, UpdateUserRequest, UserResponse } from './user.service';
export type { CreatePatientRequest, UpdatePatientRequest, PatientResponse } from './patient.service';
export type { CreateMedicationRequest, UpdateMedicationRequest, MedicationResponse } from './medication.service';
export type { CreateAppointmentRequest, UpdateAppointmentRequest, AppointmentResponse } from './appointment.service';
