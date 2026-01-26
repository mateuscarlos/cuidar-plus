# Módulo de Prestadoras de Serviço

## Descrição
Módulo responsável pelo gerenciamento de prestadoras de serviços de saúde, incluindo hospitais, clínicas, laboratórios, cooperativas e consultórios.

## Estrutura

### Domain (Domínio)
- **`Provider.entity.ts`**: Define a entidade Prestadora e seus tipos relacionados
  - `Provider`: Entidade principal com dados da prestadora
  - `ProviderService`: Serviços oferecidos pela prestadora
  - `ProviderCredential`: Credenciais (CNES, CRM, etc.)
  - `ProviderType`: Tipos de prestadora (Hospital, Clínica, Laboratório, etc.)
  - `ProviderSpecialty`: Especialidades médicas
  - `ProviderStatus`: Status (Ativo, Inativo, Suspenso, Pendente)
  - DTOs para Create e Update

- **`Provider.rules.ts`**: Regras de negócio para prestadoras
  - Validação de documento (CNPJ/CPF)
  - Regras para desativação
  - Verificação de aceitação de operadora
  - Validação antes de criar
  - Regras para gerenciamento de serviços
  - Cálculo de disponibilidade
  - Verificação de credenciais válidas

### Data (Dados)
- **`provider.service.ts`**: Serviço com operações de CRUD
  - `findAll()`: Lista todas as prestadoras
  - `findById()`: Busca por ID
  - `create()`: Cria nova prestadora
  - `update()`: Atualiza prestadora
  - `delete()`: Remove prestadora
  - `search()`: Busca por nome ou especialidade
  - `findByInsurer()`: Busca por operadora aceita

- **`provider.mock.ts`**: Dados mock para desenvolvimento
  - Hospital São Lucas
  - Clínica Vida e Saúde
  - Laboratório BioLab
  - Cooperativa Médica Bem Estar

### Presentation (Apresentação)
- Em desenvolvimento: Componentes e hooks específicos

## Páginas
- **`/providers`**: Listagem de prestadoras ([Providers.tsx](../../pages/Providers.tsx))
- **`/providers/new`**: Cadastro de nova prestadora
- **`/providers/:id`**: Detalhes da prestadora
- **`/providers/:id/edit`**: Edição da prestadora

## Rotas
Definidas em [routes.ts](../../../core/constants/routes.ts):
```typescript
PROVIDERS: {
  LIST: '/providers',
  CREATE: '/providers/new',
  DETAIL: (id: string) => `/providers/${id}`,
  EDIT: (id: string) => `/providers/${id}/edit`,
}
```

## Tipos de Prestadora
- **HOSPITAL**: Hospital
- **CLINICA**: Clínica
- **LABORATORIO**: Laboratório
- **COOPERATIVA**: Cooperativa
- **CONSULTORIO**: Consultório
- **CENTRO_DIAGNOSTICO**: Centro Diagnóstico
- **HOME_CARE**: Home Care

## Especialidades
- CARDIOLOGIA
- ORTOPEDIA
- PEDIATRIA
- GINECOLOGIA
- NEUROLOGIA
- PSIQUIATRIA
- DERMATOLOGIA
- OFTALMOLOGIA
- ONCOLOGIA
- GERAL

## Features Implementadas
✅ Listagem de prestadoras  
✅ Visualização de detalhes  
✅ Gerenciamento de serviços  
✅ Múltiplas especialidades  
✅ Horário de funcionamento  
✅ Indicador de atendimento de emergência  
✅ Sistema de avaliação (rating)  
✅ Capacidade de atendimento  
✅ Operadoras aceitas  
✅ Filtros por tipo, especialidade e status  
✅ Cards informativos com estatísticas  

## Features Futuras
- [ ] Formulário de cadastro/edição
- [ ] Upload de logo
- [ ] Agenda de disponibilidade
- [ ] Integração com API CNES
- [ ] Sistema de agendamentos
- [ ] Mapa de localização
- [ ] Galeria de fotos
- [ ] Comentários e avaliações
- [ ] Relatórios de performance

## Uso

### Importar o módulo
```typescript
import { Provider, ProviderService, ProviderBusinessRules } from '@/modules/providers';
```

### Listar prestadoras
```typescript
const providers = await ProviderService.findAll();
```

### Buscar por operadora aceita
```typescript
const providers = await ProviderService.findByInsurer('insurerId');
```

### Criar prestadora
```typescript
const newProvider = await ProviderService.create({
  name: 'Nome da Prestadora',
  tradeName: 'Nome Fantasia',
  type: ProviderType.HOSPITAL,
  document: '00.000.000/0000-00',
  credentials: [
    { type: 'CNES', number: '0000000' }
  ],
  specialties: [ProviderSpecialty.CARDIOLOGIA],
  // ... outros campos
});
```

### Validar antes de criar
```typescript
const errors = ProviderBusinessRules.validateBeforeCreate(dto);
if (errors.length > 0) {
  console.error('Erros de validação:', errors);
}
```

### Verificar credenciais válidas
```typescript
const isValid = ProviderBusinessRules.hasValidCredentials(provider);
```

### Calcular disponibilidade
```typescript
const availability = ProviderBusinessRules.calculateAvailability(provider);
console.log(`Disponibilidade: ${availability}%`);
```
