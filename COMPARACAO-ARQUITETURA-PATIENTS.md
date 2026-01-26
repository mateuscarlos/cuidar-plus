# Comparação: Antes vs Depois - Arquitetura Patients

## 📊 Estrutura de Diretórios

### ❌ Antes (Inconsistente)

```text
patients/
├── domain/
│   ├── Patient.entity.ts          # Entidade + DTOs misturados
│   ├── Patient.rules.ts
│   └── PatientForm.types.ts       # ⚠️ Schema Zod no Domain!
├── data/
│   ├── patient.service.ts
│   └── patient.mock.ts
└── presentation/
    ├── components/
    ├── hooks/
    └── pages/
```

**Problemas:**
1. `PatientForm.types.ts` no domain com schema Zod (violação de Clean Architecture)
2. DTOs misturados com a entidade
3. Domain dependendo de bibliotecas de UI

### ✅ Depois (Normalizado)

```text
patients/
├── domain/
│   ├── Patient.entity.ts          # Apenas entidade + enums
│   ├── Patient.dto.ts             # ✨ DTOs separados
│   └── Patient.rules.ts
├── data/
│   ├── patient.service.ts
│   └── patient.mock.ts
└── presentation/
    ├── components/
    ├── forms/                      # ✨ Nova camada
    │   └── PatientFormSchema.ts   # Schema Zod aqui!
    ├── hooks/
    └── pages/
```

**Melhorias:**
1. Schemas Zod na camada correta (presentation)
2. DTOs separados da entidade
3. Domain independente de frameworks
4. Estrutura consistente com outros módulos

## 🔄 Mudanças nos Arquivos

### Domain Layer

#### `Patient.entity.ts`

**Antes:**
```typescript
export interface Patient extends BaseEntity { ... }

// ❌ DTOs misturados
export type CreatePatientDTO = Omit<...>
export type UpdatePatientDTO = Partial<...>
export interface PatientFilters { ... }
```

**Depois:**
```typescript
// ✅ Apenas entidade e tipos do domínio
export interface Patient extends BaseEntity { ... }
export enum PatientStatus { ... }
export enum PatientPriority { ... }
export interface ContactInfo { ... }
export interface Address { ... }
export interface MedicalInfo { ... }
```

#### `Patient.dto.ts` (NOVO)

```typescript
// ✅ Todos os DTOs agora em arquivo separado
export type CreatePatientDTO = Omit<...>
export type UpdatePatientDTO = Partial<...>
export interface PatientFilters { ... }
export interface DischargePatientDTO { ... }
export interface TransferPatientDTO { ... }
export interface PatientStatsDTO { ... }
```

#### `PatientForm.types.ts` (REMOVIDO)

Este arquivo foi **deletado** do domain e recriado como:

### Presentation Layer

#### `forms/PatientFormSchema.ts` (NOVO)

**Antes:** `domain/PatientForm.types.ts`
```typescript
// ❌ No domain
import { z } from 'zod';
export const patientFormSchema = z.object({ ... })
```

**Depois:** `presentation/forms/PatientFormSchema.ts`
```typescript
// ✅ Na camada correta
import { z } from 'zod';
export const patientFormSchema = z.object({ ... })
export type PatientFormData = z.infer<typeof patientFormSchema>
export interface ViaCepResponse { ... }
```

## 📦 Imports Atualizados

### PatientForm.tsx

**Antes:**
```typescript
import { PatientFormData, patientFormSchema } from '@/modules/patients/domain/PatientForm.types';
```

**Depois:**
```typescript
import { PatientFormData, patientFormSchema } from '../forms/PatientFormSchema';
```

### PatientsPage.tsx

**Antes:**
```typescript
import { PatientFormData } from '../../domain/PatientForm.types';
```

**Depois:**
```typescript
import { PatientFormData } from '../forms/PatientFormSchema';
```

### pages/Patients.tsx

**Antes:**
```typescript
import { PatientFormData } from "@/modules/patients/domain/PatientForm.types";
```

**Depois:**
```typescript
import { PatientFormData } from "@/modules/patients/presentation/forms/PatientFormSchema";
```

### useViaCep.ts

**Antes:**
```typescript
import { ViaCepResponse } from '@/modules/patients/domain/PatientForm.types';
```

**Depois:**
```typescript
import { ViaCepResponse } from '@/modules/patients/presentation/forms/PatientFormSchema';
```

## 🎯 Princípios Aplicados

### Clean Architecture

| Princípio | Antes | Depois |
|-----------|-------|--------|
| Dependency Rule | ❌ Domain → Zod | ✅ Presentation → Zod |
| Separation of Concerns | ❌ DTOs + Entity | ✅ Separados |
| Independent of Frameworks | ❌ Domain usa Zod | ✅ Domain puro |

### SOLID

| Princípio | Antes | Depois |
|-----------|-------|--------|
| **S**RP | ❌ Entity com DTOs | ✅ Separados |
| **O**CP | ⚠️ Difícil estender | ✅ Fácil adicionar DTOs |
| **D**IP | ❌ Domain → Zod | ✅ Abstrações corretas |

## 📈 Benefícios Mensuráveis

### 1. Testabilidade
**Antes:** Testes do domain precisavam importar Zod
```typescript
// ❌ Dependência desnecessária
import { z } from 'zod';
import { PatientValidator } from './Patient.rules';
```

**Depois:** Testes do domain são puros
```typescript
// ✅ Sem dependências de UI
import { PatientValidator } from './Patient.rules';
```

### 2. Manutenibilidade
**Antes:** Mudança em validação de formulário afeta domain
**Depois:** Mudança em validação fica isolada na presentation

### 3. Reutilização
**Antes:** Schemas de formulário acoplados ao domain
**Depois:** Domain pode ser usado em CLI, API, Mobile, etc.

### 4. Consistência
**Antes:** Estrutura diferente de inventory, users, reports
**Depois:** Todos os módulos seguem o mesmo padrão

## 🔍 Validação

### Build Status
```bash
$ pnpm run build
✓ 2000 modules transformed.
✓ built in 5.05s
```

### Erros
```
0 compilation errors
0 type errors
```

### Estrutura Validada
- ✅ domain/ - Lógica pura
- ✅ data/ - API calls
- ✅ presentation/ - UI + forms
- ✅ Todos os imports atualizados
- ✅ Build bem-sucedido

## 🎓 Lições Aprendidas

1. **Schemas de validação pertencem à camada de apresentação**
   - Zod, Yup, etc. são ferramentas de UI
   - Domain deve ser framework-agnostic

2. **DTOs devem ser separados de entidades**
   - Facilita manutenção
   - Melhora testabilidade
   - Respeita SRP

3. **Consistência é fundamental**
   - Todos os módulos devem seguir o mesmo padrão
   - Facilita onboarding de novos desenvolvedores
   - Reduz cognitive load

## 📚 Próximos Passos

- [ ] Aplicar o mesmo padrão em novos módulos
- [ ] Criar templates/scaffolding para novos módulos
- [ ] Documentar padrões de projeto no README principal
- [ ] Configurar linting para prevenir violações
