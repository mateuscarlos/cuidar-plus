# Core - Fundação Técnica do Projeto

Esta pasta contém a **camada de infraestrutura técnica** do projeto Cuidar+. Aqui ficam configurações, tipos compartilhados, constantes e bibliotecas fundamentais que são usadas em todos os módulos.

## 📁 Estrutura

```
core/
├── config/          # Configurações de ambiente e serviços
│   ├── env.config.ts      # Variáveis de ambiente
│   └── api.config.ts      # Cliente HTTP (Axios)
├── types/           # Tipos TypeScript compartilhados
│   └── common.types.ts    # Interfaces e tipos base
├── constants/       # Constantes da aplicação
│   ├── routes.ts          # Rotas centralizadas
│   └── messages.ts        # Mensagens do sistema
├── lib/             # Bibliotecas e utilitários
│   ├── query-client.ts    # Configuração React Query
│   ├── validators.ts      # Funções de validação
│   └── formatters.ts      # Formatadores de dados
└── index.ts         # Barrel export
```

## 🔧 Config

### `env.config.ts`
Centraliza todas as variáveis de ambiente:

```typescript
import { ENV, validateEnv } from '@/core/config/env.config';

// Usar em qualquer lugar
const apiUrl = ENV.API_BASE_URL;
const appName = ENV.APP_NAME;

// Validar no App.tsx
validateEnv();
```

### `api.config.ts`
Cliente HTTP configurado com interceptors:

```typescript
import { apiClient, getErrorMessage } from '@/core/config/api.config';

// Fazer requisições
const response = await apiClient.get('/patients');
const data = await apiClient.post('/patients', { name: 'João' });

// Tratar erros
try {
  await apiClient.get('/endpoint');
} catch (error) {
  const message = getErrorMessage(error);
  toast.error(message);
}
```

**Recursos:**
- ✅ Autenticação automática (Bearer Token)
- ✅ Refresh token automático
- ✅ Retry logic inteligente
- ✅ Logging em desenvolvimento
- ✅ Tratamento global de erros

## 📝 Types

### `common.types.ts`
Tipos compartilhados entre módulos:

```typescript
import type { BaseEntity, PaginatedResponse, AsyncResult } from '@/core/types';

// Entidade base
interface Patient extends BaseEntity {
  name: string;
  // id, createdAt, updatedAt já inclusos
}

// Resposta paginada
const patients: PaginatedResponse<Patient> = {
  data: [...],
  pagination: { total, page, pageSize, totalPages }
};

// Estado assíncrono
const state: AsyncResult<Patient[]> = {
  data: null,
  state: LoadingState.LOADING,
  error: null
};
```

## 🎯 Constants

### `routes.ts`
Rotas type-safe:

```typescript
import { ROUTES } from '@/core/constants';

// Navegação
navigate(ROUTES.PATIENTS.LIST);
navigate(ROUTES.PATIENTS.DETAIL('patient-123'));

// Verificação
if (isPublicRoute(pathname)) {
  // Permitir acesso sem auth
}
```

### `messages.ts`
Mensagens centralizadas (preparado para i18n):

```typescript
import { MESSAGES } from '@/core/constants';

toast.success(MESSAGES.SUCCESS.CREATED);
toast.error(MESSAGES.ERROR.NETWORK);

// Com parâmetros
const error = MESSAGES.VALIDATION.MIN_LENGTH(8);
```

## 🛠️ Lib

### `query-client.ts`
React Query configurado:

```typescript
import { queryClient, QUERY_KEYS, invalidateQueries } from '@/core/lib/query-client';

// Usar query keys
const { data } = useQuery({
  queryKey: QUERY_KEYS.PATIENTS.list(filters),
  queryFn: () => PatientService.fetchPatients(filters)
});

// Invalidar cache
await invalidateQueries.patients();
await invalidateQueries.all();
```

**Configurações:**
- ✅ Cache de 5 minutos
- ✅ Retry automático inteligente
- ✅ Refetch on reconnect
- ✅ Error handling global

### `validators.ts`
Validadores reutilizáveis:

```typescript
import { 
  isValidEmail, 
  isValidCPF, 
  isStrongPassword,
  validateFile 
} from '@/core/lib/validators';

// Validações
if (!isValidEmail(email)) {
  // erro
}

const { isValid, errors } = isStrongPassword(password);

const fileCheck = validateFile(file, {
  maxSize: 5 * 1024 * 1024,
  allowedTypes: ['image/jpeg', 'image/png']
});
```

### `formatters.ts`
Formatadores de dados:

```typescript
import { 
  formatCurrency, 
  formatDate, 
  formatCPF,
  formatPhone,
  getInitials 
} from '@/core/lib/formatters';

formatCurrency(1500.50);        // R$ 1.500,50
formatDate(new Date());         // 26/01/2026
formatCPF('12345678900');       // 123.456.789-00
formatPhone('11987654321');     // (11) 98765-4321
getInitials('João Silva');      // JS
```

## 📦 Como Usar

### Imports Organizados

```typescript
// Específico
import { ENV } from '@/core/config/env.config';
import { apiClient } from '@/core/config/api.config';
import { ROUTES } from '@/core/constants/routes';

// Ou via barrel export
import { ENV, apiClient, ROUTES, MESSAGES } from '@/core';
```

### No App.tsx

```typescript
import { queryClient } from '@/core/lib/query-client';
import { validateEnv } from '@/core/config/env.config';

validateEnv(); // Validar env vars na inicialização

<QueryClientProvider client={queryClient}>
  {/* app */}
</QueryClientProvider>
```

## 🚫 O que NÃO vai aqui

- ❌ Componentes React (vai em `shared/ui`)
- ❌ Lógica de negócio (vai em `modules/*/domain`)
- ❌ Hooks customizados de módulos específicos (vai em `modules/*/presentation/hooks`)
- ❌ Serviços de API específicos (vai em `modules/*/data`)

## ✅ O que vai aqui

- ✅ Configurações globais
- ✅ Tipos compartilhados entre módulos
- ✅ Constantes da aplicação
- ✅ Utilitários puros (sem dependência de React)
- ✅ Validadores genéricos
- ✅ Formatadores

## 🔄 Atualizações

Para adicionar novas configurações ou constantes:

1. Crie o arquivo na pasta apropriada
2. Exporte via barrel export (`index.ts`)
3. Documente no README se for algo importante

---

**Próximo passo**: Criar módulos com domínios específicos (Patients, Inventory, etc.)
