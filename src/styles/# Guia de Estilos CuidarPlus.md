# Guia de Estilos CuidarPlus

## Bootstrap 5.3 e Bootstrap Icons 1.11.3

### Cores do Sistema
- **Primary**: #0d6efd - Ações principais, links e destaques
- **Secondary**: #6c757d - Ações secundárias
- **Success**: #198754 - Confirmações e indicadores positivos
- **Danger**: #dc3545 - Erros e ações destrutivas
- **Warning**: #ffc107 - Alertas e avisos
- **Info**: #0dcaf0 - Informações gerais

### Componentes Padronizados
- **Botões**: Use o `AppStyleService.getButtonClasses()` ou classes padrão Bootstrap
  ```html
  <button [class]="styleService.getButtonClasses('primary', 'lg')">Botão</button>
  <!-- ou -->
  <button class="btn btn-primary">Botão</button>
  ```
- **Cards**: Aplicar a classe `card` com bordas e backgrounds sutis
- **Formulários**: Usar classes `form-control`, `form-label` e `form-group`
- **Tabelas**: Usar `table table-striped table-hover`

### Ícones
Usar Bootstrap Icons com prefixo `bi bi-` seguido do nome do ícone.
Exemplos comuns:
- `bi bi-person` - Usuários
- `bi bi-calendar` - Eventos/Datas
- `bi bi-gear` - Configurações
- `bi bi-bell` - Notificações

### Espaçamento
Usar as classes de utilidade do Bootstrap:
- Margins: `m-1` até `m-5` (ou específicas como `mt-3`, `mb-2`)
- Paddings: `p-1` até `p-5` (ou específicas como `pt-3`, `pb-2`)

### Layout Responsivo
- Usar sistema de grid do Bootstrap `row` e `col-*`
- Breakpoints: xs (<576px), sm (≥576px), md (≥768px), lg (≥992px), xl (≥1200px)