# Configuração de Rede - Cuidar Plus

## Overview
Este documento descreve a configuração de rede para conectar o frontend (Windows) ao backend (Servidor Linux).

## Arquitetura Atual

```
┌─────────────────────────────┐
│   Máquina Windows           │
│   IP: 192.168.0.152         │
│                             │
│   ┌─────────────────────┐   │
│   │  Frontend (Vite)    │   │
│   │  :5173              │   │
│   └─────────────────────┘   │
└──────────────┬──────────────┘
               │
               │ HTTP Request
               │
               ▼
┌─────────────────────────────┐
│  Servidor Linux             │
│  IP: 192.168.10.110         │
│                             │
│  ┌──────────────────────┐   │
│  │ Docker Compose       │   │
│  │                      │   │
│  │ ┌────────────────┐   │   │
│  │ │ Backend :5000  │   │   │
│  │ └────────────────┘   │   │
│  │                      │   │
│  │ ┌────────────────┐   │   │
│  │ │ PostgreSQL     │   │   │
│  │ │ :5432          │   │   │
│  │ └────────────────┘   │   │
│  │                      │   │
│  │ ┌────────────────┐   │   │
│  │ │ Redis :6379    │   │   │
│  │ └────────────────┘   │   │
│  └──────────────────────┘   │
└─────────────────────────────┘
```

## Configurações Realizadas

### 1. Frontend (Windows)

#### Arquivo: `.env`
```env
VITE_API_BASE_URL=http://192.168.10.110:5000/api/v1
VITE_API_TIMEOUT=10000
VITE_ENABLE_MOCK_DATA=false
```

**Importante:** A URL da API aponta para o servidor Linux na rede local.

### 2. Backend (Servidor Linux)

#### Arquivo: `.env`
```env
# Database e Redis usando IP do próprio servidor
DATABASE_URL=postgresql://admin:password123@192.168.10.110:5432/main_db
REDIS_URL=redis://192.168.10.110:6379/0

# CORS configurado para aceitar requisições da máquina Windows
CORS_ORIGINS=http://localhost:5173,http://localhost:3000,http://localhost:8080,http://192.168.0.152:5173,http://192.168.0.152:3000
```

## Como Usar

### Iniciar o Backend (Servidor Linux)

```bash
# SSH no servidor Linux
ssh usuario@192.168.10.110

# Navegar até o diretório do projeto
cd /caminho/para/cuidar-plus-backend

# Iniciar os serviços
docker-compose up -d

# Verificar logs
docker-compose logs -f backend
```

### Iniciar o Frontend (Windows)

```bash
# Navegar até o diretório do projeto
cd D:\Repositorios\cuidar-plus

# Instalar dependências (se necessário)
pnpm install

# Iniciar o servidor de desenvolvimento
pnpm dev
```

O frontend estará disponível em: `http://localhost:5173`

## Troubleshooting

### Problema: Frontend não consegue conectar ao backend

**Verificações:**

1. **Ping no servidor:**
   ```bash
   ping 192.168.10.110
   ```
   Se não responder, verifique a conectividade de rede.

2. **Backend está rodando:**
   ```bash
   ssh usuario@192.168.10.110
   docker-compose ps
   ```
   Todos os serviços devem estar "Up".

3. **Porta 5000 está acessível:**
   ```bash
   curl http://192.168.10.110:5000/health
   ```
   Deve retornar: `{"status":"healthy",...}`

4. **Firewall do servidor:**
   Verifique se a porta 5000 está liberada:
   ```bash
   sudo ufw status
   sudo ufw allow 5000/tcp
   ```

5. **CORS configurado corretamente:**
   Verifique o arquivo `.env` do backend e confirme que o IP da máquina Windows está na lista de `CORS_ORIGINS`.

### Problema: Erro de CORS no navegador

**Sintoma:** 
```
Access to XMLHttpRequest at 'http://192.168.10.110:5000/api/v1/...' 
from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Solução:**
1. Verifique se o `CORS_ORIGINS` no backend inclui `http://localhost:5173`
2. Reinicie o backend após alterar o `.env`:
   ```bash
   docker-compose restart backend
   ```

### Problema: Timeout nas requisições

**Sintoma:** Requisições demoram muito ou dão timeout

**Solução:**
1. Aumente o timeout no `.env` do frontend:
   ```env
   VITE_API_TIMEOUT=30000
   ```
2. Verifique a latência da rede:
   ```bash
   ping 192.168.10.110 -t
   ```

## Mudança de IP

Se o IP do servidor ou da máquina Windows mudar:

### Frontend:
1. Edite o arquivo `.env`
2. Atualize `VITE_API_BASE_URL` com o novo IP
3. Reinicie o servidor de desenvolvimento

### Backend:
1. SSH no servidor Linux
2. Edite o arquivo `.env`
3. Atualize `CORS_ORIGINS` com o novo IP da máquina Windows
4. Reinicie os containers: `docker-compose restart backend`

## Monitoramento

### Health Check do Backend
```bash
curl http://192.168.10.110:5000/health
```

### Logs do Backend
```bash
docker-compose logs -f backend
```

### Logs do PostgreSQL
```bash
docker-compose logs -f db
```

### Logs do Redis
```bash
docker-compose logs -f redis
```

## Acesso aos Serviços

| Serviço    | URL                            | Credenciais          |
|------------|--------------------------------|----------------------|
| Backend    | http://192.168.10.110:5000     | -                    |
| Frontend   | http://localhost:5173          | -                    |
| PostgreSQL | 192.168.10.110:5432            | postgres/postgres    |
| Redis      | 192.168.10.110:6379            | (sem senha)          |
| pgAdmin    | http://192.168.10.110:5050     | admin@cuidarplus.com/admin |

## Segurança

⚠️ **IMPORTANTE:** Esta configuração é para ambiente de desenvolvimento/rede local.

Para produção, considere:
- Usar HTTPS
- Configurar firewall adequadamente
- Usar senhas fortes
- Implementar rate limiting
- Usar variáveis de ambiente seguras
- Não expor portas desnecessárias
