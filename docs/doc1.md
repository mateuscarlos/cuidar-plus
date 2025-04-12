## Índice

1. Visão Geral
2. Estrutura do Projeto
3. Componentes Principais
4. Serviços
5. Gerenciamento de Estado
6. Validações
7. Interceptadores HTTP
8. Configuração e Ambiente
9. Testes
10. Recomendações de Melhoria
11. Guia de Contribuição

## Visão Geral

O Cuidar+ é uma aplicação desenvolvida com Angular 19.2.5 para gestão de pacientes e serviços relacionados a cuidados de saúde. A aplicação segue uma arquitetura modular com componentes standalone e utiliza Bootstrap 5.3.4 para a interface visual.

## Estrutura do Projeto

A aplicação está organizada da seguinte forma:

```
src/
├── app/
│   ├── core/         # Serviços e interceptadores globais
│   ├── features/     # Módulos de funcionalidades (pacientes, farmácia, etc.)
│   ├── layout/       # Componentes de layout (header, sidebar, footer)
│   ├── shared/       # Componentes, pipes e serviços reutilizáveis
├── assets/           # Recursos estáticos (imagens, ícones, etc.)
├── environments/     # Configurações de ambiente
```

### Módulos Principais

- **Pacientes**: Gerencia cadastro, edição, visualização e acompanhamento de pacientes
- **Farmácia**: Controle de medicamentos e prescrições
- **Relatórios**: Visualização de métricas e estatísticas
- **Configurações**: Ajustes gerais da aplicação

## Componentes Principais

### Componentes Compartilhados

- **PacienteAvatarComponent**: Exibe o avatar do paciente com suas iniciais
- **DateInputComponent**: Componente personalizado para entrada de datas
- **AlertComponent**: Exibe mensagens de alerta com animações
- **PaginacaoComponent**: Gerencia paginação de listas de dados

### Componentes de Pacientes

- **CadastrarPacienteComponent**: Formulário para registro de novos pacientes
- **EditarPacienteComponent**: Permite modificar dados de pacientes existentes
- **VisualizarPacienteComponent**: Exibe detalhes completos de um paciente
- **CriarAcompanhamentoPacienteComponent**: Gerencia acompanhamentos clínicos

## Serviços

### PacienteService

Responsável pela comunicação com a API para operações relacionadas a pacientes:

```typescript
// Métodos principais:
// - buscarPacientes(filtro): Observable<Paciente[]>
// - cadastrarPaciente(paciente): Observable<Paciente>
// - atualizarPaciente(id, paciente): Observable<Paciente>
// - excluirPaciente(id): Observable<void>
// - buscarPacientePorId(id): Observable<Paciente>
```

### NotificacaoService

Gerencia mensagens e alertas para o usuário:

```typescript
// Métodos principais:
// - mostrarSucesso(mensagem): void
// - mostrarErro(mensagem): void
// - mostrarAlerta(mensagem): void
```

## Gerenciamento de Estado

A aplicação utiliza o padrão Store para gerenciar estados, principalmente através da `PacienteStore`, que centraliza o estado relacionado aos pacientes.

```typescript
// PacienteStore
// - Gerencia o estado dos pacientes
// - Oferece métodos para carregar, atualizar e filtrar pacientes
// - Mantém o estado de carregamento e erros
```

## Validações

### Validação de CPF

```typescript
function validaCPF(cpf: string): boolean {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(cpf.charAt(i)) * (10 - i);
  let rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(cpf.charAt(9))) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(cpf.charAt(i)) * (11 - i);
  rev = 11 - (sum % 11);
  // Lógica de verificação do segundo dígito verificador
}
```

## Interceptadores HTTP

### ErrorInterceptor

```typescript
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private notificationService: NotificacaoService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse) {
          if (error.status === 401) {
            // Lógica de redirecionamento para login
          } else {
            this.notificationService.mostrarErro(
              error.error?.message || 'Ocorreu um erro. Tente novamente.'
            );
          }
        }
        return throwError(() => error);
      })
    );
  }
}
```

## Testes

Os testes unitários seguem o padrão do Angular com Jasmine e Karma:

```typescript
// Exemplo de teste para PacienteService
describe('PacienteService', () => {
  let service: PacienteService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PacienteService]
    });
    
    service = TestBed.inject(PacienteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('deve retornar pacientes com filtro de CPF', () => {
    const mockPacientes = [/* dados mock */];
    
    service.buscarPacientes({tipo: 'cpf', valor: '123'}).subscribe(pacientes => {
      expect(pacientes.length).toBe(mockPacientes.length);
    });
    
    const req = httpMock.expectOne(`${environment.apiUrl}/pacientes/buscar?tipo=cpf&valor=123`);
    expect(req.request.method).toBe('GET');
  });
});
```

## Recomendações de Melhoria

Com base na análise da aplicação, identificamos várias oportunidades de melhoria:

### Validação e Tratamento de Dados
- Implementar validação completa de CPF
- Adicionar máscaras para campos de entrada (telefone, CPF, CEP)

### Desempenho e Otimização
- Implementar lazy loading para todos os módulos
- Utilizar técnicas de virtual scrolling para listas grandes

### UX e Acessibilidade
- Adicionar atributos `aria-label` e `aria-describedby` para melhorar a acessibilidade
- Fornecer mensagens de erro mais detalhadas e amigáveis

### Segurança
- Implementar sanitização de dados para prevenir ataques XSS
- Garantir armazenamento seguro de tokens com tempo de expiração

### Estrutura e Arquitetura
- Expandir o uso da PacienteStore para gerenciar todos os estados relacionados a pacientes
- Implementar interceptors HTTP para tratamento global de erros

### Qualidade de Código
- Expandir a cobertura de testes unitários
- Padronizar o código com linters e formatadores

### Recursos Adicionais
- Implementar internacionalização (i18n)
- Dividir o módulo `shared` em submódulos menores para melhor organização

## Guia de Contribuição

### Configurando o Ambiente de Desenvolvimento

1. Clone o repositório
2. Instale as dependências:
   ```
   npm install
   ```
3. Execute a aplicação em modo de desenvolvimento:
   ```
   npm start
   ```

### Padrões de Código

- Utilize TypeScript estrito
- Siga o guia de estilo do Angular
- Escreva testes para novos componentes e serviços
- Mantenha a documentação atualizada

### Processo de Contribuição

1. Crie uma branch a partir da `main`
2. Implemente suas alterações
3. Escreva ou atualize os testes relevantes
4. Envie um Pull Request
5. Aguarde a revisão e aprovação

---

## Conclusão

Esta documentação fornece uma visão abrangente do frontend da aplicação Cuidar+. Ela serve como um guia para desenvolvedores que trabalham no projeto, facilitando a manutenção e expansão do sistema. As recomendações de melhoria destacadas podem ser implementadas gradualmente para aumentar a qualidade e robustez da aplicação.

Para qualquer dúvida ou sugestão, entre em contato com a equipe de desenvolvimento.

Similar code found with 1 license type