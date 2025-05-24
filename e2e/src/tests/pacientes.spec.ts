import { TestBase } from '../utils/test-base';
import { LoginPage } from '../pages/login-page';
import { HomePage } from '../pages/home-page';
import { PacientesListPage } from '../pages/pacientes-list-page';
import { CadastrarPacientePage } from '../pages/cadastrar-paciente-page';
import { testConfig } from '../../config';
import { By } from 'selenium-webdriver';

describe('Pacientes Tests', function() {
  let testBase: TestBase;
  let loginPage: LoginPage;
  let homePage: HomePage;
  let pacientesListPage: PacientesListPage;
  let cadastrarPacientePage: CadastrarPacientePage;

  // Dados de teste
  const novoPaciente = {
    nome_completo: 'Maria Silva Teste',
    cpf: '123.456.789-10',
    data_nascimento: '01/01/1980',
    sexo: 'Feminino',
    email: 'maria.teste@example.com',
    telefone: '(11) 3333-4444',
    celular: '(11) 99999-8888',
    endereco: {
      cep: '01310-200',
      logradouro: 'Avenida Paulista',
      numero: '1000',
      complemento: 'Apto 123',
      bairro: 'Bela Vista',
      cidade: 'São Paulo',
      estado: 'SP'
    },
    tipo_sanguineo: 'O+',
    possui_alergia: true,
    descricao_alergia: 'Penicilina',
    status: 'Ativo'
  };

  beforeEach(async function() {
    testBase = new TestBase();
    await testBase.setUp();
    
    // Inicializar pages
    loginPage = new LoginPage(testBase.driver, testBase.helpers);
    homePage = new HomePage(testBase.driver, testBase.helpers);
    pacientesListPage = new PacientesListPage(testBase.driver, testBase.helpers);
    cadastrarPacientePage = new CadastrarPacientePage(testBase.driver, testBase.helpers);
    
    // Fazer login antes de cada teste
    await loginPage.navigate();
    await loginPage.login(testConfig.testUser.email, testConfig.testUser.senha);
    
    // Navegar para a seção de pacientes
    await homePage.navigateToPacientes();
  });

  afterEach(async function() {
    await testBase.tearDown();
  });

  it('should navigate to cadastrar paciente page', async function() {
    await pacientesListPage.goToCadastrarPaciente();
    
    const currentUrl = await testBase.driver.getCurrentUrl();
    expect(currentUrl).toContain('/pacientes/criar', 'URL deveria conter o caminho de criação de paciente');
  });

  it('should search for patients by name', async function() {
    // Termos de busca comuns que deveriam retornar resultados
    const termoBusca = 'Maria';
    await pacientesListPage.buscarPaciente(termoBusca);
    
    const numResultados = await pacientesListPage.getNumeroDeResultados();
    expect(numResultados).toBeGreaterThan(0, 'A busca deveria retornar ao menos um resultado');
  });

  it('should create a new patient', async function() {
    // Navegar para a página de cadastro
    await pacientesListPage.goToCadastrarPaciente();
    
    // Preencher o formulário
    await cadastrarPacientePage.fillForm(novoPaciente);
    
    // Submeter o formulário
    await cadastrarPacientePage.submitForm();
    
    // Verificar se o cadastro foi bem-sucedido
    const isSucesso = await cadastrarPacientePage.isCadastroSucesso();
    expect(isSucesso).toBeTruthy('Deveria mostrar modal de sucesso após cadastro');
    
    // Clicar no botão OK do modal
    await testBase.helpers.click(By.css('#sucessoModal .btn-primary'));
    
    // Verificar se voltou para a lista de pacientes
    const currentUrl = await testBase.driver.getCurrentUrl();
    expect(currentUrl).toContain('/pacientes/lista', 'Deveria redirecionar para a lista após confirmar o modal');
  });
  
  it('should show validation errors on invalid form submission', async function() {
    // Navegar para a página de cadastro
    await pacientesListPage.goToCadastrarPaciente();
    
    // Tentar submeter sem preencher campos obrigatórios
    await testBase.helpers.click(By.css('button[type="submit"]'));
    
    // Verificar se há mensagens de erro
    const nomeError = await testBase.driver.findElement(By.id('nome_completo-error'));
    const cpfError = await testBase.driver.findElement(By.id('cpf-error'));
    
    expect(await nomeError.isDisplayed()).toBeTruthy('Deveria mostrar erro para nome obrigatório');
    expect(await cpfError.isDisplayed()).toBeTruthy('Deveria mostrar erro para CPF obrigatório');
  });
});