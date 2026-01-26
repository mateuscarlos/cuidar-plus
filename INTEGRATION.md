# Guia de Integração Frontend-Backend - Cuidar+

Este documento descreve como o frontend React está integrado com o backend Flask da aplicação Cuidar+.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Configuração](#configuração)
- [Serviços de API](#serviços-de-api)
- [Hooks Personalizados](#hooks-personalizados)
- [Autenticação](#autenticação)
- [Exemplos de Uso](#exemplos-de-uso)
- [Tratamento de Erros](#tratamento-de-erros)
- [Troubleshooting](#troubleshooting)

## 🎯 Visão Geral

A integração entre frontend e backend segue os seguintes princípios:

- **API RESTful**: Comunicação via HTTP com JSON
- **JWT Authentication**: Tokens de acesso e refresh
- **React Query**: Cache e gerenciamento de estado do servidor
- **TypeScript**: Tipagem forte para segurança
- **Clean Architecture**: Separação clara de responsabilidades

### Stack Tecnológica

**Backend:**
- Python 3.12+
- Flask 3.1+
- PostgreSQL 16+
- JWT para autenticação

**Frontend:**
- React 18+
- TypeScript 5+
- Vite
- TanStack Query (React Query)
- Axios

## ⚙️ Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do frontend:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_ENABLE_DEBUG=true
VITE_ENABLE_MOCK_DATA=false
```

### 2. Configuração da API

O arquivo `src/core/config/api.config.ts` configura o cliente Axios:

```typescript
import axios from 'axios';
import { ENV } from './env.config';

const apiClient = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token JWT
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(ENV.TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para refresh automático de token
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Tenta refresh do token
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        const response = await axios.post(
          `${ENV.API_BASE_URL}/auth/refresh`,
          { refresh_token: refreshToken }
        );
        localStorage.setItem('token', response.data.access_token);
        // Retry request
        return apiClient(error.config);
      }
    }
    return Promise.reject(error);
  }
);
```

### 3. Iniciar Backend

```bash
cd cuidar-plus-backend
docker-compose up -d
python src/main.py
```

Backend estará disponível em: `http://localhost:5000`

### 4. Iniciar Frontend

```bash
cd cuidar-plus
pnpm install
pnpm dev
```

Frontend estará disponível em: `http://localhost:5173`

## 🔌 Serviços de API

Os serviços estão organizados em `src/core/services/api/`:

### AuthService

Gerencia autenticação e tokens JWT.

```typescript
import { AuthService } from '@/core/services/api';

// Login
const response = await AuthService.login({
  email: 'user@example.com',
  password: 'senha123'
});

// Logout
AuthService.logout();

// Verificar autenticação
const isAuth = AuthService.isAuthenticated();
```

### UserService

CRUD de usuários.

```typescript
import { UserService } from '@/core/services/api';

// Criar usuário
const user = await UserService.create({
  name: 'João Silva',
  email: 'joao@example.com',
  password: 'senha123',
  role: 'caregiver',
  phone: '11999999999'
});

// Buscar por ID
const user = await UserService.getById('user-id');

// Listar usuários
const users = await UserService.list({ page: 1, pageSize: 10 });

// Atualizar
const updated = await UserService.update('user-id', { name: 'Novo Nome' });

// Desativar
await UserService.deactivate('user-id');
```

### PatientService

Gerencia pacientes.

```typescript
import { PatientService } from '@/core/services/api';

// Criar paciente
const patient = await PatientService.create({
  name: 'Maria Santos',
  cpf: '12345678900',
  birth_date: '1950-01-15',
  caregiver_id: 'caregiver-id',
  phone: '11988888888',
  medical_info: {
    allergies: ['Penicilina'],
    chronic_conditions: ['Diabetes', 'Hipertensão'],
    observations: 'Paciente necessita acompanhamento diário'
  }
});

// Listar pacientes do cuidador
const patients = await PatientService.listByCaregiver('caregiver-id');

// Atualizar informações médicas
await PatientService.update('patient-id', {
  medical_info: {
    allergies: ['Penicilina', 'Dipirona']
  }
});
```

### MedicationService

Gerencia medicamentos e horários.

```typescript
import { MedicationService } from '@/core/services/api';

// Criar medicamento
const medication = await MedicationService.create({
  patient_id: 'patient-id',
  name: 'Losartana',
  dosage: '50mg',
  frequency: 'daily',
  start_date: '2024-01-01',
  schedule_times: ['08:00', '20:00']
});

// Buscar horário do dia
const schedule = await MedicationService.getSchedule(
  'patient-id',
  '2024-01-15'
);

// Marcar como tomado
await MedicationService.markAsTaken('medication-id', '08:00');
```

### AppointmentService

Gerencia consultas e compromissos.

```typescript
import { AppointmentService } from '@/core/services/api';

// Criar compromisso
const appointment = await AppointmentService.create({
  patient_id: 'patient-id',
  title: 'Consulta Cardiologista',
  appointment_type: 'consultation',
  scheduled_date: '2024-02-01T14:00:00',
  duration_minutes: 60,
  location: 'Hospital São Lucas',
  doctor_name: 'Dr. Pedro Oliveira'
});

// Próximos compromissos (próximos 7 dias)
const upcoming = await AppointmentService.getUpcoming('patient-id', 7);

// Confirmar compromisso
await AppointmentService.confirm('appointment-id');
```

## 🪝 Hooks Personalizados

### useAuth

Gerencia estado de autenticação.

```typescript
import { useAuth } from '@/core/hooks';

function LoginPage() {
  const { user, isAuthenticated, login, logout, isLoading, error } = useAuth();

  const handleLogin = async () => {
    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err) {
      console.error('Erro no login:', error);
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <p>Bem-vindo, {user?.name}</p>
      ) : (
        <button onClick={handleLogin} disabled={isLoading}>
          Entrar
        </button>
      )}
    </div>
  );
}
```

### usePatients

Gerencia pacientes com React Query.

```typescript
import { 
  usePatientsByCaregiver, 
  useCreatePatient,
  useUpdatePatient 
} from '@/core/hooks';

function PatientsList() {
  const caregiverId = 'caregiver-id';
  
  // Buscar pacientes (com cache automático)
  const { data, isLoading, error } = usePatientsByCaregiver(caregiverId);
  
  // Criar paciente
  const createMutation = useCreatePatient();
  
  const handleCreate = async () => {
    await createMutation.mutateAsync({
      name: 'Novo Paciente',
      cpf: '12345678900',
      birth_date: '1960-05-20',
      caregiver_id: caregiverId
    });
    // Cache é invalidado automaticamente
  };

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div>
      {data?.patients.map(patient => (
        <div key={patient.id}>{patient.name}</div>
      ))}
      <button onClick={handleCreate}>Adicionar Paciente</button>
    </div>
  );
}
```

### useMedications

Gerencia medicamentos e horários.

```typescript
import { 
  useMedicationsByPatient,
  useMedicationSchedule,
  useMarkMedicationTaken 
} from '@/core/hooks';

function MedicationSchedule() {
  const patientId = 'patient-id';
  const today = new Date().toISOString().split('T')[0];
  
  // Horário do dia (atualiza a cada 1 minuto)
  const { data: schedule } = useMedicationSchedule(patientId, today);
  
  const markTaken = useMarkMedicationTaken();
  
  const handleMarkTaken = async (medId: string, time: string) => {
    await markTaken.mutateAsync({ medicationId: medId, scheduledTime: time });
  };

  return (
    <div>
      {schedule?.map(item => (
        <div key={`${item.medication_id}-${item.scheduled_time}`}>
          <span>{item.medication_name} - {item.scheduled_time}</span>
          {!item.is_taken && (
            <button onClick={() => handleMarkTaken(item.medication_id, item.scheduled_time)}>
              Marcar como tomado
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
```

### useAppointments

Gerencia compromissos.

```typescript
import { 
  useUpcomingAppointments,
  useConfirmAppointment 
} from '@/core/hooks';

function UpcomingAppointments() {
  const patientId = 'patient-id';
  
  // Próximos 7 dias (atualiza a cada 5 minutos)
  const { data: appointments } = useUpcomingAppointments(patientId, 7);
  
  const confirm = useConfirmAppointment();
  
  return (
    <div>
      {appointments?.map(apt => (
        <div key={apt.id}>
          <h3>{apt.title}</h3>
          <p>{new Date(apt.scheduled_date).toLocaleString()}</p>
          {apt.status === 'scheduled' && (
            <button onClick={() => confirm.mutate(apt.id)}>
              Confirmar
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
```

## 🔐 Autenticação

### Fluxo de Autenticação

1. **Login**: Usuário envia email/senha → Backend retorna access_token + refresh_token
2. **Armazenamento**: Tokens são salvos no localStorage
3. **Requisições**: Interceptor adiciona token no header Authorization
4. **Refresh**: Ao receber 401, tenta refresh automático
5. **Logout**: Remove tokens e redireciona para login

### Proteção de Rotas

```typescript
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/core/hooks';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div>Carregando...</div>;
  if (!isAuthenticated) return <Navigate to="/login" />;

  return <>{children}</>;
}

// Uso
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>
```

## 📖 Exemplos de Uso

### Exemplo Completo: Dashboard de Paciente

```typescript
import { usePatient, useMedicationSchedule, useUpcomingAppointments } from '@/core/hooks';

function PatientDashboard({ patientId }: { patientId: string }) {
  const { data: patient, isLoading: loadingPatient } = usePatient(patientId);
  const { data: medications } = useMedicationSchedule(patientId);
  const { data: appointments } = useUpcomingAppointments(patientId, 7);

  if (loadingPatient) return <div>Carregando...</div>;

  return (
    <div>
      <h1>{patient?.name}</h1>
      <p>Idade: {patient?.age} anos</p>
      
      <section>
        <h2>Medicamentos de Hoje</h2>
        {medications?.map(med => (
          <div key={med.medication_id}>
            {med.medication_name} - {med.scheduled_time}
          </div>
        ))}
      </section>

      <section>
        <h2>Próximos Compromissos</h2>
        {appointments?.map(apt => (
          <div key={apt.id}>
            {apt.title} - {new Date(apt.scheduled_date).toLocaleDateString()}
          </div>
        ))}
      </section>
    </div>
  );
}
```

## ⚠️ Tratamento de Erros

### Erros de API

```typescript
import { AxiosError } from 'axios';

try {
  await PatientService.create(data);
} catch (error) {
  if (error instanceof AxiosError) {
    // Erro da API
    const message = error.response?.data?.message || 'Erro desconhecido';
    console.error('Erro:', message);
    
    // Erros de validação
    if (error.response?.data?.errors) {
      const validationErrors = error.response.data.errors;
      // { "cpf": ["CPF inválido"], "email": ["Email já cadastrado"] }
    }
  }
}
```

### Erros em Hooks

```typescript
const { mutate, error, isError } = useCreatePatient();

// Exibir erro
{isError && <div className="error">{error.message}</div>}

// Tratamento no mutation
mutate(data, {
  onSuccess: () => {
    toast.success('Paciente criado com sucesso!');
  },
  onError: (error) => {
    toast.error(`Erro: ${error.message}`);
  }
});
```

## 🔧 Troubleshooting

### CORS Error

**Problema:** `Access-Control-Allow-Origin` error

**Solução:** Verifique se o backend tem CORS habilitado:

```python
# src/main.py
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=['http://localhost:5173'])
```

### Token Expirado

**Problema:** Requests retornam 401 mesmo autenticado

**Solução:** O interceptor deve fazer refresh automático. Verifique:

1. Refresh token está armazenado: `localStorage.getItem('refreshToken')`
2. Endpoint de refresh está correto: `/api/v1/auth/refresh`
3. Backend retorna novos tokens no refresh

### Dados não Atualizam

**Problema:** Cache não invalida após mutation

**Solução:** Verifique invalidação do cache:

```typescript
const createMutation = useCreatePatient();

createMutation.mutate(data, {
  onSuccess: () => {
    // Força re-fetch
    queryClient.invalidateQueries({ queryKey: ['patients'] });
  }
});
```

### Backend Não Responde

**Problema:** `Network Error` ou timeout

**Checklist:**
1. Backend está rodando? `curl http://localhost:5000/health`
2. URL está correta? Verificar `.env`
3. Firewall bloqueando? Testar com Postman
4. Banco de dados conectado? Checar logs do Docker

### Erros de Validação

**Problema:** Backend rejeita requisições com 400

**Solução:** Verifique tipos dos DTOs:

```typescript
// ❌ Errado
const data = {
  birth_date: new Date() // Backend espera string ISO
};

// ✅ Correto
const data = {
  birth_date: '2024-01-15' // Formato ISO string
};
```

## 📊 Endpoints Disponíveis

### Autenticação
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh token

### Usuários
- `POST /api/v1/users/` - Criar usuário
- `GET /api/v1/users/:id` - Buscar por ID
- `GET /api/v1/users/` - Listar usuários
- `PUT /api/v1/users/:id` - Atualizar
- `DELETE /api/v1/users/:id` - Deletar
- `PATCH /api/v1/users/:id/activate` - Ativar
- `PATCH /api/v1/users/:id/deactivate` - Desativar

### Pacientes
- `POST /api/v1/patients/` - Criar paciente
- `GET /api/v1/patients/:id` - Buscar por ID
- `GET /api/v1/patients/caregiver/:id` - Listar por cuidador
- `PUT /api/v1/patients/:id` - Atualizar
- `DELETE /api/v1/patients/:id` - Deletar

### Medicamentos
- `POST /api/v1/medications/` - Criar medicamento
- `GET /api/v1/medications/:id` - Buscar por ID
- `GET /api/v1/medications/patient/:id` - Listar por paciente
- `GET /api/v1/medications/patient/:id/schedule` - Horário do dia
- `POST /api/v1/medications/:id/mark-taken` - Marcar como tomado

### Compromissos
- `POST /api/v1/appointments/` - Criar compromisso
- `GET /api/v1/appointments/:id` - Buscar por ID
- `GET /api/v1/appointments/patient/:id` - Listar por paciente
- `GET /api/v1/appointments/patient/:id/upcoming` - Próximos compromissos
- `PATCH /api/v1/appointments/:id/confirm` - Confirmar
- `PATCH /api/v1/appointments/:id/cancel` - Cancelar
- `PATCH /api/v1/appointments/:id/complete` - Completar

## 🚀 Próximos Passos

1. **Implementar Testes**: Adicionar testes E2E com Cypress
2. **Otimizações**: Implementar paginação infinita
3. **Real-time**: Adicionar WebSocket para atualizações em tempo real
4. **Notificações**: Push notifications para medicamentos e compromissos
5. **Offline**: Implementar PWA com cache offline

## 📝 Notas Importantes

- Sempre use hooks do React Query para operações assíncronas
- Tokens são armazenados no localStorage (considerar httpOnly cookies para produção)
- Cache do React Query tem TTL de 5 minutos por padrão
- Horários de medicamentos atualizam automaticamente a cada 1 minuto
- Próximos compromissos atualizam a cada 5 minutos

---

Para mais informações, consulte:
- [Documentação do Backend](../cuidar-plus-backend/README.md)
- [Arquitetura do Backend](../cuidar-plus-backend/ARCHITECTURE.md)
- [Exemplos de API](../cuidar-plus-backend/API_EXAMPLES.md)
