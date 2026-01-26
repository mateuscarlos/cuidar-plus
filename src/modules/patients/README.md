# Módulo Patients

Este módulo implementa o gerenciamento completo de pacientes seguindo **Clean Architecture** e **Domain-Driven Design (DDD)**.

## 📁 Estrutura

```text
patients/
├── domain/                    # Camada de Domínio (Regras de Negócio)
│   ├── Patient.entity.ts     # Entidade Patient + Enums
│   ├── Patient.dto.ts        # DTOs e Filtros
│   ├── Patient.rules.ts      # Validadores e Value Objects
│   └── index.ts
├── data/                      # Camada de Dados (API)
│   ├── patient.service.ts    # Serviço de API
│   ├── patient.mock.ts       # Dados mockados
│   └── index.ts
├── presentation/              # Camada de Apresentação (UI)
│   ├── components/           # Componentes React
│   │   ├── PatientCard.tsx
│   │   ├── PatientList.tsx
│   │   ├── PatientFilters.tsx
│   │   ├── PatientForm.tsx
│   │   └── index.ts
│   ├── forms/                # Schemas de Validação
│   │   ├── PatientFormSchema.ts
│   │   └── index.ts
│   ├── hooks/                # React Query hooks
│   │   ├── usePatients.ts
│   │   └── index.ts
│   ├── pages/                # Páginas
│   │   ├── PatientsPage.tsx
│   │   └── index.ts
│   └── index.ts
└── index.ts                   # Barrel export do módulo
```

## 🎯 Camadas

### 1. Domain (Domínio)

**Responsabilidade**: Regras de negócio, entidades, tipos

**Arquivos**:

- `Patient.entity.ts`: Entidade principal + Enums + Interfaces
- `Patient.dto.ts`: DTOs (CreatePatientDTO, UpdatePatientDTO, PatientFilters)
- `Patient.rules.ts`: Validadores, Value Objects, Helpers

**O que contém**:

```typescript
// Entidades
interface Patient extends BaseEntity { ... }

// Enums
enum PatientStatus { ACTIVE, DISCHARGED, PENDING, TRANSFERRED }
enum PatientPriority { LOW, MEDIUM, HIGH, URGENT }

// DTOs
type CreatePatientDTO = Omit<Patient, 'id' | 'createdAt' | ...>
type UpdatePatientDTO = Partial<...>
interface PatientFilters { ... }

// Validadores
class PatientValidator {
  static validate(patient: Partial<Patient>)
  static canBeDischarged(patient: Patient)
  static calculateAge(birthDate: Date)
}

// Value Objects
class PatientName { ... }

// Helpers
function getStatusColor(status: PatientStatus)
function getPriorityColor(priority: PatientPriority)
```

**Regra**: NÃO pode depender de React, API ou UI. Apenas lógica pura.

### 2. Data (Dados)

**Responsabilidade**: Comunicação com APIs externas

**Arquivos**:

- `patient.service.ts`: Chamadas à API
- `patient.mock.ts`: Dados mockados para desenvolvimento

**O que contém**:

```typescript
class PatientService {
  static fetchPatients(filters): Promise<PaginatedResponse<Patient>>
  static getPatientById(id): Promise<Patient>
  static createPatient(data): Promise<Patient>
  static updatePatient(id, data): Promise<Patient>
  static deletePatient(id): Promise<void>
  static dischargePatient(id): Promise<Patient>
}
```

**Regra**: Usa `apiClient` do Core. Retorna tipos do Domain.

### 3. Presentation (Apresentação)

**Responsabilidade**: UI, interação com usuário, estado React

#### 3.1 Forms

**Arquivos**:

- `PatientFormSchema.ts`: Schemas Zod para validação de formulários

**O que contém**:

```typescript
// Schemas de validação (Zod)
export const patientFormSchema = z.object({ ... })
export type PatientFormData = z.infer<typeof patientFormSchema>

// Tipos auxiliares de UI
export interface ViaCepResponse { ... }
```

**Regra**: Schemas de validação ficam na camada de apresentação, não no domain.

#### 3.2 Hooks

```typescript
// usePatients.ts
export function usePatients(filters): UseQueryResult
export function usePatient(id): UseQueryResult
export function useCreatePatient(): UseMutationResult
export function useUpdatePatient(): UseMutationResult
export function useDeletePatient(): UseMutationResult
export function useDischargePatient(): UseMutationResult
```

**Features**:

