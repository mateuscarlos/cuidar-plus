### Documentação do Frontend da Aplicação CuidarPlus

---

#### **1. Versão do Angular**
- A aplicação utiliza o **Angular 19.2.5** como framework principal, conforme especificado no package.json.

---

#### **2. Estrutura de Pastas**
A estrutura de pastas segue uma organização modular e bem definida, com destaque para:
- **features**: Contém os módulos principais da aplicação, como `pacientes`, `farmacia`, `relatorios`, `configuracoes`, entre outros.
- **shared**: Contém componentes, pipes e serviços reutilizáveis, como `paciente-avatar`, `date-input`, `alert`, e `paginacao`.
- **core**: Contém serviços e interceptadores globais, como api.interceptor.ts e date-formatter.service.ts.
- **layout**: Contém componentes de layout, como `header`, `footer` e `sidebar`.

---

#### **3. Estrutura Visual da Aplicação**
- **Framework CSS**: A aplicação utiliza **Bootstrap 5.3.4** e **Bootstrap Icons 1.11.3** para estilização e ícones.
- **Componentes de Layout**:
  - **Header**: Inclui funcionalidades como exibição do nome do usuário e notificações.
  - **Sidebar**: Menu lateral com navegação para diferentes módulos.
  - **Footer**: Exibe o ano atual e links de navegação.
- **Design Responsivo**: Implementado com o uso de Bootstrap e detecção de dispositivos móveis via `DeviceDetectorService`.

---

#### **4. Estrutura de Componentes**
- **Componentes Standalone**: A maioria dos componentes utiliza a abordagem standalone introduzida nas versões recentes do Angular.
- **Componentes Compartilhados**:
  - **PacienteAvatarComponent**: Exibe o avatar de um paciente com iniciais.
  - **DateInputComponent**: Componente customizado para entrada de datas.
  - **AlertComponent**: Exibe mensagens de alerta com animações.
  - **PaginacaoComponent**: Gerencia a paginação de listas.
- **Componentes de Funcionalidades**:
  - **Pacientes**: Inclui subcomponentes como `cadastrar-paciente`, `editar-pacientes`, `visualizar-paciente`, e `criar-acompanhamento-paciente`.
  - **Farmácia**: Gerencia medicamentos e prescrições.
  - **Relatórios**: Exibe métricas e estatísticas.

---

#### **5. Arquitetura**
- **Modularização**: A aplicação é dividida em módulos funcionais (`features`) e módulos compartilhados (`shared`).
- **Injeção de Dependência**: Utiliza o sistema de DI do Angular para serviços como `PacienteService`, `DateFormatterService`, e `AcompanhamentoService`.
- **Interceptadores HTTP**: O `ApiInterceptor` adiciona tokens de autenticação e manipula URLs de requisições.
- **Rotas**: Configuradas no arquivo app.routes.ts com lazy loading para otimização de carregamento.

---

#### **6. Versionamento e Ferramentas**
- **Angular CLI**: Versão 19.2.6 para scaffolding e gerenciamento do projeto.
- **TypeScript**: Versão 5.8.2.
- **Ferramentas de Teste**:
  - **Karma**: Para execução de testes unitários.
  - **Jasmine**: Framework de testes.
- **Docker**: Scripts para construção e execução de contêineres Docker.

---
 De agora em diante como um arquiteto de Software as respostas e solicitações devem usar esse documento como premissa para o desenvolvimento do código
