# Shared - Design System e Utilitários

Esta pasta contém todos os componentes, hooks e utilitários compartilhados do projeto Cuidar+.

## 📁 Estrutura

```
shared/
├── ui/              # Componentes do Design System (Shadcn UI)
├── hooks/           # React hooks reutilizáveis
└── utils/           # Funções utilitárias
```

## 🎨 UI Components

Contém todos os 44+ componentes do Shadcn UI:

- **Formulários**: Button, Input, Select, Checkbox, Radio, Switch, Textarea
- **Layout**: Card, Sheet, Dialog, Drawer, Separator, Tabs
- **Navegação**: Sidebar, Breadcrumb, Navigation Menu, Menubar
- **Feedback**: Alert, Toast, Progress, Skeleton
- **Dados**: Table, Chart, Badge, Avatar
- **Interação**: Dropdown Menu, Context Menu, Popover, Tooltip

### Como usar:

```typescript
// Importação individual
import { Button } from '@/shared/ui/button';

// Ou usando barrel export
import { Button, Card, Input } from '@/shared/ui';
```

## 🪝 Hooks

### `use-toast`
Hook para exibir notificações toast.

```typescript
import { useToast } from '@/shared/hooks/use-toast';

const { toast } = useToast();
toast({ title: "Sucesso!", description: "Operação concluída" });
```

### `use-mobile`
Hook para detectar se está em viewport mobile.

```typescript
import { useIsMobile } from '@/shared/hooks/use-mobile';

const isMobile = useIsMobile();
```

## 🛠️ Utils

### `cn` (classnames)
Função utilitária para mesclar classes do Tailwind CSS.

```typescript
import { cn } from '@/shared/utils/cn';

<div className={cn("base-class", condition && "conditional-class")} />
```

## 📝 Regras de Uso

1. **NÃO adicione lógica de negócio aqui** - Estes são componentes "burros"
2. **Componentes devem ser genéricos** - Reutilizáveis em qualquer módulo
3. **Props devem ser claras e tipadas** - TypeScript é obrigatório
4. **Atualizações via Shadcn CLI** - Use `npx shadcn@latest add [component]`

## 🔄 Migração Concluída

✅ Movido de `src/components/ui/` → `src/shared/ui/`  
✅ Movido de `src/hooks/` → `src/shared/hooks/`  
✅ Movido de `src/lib/` → `src/shared/utils/`  
✅ Atualizados 56+ arquivos com novos imports  
✅ Configurado `components.json` e `tsconfig.json`

---

**Próximos passos**: Criar camada `core` e modularizar domínios (Patients, Inventory, etc.)
