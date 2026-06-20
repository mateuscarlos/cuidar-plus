/**
 * Patient Hooks
 * React Query hooks para gerenciar estado de pacientes
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { QUERY_KEYS } from '@/core/lib/query-client';
import { MESSAGES } from '@/core/constants';
import { ENV } from '@/core/config';
import { PatientService } from '../../data/patient.service';
import { mockPatients } from '../../data/patient.mock';
import type { PatientFilters, CreatePatientDTO, UpdatePatientDTO } from '../../domain';

/**
 * Hook para buscar lista de pacientes
 */
export function usePatients(filters: PatientFilters = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.PATIENTS.list(filters),
    queryFn: async () => {
      // Se mock está habilitado, retorna dados mockados
      if (ENV.ENABLE_MOCK_DATA) {
        // Filtrar dados mockados
        let filtered = [...mockPatients];
        
        if (filters.search) {
          const search = filters.search.toLowerCase();
          filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(search) ||
            p.medicalRecordNumber.toLowerCase().includes(search) ||
            p.cpf.includes(search)
          );
        }
        
        if (filters.status) {
          filtered = filtered.filter(p => p.status === filters.status);
        }
        
        return {
          data: filtered,
          pagination: {
            total: filtered.length,
            page: 1,
            pageSize: 10,
            totalPages: Math.ceil(filtered.length / 10),
          },
        };
      }
      
      return PatientService.fetchPatients(filters);
    },
  });
}

/**
 * Hook para buscar paciente por ID
 */
export function usePatient(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.PATIENTS.detail(id),
    queryFn: async () => {
      if (ENV.ENABLE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 300));
        const patient = mockPatients.find(p => p.id === id);
        if (!patient) throw new Error('Paciente não encontrado');
        return patient;
      }
      return PatientService.getPatientById(id);
    },
    enabled: !!id,
  });
}

/**
 * Hook para criar paciente
 */
export function useCreatePatient() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (patient: CreatePatientDTO) => {
      if (ENV.ENABLE_MOCK_DATA) {
        return Promise.resolve({
          ...patient,
          id: `mock-${Date.now()}`,
          medicalRecordNumber: `MED-2026-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
      return PatientService.createPatient(patient);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PATIENTS.all });
      toast.success('Paciente cadastrado', {
        description: MESSAGES.SUCCESS.CREATED,
      });
    },
    onError: (error: Error) => {
      toast.error('Erro ao cadastrar paciente', {
        description: error.message || MESSAGES.ERROR.GENERIC,
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
    mutationFn: ({ id, updates }: { id: string; updates: UpdatePatientDTO }) => {
      if (ENV.ENABLE_MOCK_DATA) {
        return Promise.resolve({ id, ...updates });
      }
      return PatientService.updatePatient(id, updates);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PATIENTS.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PATIENTS.detail(variables.id) });
      toast.success('Paciente atualizado', {
        description: MESSAGES.SUCCESS.UPDATED,
      });
    },
    onError: (error: Error) => {
      toast.error('Erro ao atualizar paciente', {
        description: error.message || MESSAGES.ERROR.GENERIC,
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
    mutationFn: (id: string) => {
      if (ENV.ENABLE_MOCK_DATA) {
        return Promise.resolve();
      }
      return PatientService.deletePatient(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PATIENTS.all });
      toast.success('Paciente removido', {
        description: MESSAGES.SUCCESS.DELETED,
      });
    },
    onError: (error: Error) => {
      toast.error('Erro ao remover paciente', {
        description: error.message || MESSAGES.ERROR.GENERIC,
      });
    },
  });
}

/**
 * Hook para dar alta ao paciente
 */
export function useDischargePatient() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) => {
      if (ENV.ENABLE_MOCK_DATA) {
        return Promise.resolve({ id, notes });
      }
      return PatientService.dischargePatient(id, notes);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PATIENTS.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PATIENTS.detail(variables.id) });
      toast.success('Alta realizada com sucesso');
    },
  });
}

/**
 * Hook para buscar estatísticas
 */
export function usePatientStats() {
  return useQuery({
    queryKey: ['patients', 'stats'],
    queryFn: async () => {
      if (ENV.ENABLE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 300));
        return {
          total: mockPatients.length,
          active: mockPatients.filter(p => p.status === 'Ativo').length,
          discharged: mockPatients.filter(p => p.status === 'Alta').length,
          pending: mockPatients.filter(p => p.status === 'Pendente').length,
        };
      }
      return PatientService.getPatientStats();
    },
  });
}
