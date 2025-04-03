# Prompt Padrão para Diretrizes de Desenvolvimento Frontend

## Contexto do Projeto

- **Framework**: Angular 19
- **Linguagem**: TypeScript
- **Estilos**: SCSS
- **Bibliotecas**: Bootstrap, Bootstrap Icons
- **Arquitetura**: Componentes Standalone
- **Padrões de Design**: Modularidade, Reutilização de Componentes, Responsividade

## Regras e Padrões a Seguir

1. **Estrutura de Código**:
   - Seguir as convenções do Angular Style Guide.
   - Utilizar componentes standalone para modularidade.
   - Manter a separação de responsabilidades (HTML, CSS, TypeScript).

2. **Estilo e Formatação**:
   - Usar SCSS para estilização.
   - Seguir o padrão definido no `.editorconfig`:
     - `indent_size = 2`
     - `quote_type = single` para arquivos `.ts`.
   - Nomear classes CSS com o padrão BEM (Block Element Modifier).

3. **Acessibilidade e UX**:
   - Garantir que todos os elementos interativos tenham suporte a teclado e leitores de tela.
   - Adicionar feedback visual para ações do usuário (ex.: carregamento, validações).
   - Usar componentes responsivos para dispositivos móveis (ex.: `@media` queries).

4. **Boas Práticas de Angular**:
   - Utilizar `ReactiveForms` para formulários.
   - Implementar validações de formulário com mensagens de erro claras.
   - Usar `async` pipes para manipulação de observables no template.
   - Evitar lógica complexa nos templates; mover para o TypeScript.

5. **Componentização**:
   - Reutilizar componentes compartilhados do módulo `SharedModule` (ex.: `InfoCardComponent`, `StatusBadgeComponent`).
   - Criar componentes pequenos e reutilizáveis para funcionalidades específicas.

6. **Testes**:
   - Escrever testes unitários para componentes e serviços usando Jasmine/Karma.
   - Garantir cobertura mínima de 80% para novos componentes.

7. **Segurança**:
   - Sanitizar dados antes de exibi-los no DOM.
   - Evitar interpolação direta de HTML; usar `DomSanitizer` quando necessário.

8. **Performance**:
   - Implementar lazy loading para módulos e componentes pesados.
   - Usar `ChangeDetectionStrategy.OnPush` sempre que possível.
   - Minimizar o uso de observables aninhados; preferir `combineLatest` ou `forkJoin`.

## Exemplo de Resposta Esperada

- Código gerado deve ser funcional, seguindo as convenções acima.
- Incluir exemplos de validação de formulário e mensagens de erro.
- Garantir responsividade e acessibilidade no HTML e CSS.

## Tecnologias e Padrões do Projeto Atual

- **Framework**: Angular 19
- **Estilos**: SCSS com Bootstrap
- **Componentes Compartilhados**: `SharedModule`
- **Ferramentas de Teste**: Jasmine/Karma
- **Outras Tecnologias**: Bootstrap Icons
