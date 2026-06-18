# Cuidar +

Plataforma de gestão homecare para equipes de saúde domiciliar. Permite o controle de pacientes, medicamentos, agendamentos, insumos e relatórios em um único painel.

## Stack

**Frontend** — [cuidar-plus](https://github.com/mateuscarlos/cuidar-plus)

- React 18 + TypeScript + Vite
- shadcn/ui (Radix UI) + Tailwind CSS
- TanStack React Query (cache e sincronização de estado)
- React Router v7 (code-splitting por rota)
- Axios com interceptors (JWT refresh automático)
- React Hook Form + Zod (validação de formulários)

**Backend** — [cuidar-plus-backend](https://github.com/mateuscarlos/cuidar-plus-backend)

- Python 3.12 + Flask 3.1
- Clean Architecture (Domain → Application → Infrastructure → Presentation)
- SQLAlchemy 2.0 + PostgreSQL + Alembic migrations
- JWT auth (access + refresh tokens) + bcrypt
- Swagger/ReDoc automático

## Funcionalidades

- **Autenticação** — Login com JWT, refresh automático de sessão
- **Pacientes** — Cadastro, listagem paginada com filtros, detalhes do prontuário
- **Medicamentos** — CRUD completo com detecção de conflitos de horário
- **Agendamentos** — Criação, listagem, cancelamento e conclusão de consultas
- **Insumos & Farmácia** — Controle de inventário
- **Relatórios** — Sumários e exportações
- **Administração** — Gestão de usuários e permissões por cargo

## Arquitetura do Frontend

```text
src/
├── core/           # Config, constantes, tipos globais, lib (queryClient, formatters)
├── modules/        # Módulos de domínio (domain / data / presentation por módulo)
│   ├── auth/       # Login, AuthContext, ProtectedRoute
│   ├── patients/   # Pacientes: entity, service, hooks, páginas, componentes
│   ├── inventory/  # Insumos e farmácia
│   ├── reports/    # Relatórios
│   └── users/      # Usuários e administração
└── shared/         # UI (shadcn/ui), layouts, utilitários compartilhados
```

## Setup Local

### Pré-requisitos

- Node.js 20+
- Backend rodando em `http://localhost:5000` (ver [cuidar-plus-backend](https://github.com/mateuscarlos/cuidar-plus-backend))

### Instalação

```bash
git clone https://github.com/mateuscarlos/cuidar-plus.git
cd cuidar-plus
npm install
```

### Configuração

Crie um `.env.local` baseado nas variáveis abaixo:

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_ENABLE_MOCK_DATA=false   # true para dados mockados sem backend
```

### Executar

```bash
npm run dev       # Desenvolvimento (http://localhost:8080)
npm run build     # Build de produção
npm run preview   # Preview do build
```

## Status do Projeto

| Módulo                                 | Status                |
| -------------------------------------- | --------------------- |
| Auth (login / logout / JWT refresh)    | ✅ Completo           |
| Pacientes (CRUD + filtros + paginação) | ✅ Completo           |
| Medicamentos                           | ✅ Completo           |
| Agendamentos                           | ✅ Completo           |
| Insumos                                | 🔄 Em desenvolvimento |
| Relatórios                             | 🔄 Em desenvolvimento |
| Administração de usuários              | 🔄 Em desenvolvimento |

## Autor

**Mateus Carlos** — [@mateuscarlos](https://github.com/mateuscarlos)
