# Módulo de Operadoras de Saúde

## Descrição
Módulo responsável pelo gerenciamento de operadoras de saúde (planos de saúde) como SulAmérica, Amil, Unimed, etc.

## Estrutura

### Domain (Domínio)
- **`Insurer.entity.ts`**: Define a entidade Operadora e seus tipos relacionados
  - `Insurer`: Entidade principal com dados da operadora
  - `InsurerPlan`: Planos oferecidos pela operadora
  - `InsurerType`: Tipos de operadora (Medicina de Grupo, Cooperativa, etc.)
  - `InsurerStatus`: Status da operadora (Ativo, Inativo, Suspenso)
  - DTOs para Create e Update

- **`Insurer.rules.ts`**: Regras de negócio para operadoras
  - Validação de CNPJ
  - Validação de registro ANS
  - Regras para desativação
  - Validação antes de criar
  - Regras para gerenciamento de planos

### Data (Dados)
- **`insurer.service.ts`**: Serviço com operações de CRUD
  - `findAll()`: Lista todas as operadoras
  - `findById()`: Busca por ID
  - `create()`: Cria nova operadora
  - `update()`: Atualiza operadora
  - `delete()`: Remove operadora
  - `searchByName()`: Busca por nome

- **`insurer.mock.ts`**: Dados mock para desenvolvimento
  - SulAmérica
  - Amil
  - Unimed

### Presentation (Apresentação)
- Em desenvolvimento: Componentes e hooks específicos

## Páginas
- **`/insurers`**: Listagem de operadoras ([Insurers.tsx](../../pages/Insurers.tsx))
- **`/insurers/new`**: Cadastro de nova operadora
- **`/insurers/:id`**: Detalhes da operadora
- **`/insurers/:id/edit`**: Edição da operadora

## Rotas
Definidas em [routes.ts](../../../core/constants/routes.ts):
```typescript
INSURERS: {
  LIST: '/insurers',
  CREATE: '/insurers/new',
  DETAIL: (id: string) => `/insurers/${id}`,
  EDIT: (id: string) => `/insurers/${id}/edit`,
}
```

## Tipos de Operadora
- **MEDICINA_GRUPO**: Medicina de Grupo
- **COOPERATIVA**: Cooperativa Médica
- **AUTOGESTAO**: Autogestão
- **FILANTROPIA**: Filantropia

## Features Implementadas
✅ Listagem de operadoras  
✅ Visualização de detalhes  
✅ Gerenciamento de planos  
✅ Validação de CNPJ e registro ANS  
✅ Filtros por tipo e status  
✅ Cards informativos com estatísticas  

## Features Futuras
- [ ] Formulário de cadastro/edição
- [ ] Upload de logo
- [ ] Histórico de contratos
- [ ] Integração com API ANS
- [ ] Relatórios de operadoras
- [ ] Dashboard de performance por operadora

## Uso

### Importar o módulo
```typescript
import { Insurer, InsurerService, InsurerBusinessRules } from '@/modules/insurers';
```

### Listar operadoras
```typescript
const insurers = await InsurerService.findAll();
```

### Criar operadora
```typescript
const newInsurer = await InsurerService.create({
  name: 'Nome da Operadora',
  tradeName: 'Nome Fantasia',
  cnpj: '00.000.000/0000-00',
  registrationNumber: '000000',
  type: InsurerType.MEDICINA_GRUPO,
  // ... outros campos
});
```

### Validar antes de criar
```typescript
const errors = InsurerBusinessRules.validateBeforeCreate(dto);
if (errors.length > 0) {
  console.error('Erros de validação:', errors);
}
```