- ✅ React Query configurado
- ✅ Cache automático (5 min)
- ✅ Invalidação de cache
- ✅ Toast de sucesso/erro
- ✅ Suporta dados mockados (ENV.ENABLE_MOCK_DATA)

#### 3.3 Components

**PatientCard**:

- Exibe informações resumidas do paciente
- Badge de status e prioridade
- Botão de ver detalhes

**PatientList**:

- Grid responsivo de cards
- Estados: loading, error, empty, success
- Skeletons durante carregamento

**PatientFilters**:

- Busca por nome, prontuário ou CPF
- Filtro por status
- Filtro por prioridade
- Toggle de visibilidade

**PatientForm**:

- Formulário completo de cadastro
- Validação com Zod
- Integração com ViaCEP
- Máscaras de input (CPF, CEP, Phone)

#### 3.4 Pages

**PatientsPage**:

- Página principal do módulo
- Gerencia estado de filtros
- Integra todos os componentes

## 🚀 Como Usar

### Importar o módulo

```typescript
// Importação específica
import { Patient, PatientStatus } from '@/modules/patients/domain';
import { PatientService } from '@/modules/patients/data';
import { usePatients, PatientsPage } from '@/modules/patients/presentation';

// Ou via barrel export
import { Patient, PatientService, usePatients } from '@/modules/patients';
```

### Usar os hooks

```typescript
import { usePatients, useCreatePatient } from '@/modules/patients/presentation/hooks';

function MyComponent() {
  // Buscar pacientes
  const { data, isLoading } = usePatients({ status: 'Ativo' });
  
  // Criar paciente
  const createMutation = useCreatePatient();
  const handleCreate = () => {
    createMutation.mutate(newPatient);
  };
  
  return ...;
}
```

### Usar a página

```typescript
// App.tsx
import { PatientsPage } from '@/modules/patients/presentation/pages';

<Route path="/patients" element={<PatientsPage />} />
```

## 🧪 Modo Mock

Por padrão, o módulo usa dados mockados para desenvolvimento:

```env
# .env
VITE_ENABLE_MOCK_DATA=true
```

4 pacientes mockados estão disponíveis em `patient.mock.ts`:
- João Silva Santos (Ativo, Média)
- Maria Oliveira Costa (Ativo, Alta)
- Pedro Henrique Alves (Pendente, Urgente)
- Ana Carolina Ferreira (Alta, Baixa)

## 📊 Tipos Principais

```typescript
interface Patient {
  // Básico
  id: string;
  name: string;
  cpf: string;
  birthDate: Date | string;
  gender: 'Masculino' | 'Feminino' | 'Outro';
  
  // Contato
  contact: ContactInfo;
  address: Address;
  
  // Médico
  medicalInfo: MedicalInfo;
  status: PatientStatus;
  priority: PatientPriority;
  diagnosis: string;
  
  // Controle
  medicalRecordNumber: string;
  admissionDate: Date | string;
  lastVisit: Date | string;
}
```

## 🎨 Componentes UI

Todos os componentes usam o Design System de [`@/shared/ui`](../../shared/ui/):
- Button, Card, Badge
- Input, Select
- Alert, Skeleton

## ✅ Features Implementadas

- ✅ Listagem de pacientes com filtros
- ✅ Busca por nome, prontuário ou CPF
- ✅ Filtro por status e prioridade
- ✅ Cards informativos com badges
- ✅ Estados de loading e empty
- ✅ Validação de dados (CPF, telefone, etc)
- ✅ Cálculo de idade
- ✅ Formatação de dados (telefone, data)
- ✅ Suporte a mock data
- ✅ Integração com React Query

## 📝 TODO (Próximas Features)

- [ ] Página de detalhes do paciente
- [ ] Modal de criação/edição
- [ ] Formulário validado
- [ ] Ação de alta médica
- [ ] Transferência de paciente
- [ ] Histórico de atendimentos
- [ ] Upload de documentos
- [ ] Paginação na listagem
- [ ] Exportação para PDF/Excel

## 🔗 Dependências

**Core**:
- `@/core/config` - API client, ENV
- `@/core/types` - BaseEntity, PaginatedResponse
- `@/core/lib` - Validators, Formatters, Query Client
- `@/core/constants` - Routes, Messages

**Shared**:
- `@/shared/ui` - Componentes do design system

**External**:
- `@tanstack/react-query` - Estado server
- `sonner` - Toasts

---

**Criado em**: Fase 3 da Refatoração  
**Arquitetura**: Clean Architecture + DDD  
**Autor**: Equipe Cuidar+
