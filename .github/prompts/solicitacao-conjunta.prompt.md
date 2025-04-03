# Prompt Padrão para Solicitações Conjuntas entre Backend e Frontend

## Contexto Geral do Projeto

- **Arquitetura**: Aplicação full-stack com separação clara entre backend e frontend.
- **Comunicação**: Backend e frontend se comunicam via API RESTful.
- **Autenticação**: Implementada com OAuth2 e JWT.
- **Deploy**: Utiliza Docker para containerização e orquestração com Docker Compose.

## Tecnologias Utilizadas

### Backend

- **Linguagem**: Python
- **Framework**: Flask
- **Banco de Dados**: MySQL
- **ORM**: SQLAlchemy
- **Outras Tecnologias**: Docker
- **Testes**: Pytest
- **Padrão de Arquitetura**: Clean Architecture

### Frontend

- **Framework**: Angular 19 com componentes standalone
- **Linguagem**: TypeScript
- **Estilos**: SCSS com Bootstrap
- **Comunicação com API**: HTTP Client do Angular
- **Testes**: Jasmine/Karma
- **Outras Tecnologias**: Docker, nginx para servir a aplicação
- **Padrões de Design**: Modularidade, Reutilização de Componentes, Responsividade

## Regras e Padrões a Seguir

1. **Integração Backend e Frontend**:
   - Backend deve expor endpoints RESTful bem documentados com OpenAPI.
   - Frontend deve consumir os endpoints usando serviços Angular (`HttpClient`).
   - Garantir que os contratos entre backend e frontend sejam consistentes (ex.: formatos de dados, validações).

2. **Autenticação e Segurança**:
   - Backend deve implementar autenticação com OAuth2 e JWT.
   - Frontend deve armazenar o token JWT de forma segura (ex.: `HttpOnly` cookies ou `localStorage` com precauções).
   - Garantir que todas as requisições autenticadas incluam o token JWT no cabeçalho `Authorization`.

3. **Validação de Dados**:
   - Backend deve validar os dados de entrada usando `pydantic`.
   - Frontend deve implementar validações básicas no formulário antes de enviar os dados para o backend.

4. **Estrutura de Código**:
   - Backend deve seguir o padrão Clean Architecture.
   - Frontend deve organizar o código em módulos reutilizáveis e componentes pequenos.

5. **Testes**:
   - Backend: Escrever testes unitários e de integração para endpoints e lógica de negócio.
   - Frontend: Escrever testes unitários para componentes e serviços Angular.
   - Garantir que os testes cubram os fluxos de integração entre backend e frontend.

6. **Performance**:
   - Backend: Implementar cache com Redis para dados frequentemente acessados.
   - Frontend: Implementar lazy loading para módulos Angular e otimizar o carregamento de recursos.

7. **Documentação**:
   - Backend: Documentar os endpoints com OpenAPI (gerado automaticamente pelo FastAPI).
   - Frontend: Adicionar comentários claros em serviços que consomem APIs e descrever o uso esperado.

## Exemplo de Solicitação Conjunta

- Criar um endpoint no backend para gerenciar usuários (CRUD).
- No frontend, criar uma interface para listar, criar, editar e excluir usuários.
- Garantir que o frontend consuma o endpoint do backend corretamente.
- Implementar validações no backend e no frontend para garantir a integridade dos dados.
- Escrever testes unitários para o backend e frontend.

## Tecnologias e Padrões do Projeto Atual

- **Backend**: FastAPI, PostgreSQL, SQLAlchemy, Redis, Celery
- **Frontend**: Angular, TypeScript, SCSS, Bootstrap
- **Comunicação**: API RESTful
- **Autenticação**: OAuth2 com JWT
- **Testes**: Pytest (backend), Jasmine/Karma (frontend)
