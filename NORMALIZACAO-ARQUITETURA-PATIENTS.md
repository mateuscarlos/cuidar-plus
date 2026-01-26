# Normalização da Arquitetura do Módulo Patients

## 📋 Resumo

A arquitetura do módulo de pacientes foi normalizada para seguir os mesmos padrões dos outros módulos da aplicação, respeitando os princípios da **Clean Architecture** e **SOLID**.

## ✅ Mudanças Realizadas

### 1. Separação de Concerns (SRP - Single Responsibility Principle)

**Antes:**
- `PatientForm.types.ts` estava na camada `domain/` contendo Zod schemas (concern de UI)
- DTOs misturados com a entidade em `Patient.entity.ts`

**Depois:**
- Criada camada `presentation/forms/` para schemas de validação
- Criado `Patient.dto.ts` separado na camada `domain/`
- Cada arquivo tem uma única responsabilidade clara

### 2. Dependency Rule (Clean Architecture)

**Violação Anterior:**
```typescript
// domain/PatientForm.types.ts
import { z } from 'zod'; // ❌ Domain dependendo de biblioteca de UI
```

**Correção:**
```typescript
// presentation/forms/PatientFormSchema.ts
import { z } from 'zod'; // ✅ Presentation pode depender de libs de UI

// domain/Patient.dto.ts
// ✅ Sem dependências externas, apenas tipos puros
```

### 3. Estrutura de Arquivos Normalizada

#### Domain Layer (`domain/`)
```
domain/
├── Patient.entity.ts    # Entidade + Enums + Interfaces
├── Patient.dto.ts       # DTOs e Filtros (novos)
├── Patient.rules.ts     # Regras de negócio
└── index.ts             # Exports organizados
```

**Responsabilidade**: Lógica de negócio pura, sem dependências de frameworks

#### Presentation Layer (`presentation/`)
```
presentation/
├── components/          # Componentes React
├── forms/               # Schemas Zod (novo)
│   ├── PatientFormSchema.ts
│   └── index.ts
├── hooks/               # React Query hooks
├── pages/               # Páginas
└── index.ts
```

**Responsabilidade**: UI, validação client-side, interação com usuário

## 📦 Novos Arquivos

### `domain/Patient.dto.ts`
```typescript
// DTOs do domínio
export type CreatePatientDTO = ...
export type UpdatePatientDTO = ...
export interface PatientFilters = ...
export interface DischargePatientDTO = ...
export interface TransferPatientDTO = ...
export interface PatientStatsDTO = ...
```

### `presentation/forms/PatientFormSchema.ts`
```typescript
// Schemas de validação (antes em domain/PatientForm.types.ts)
export const patientFormSchema = z.object({ ... })
export type PatientFormData = z.infer<typeof patientFormSchema>
export interface ViaCepResponse = ...
```

## 🔄 Arquivos Atualizados

### `domain/Patient.entity.ts`
- ❌ Removidos: DTOs (CreatePatientDTO, UpdatePatientDTO, PatientFilters)
- ✅ Mantém: Apenas entidade, enums e interfaces do domínio

### `domain/index.ts`
```typescript
// Exports organizados por categoria
export * from './Patient.entity';  // Entities
export * from './Patient.dto';     // DTOs
export * from './Patient.rules';   // Business Rules
```

### `presentation/index.ts`
```typescript
// Agora exporta forms também
export * from './components';
export * from './hooks';
export * from './pages';
export * from './forms';  // ✨ Novo
```

### Componentes Atualizados
- `PatientForm.tsx`: Import alterado de `domain/PatientForm.types` para `forms/PatientFormSchema`
- `PatientsPage.tsx`: Import alterado de `domain/PatientForm.types` para `forms/PatientFormSchema`
- `useViaCep.ts`: Import alterado para o novo local

## 🗑️ Arquivos Removidos

- ❌ `domain/PatientForm.types.ts` - Movido para `presentation/forms/PatientFormSchema.ts`

## ✨ Benefícios da Normalização

### 1. Clean Architecture
- ✅ Domain não depende mais de bibliotecas de UI (Zod)
- ✅ Fluxo de dependências correto: Presentation → Domain (nunca o contrário)
- ✅ Camadas claramente separadas

### 2. SOLID Principles

**Single Responsibility**:
- Cada arquivo tem uma responsabilidade única e clara
- Entidade separada de DTOs separada de schemas de formulário

**Dependency Inversion**:
- Domain depende apenas de abstrações
- Presentation depende do Domain (contratos)

**Open/Closed**:
- Fácil adicionar novos DTOs sem modificar a entidade
- Fácil adicionar novos schemas de formulário

### 3. Manutenibilidade
- ✅ Código mais fácil de testar (domain sem dependências)
- ✅ Mudanças em UI não afetam regras de negócio
- ✅ Estrutura consistente com outros módulos (inventory, users, reports)

### 4. Testabilidade
```typescript
// Agora é possível testar regras de negócio sem importar Zod
import { PatientValidator } from '@/modules/patients/domain';

test('should validate patient age', () => {
  // Teste puro, sem dependências de UI
});
```

## 📚 Padrão para Novos Módulos

Esta estrutura deve ser seguida em todos os módulos:

```
module/
├── domain/
│   ├── Entity.entity.ts    # Entidade + Enums
│   ├── Entity.dto.ts       # DTOs + Filtros
│   ├── Entity.rules.ts     # Validadores + Regras
│   └── index.ts
├── data/
│   ├── entity.service.ts   # API calls
│   └── index.ts
└── presentation/
    ├── components/         # UI components
    ├── forms/              # Zod schemas
    ├── hooks/              # React Query
    ├── pages/              # Pages
    └── index.ts
```

## 🎯 Checklist de Validação

- [x] Domain não importa libs de UI (Zod, React, etc)
- [x] DTOs separados da entidade
- [x] Schemas de formulário na camada Presentation
- [x] Exports organizados e documentados
- [x] Imports atualizados em todos os arquivos
- [x] README atualizado
- [x] Estrutura consistente com outros módulos
- [x] Sem erros de compilação

## 🔍 Referências

- **Clean Architecture** (Robert C. Martin)
- **SOLID Principles**
- **Domain-Driven Design** (Eric Evans)
- Padrões já estabelecidos nos módulos: inventory, users, reports
