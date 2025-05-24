import { TestBase } from '../utils/test-base';
import { LoginPage } from '../pages/login-page';
import { HomePage } from '../pages/home-page';
import { UsuariosPage } from '../pages/usuarios-page';
import { testConfig } from '../../config';
import { By } from 'selenium-webdriver';

describe('Usuarios Tests', function() {
  let testBase: TestBase;
  let loginPage: LoginPage;
  let homePage: HomePage;
  let usuariosPage: UsuariosPage;

  beforeEach(async function() {
    testBase = new TestBase();
    await testBase.setUp();
    
    // Inicializar pages
    loginPage = new LoginPage(testBase.driver, testBase.helpers);
    homePage = new HomePage(testBase.driver, testBase.helpers);
    usuariosPage = new UsuariosPage(testBase.driver, testBase.helpers);
    
    // Fazer login antes de cada teste
    await loginPage.navigate();
    await loginPage.login(testConfig.testUser.email, testConfig.testUser.senha);
    
    // Navegar para a seção de usuários
    await homePage.navigateToUsuarios();
  });

  afterEach(async function() {
    await testBase.tearDown();
  });

  it('should navigate to cadastrar usuario page', async function() {
    await usuariosPage.goToCadastrarUsuario();
    
    const currentUrl = await testBase.driver.getCurrentUrl();
    expect(currentUrl).toContain('/usuarios/criar', 'URL deveria conter o caminho de criação de usuário');
  });

  it('should search for users by name', async function() {
    // Termos de busca comuns que deveriam retornar resultados
    const termoBusca = 'Admin';
    await usuariosPage.buscarUsuario(termoBusca);
    
    const numResultados = await usuariosPage.getNumeroDeResultados();
    expect(numResultados).toBeGreaterThan(0, 'A busca deveria retornar ao menos um resultado');
  });

  it('should filter users by department (setor)', async function() {
    // Selecionar um setor (usar um setor que sabidamente existe)
    await usuariosPage.filtrarPorSetor('Enfermagem');
    
    // Verificar se a lista foi filtrada
    const numResultados = await usuariosPage.getNumeroDeResultados();
    expect(numResultados).toBeGreaterThanOrEqual(0, 'A filtragem deveria funcionar');
    
    // Verificar se o filtro foi aplicado (verificando a URL ou algum indicador na interface)
    const currentUrl = await testBase.driver.getCurrentUrl();
    expect(currentUrl).toContain('setor=', 'URL deveria conter o parâmetro de filtro');
  });

  it('should click on a user to view details', async function() {
    // Clicar em um usuário específico (geralmente o admin sempre existe)
    await usuariosPage.clickUsuarioByName('Admin');
    
    // Verificar se foi para a página de detalhes
    const currentUrl = await testBase.driver.getCurrentUrl();
    expect(currentUrl).toContain('/usuarios/', 'Deveria navegar para detalhes do usuário');
    
    // Verificar se os detalhes estão sendo exibidos
    const detalhesTitle = await testBase.driver.findElement(By.css('h1, h2'));
    const title = await detalhesTitle.getText();
    expect(title).toContain('Admin', 'Título deveria conter o nome do usuário');
  });
});