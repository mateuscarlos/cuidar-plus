/**
 * Patient Form Schema
 * Schema de validação para o formulário de cadastro de pacientes
 * 
 * @layer Presentation
 */

import { z } from 'zod';

/**
 * Schema de validação para o formulário de cadastro de paciente
 * Utiliza Zod para validação client-side
 */
export const patientFormSchema = z.object({
  // Informações Básicas
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  status: z.enum([
    'Avaliação',
    'Ativo',
    'Alta Administrativa',
    'Alta Óbito',
    'Alta Melhora',
    'Alta Hospitalar',
    'Cancelado',
  ], { required_error: 'Status é obrigatório' }),
  cpf: z.string()
    .min(11, 'CPF deve ter 11 dígitos')
    .max(11, 'CPF deve ter 11 dígitos')
    .regex(/^\d{11}$/, 'CPF deve conter apenas números'),
  birthDate: z.string().min(1, 'Data de nascimento é obrigatória'),
  
  // Endereço
  zipCode: z.string()
    .min(8, 'CEP deve ter 8 dígitos')
    .max(8, 'CEP deve ter 8 dígitos')
    .regex(/^\d{8}$/, 'CEP deve conter apenas números'),
  street: z.string().min(3, 'Rua é obrigatória'),
  number: z.string().min(1, 'Número é obrigatório'),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, 'Bairro é obrigatório'),
  city: z.string().min(2, 'Cidade é obrigatória'),
  state: z.string().length(2, 'Estado deve ter 2 caracteres'),
  
  // Contato
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  phone: z.string().min(10, 'Telefone deve ter no mínimo 10 dígitos'),
  
  // Informações Médicas
  primaryCid: z.string().min(1, 'CID Principal é obrigatório'),
  secondaryCid: z.string().optional(),
  allergies: z.string().optional(),
  
  // Contato de Emergência
  emergencyContactName: z.string().min(3, 'Nome do contato de emergência é obrigatório'),
  emergencyContactPhone: z.string().min(10, 'Telefone do contato de emergência é obrigatório'),
  
  // Informações de Admissão
  admissionDate: z.string().min(1, 'Data de admissão é obrigatória'),
  
  // Plano de Saúde
  healthInsuranceCard: z.string().optional(),
  healthInsuranceProvider: z.string().optional(),
  healthInsurancePlan: z.string().optional(),
  
  // Equipe Responsável
  serviceProvider: z.string().optional(),
  assignedProfessional: z.string().optional(),
  responsibleDoctor: z.string().optional(),
  responsibleNurse: z.string().optional(),
});

/**
 * Tipo inferido do schema de validação
 * Representa os dados do formulário antes de serem transformados em DTOs do domínio
 */
export type PatientFormData = z.infer<typeof patientFormSchema>;

/**
 * Tipo para resposta da API ViaCEP
 * Utilizado para auto-completar endereço
 */
export interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}
