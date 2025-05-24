import { TestBase } from '../utils/test-base';
import { LoginPage } from '../pages/login-page';
import { HomePage } from '../pages/home-page';
import { testConfig } from '../../config';

describe('Login Tests', function() {
  let testBase: TestBase;
  let loginPage: LoginPage;
  let homePage: HomePage;

  beforeEach(async function() {
    testBase = new TestBase();
    await testBase.setUp();
    loginPage = new LoginPage(testBase.driver, testBase.helpers);
    homePage = new HomePage(testBase.driver, testBase.helpers);
  });

  afterEach(async function() {
    await testBase.tearDown();
  });

  it('should login with valid credentials', async function() {
    await loginPage.navigate();
    await loginPage.login(testConfig.testUser.email, testConfig.testUser.senha);
    
    // Verificar se redirecionou para a página inicial após o login
    const isOnHome = await homePage.isOnHomePage();
    expect(isOnHome).toBeTruthy('Usuário deveria estar na página inicial após login');
  });

  it('should show error with invalid credentials', async function() {
    await loginPage.navigate();
    
    try {
      const errorMessage = await loginPage.attemptInvalidLogin('usuario_invalido@example.com', 'senha_errada');
      expect(errorMessage).toContain('Credenciais inválidas', 'Deveria mostrar mensagem de erro para credenciais inválidas');
    } catch (error) {
      fail('Deveria mostrar mensagem de erro, mas lançou exceção: ' + error);
    }
  });
  
  it('should display required field errors when submitting empty form', async function() {
    await loginPage.navigate();
    
    // Clicar no botão sem preencher campos
    await testBase.helpers.click(By.css('button[type="submit"]'));
    
    // Verificar mensagens de validação
    const emailError = await testBase.driver.findElement(By.id('email-error'));
    const senhaError = await testBase.driver.findElement(By.id('senha-error'));
    
    expect(await emailError.getText()).toContain('obrigatório', 'Deveria mostrar erro para email obrigatório');
    expect(await senhaError.getText()).toContain('obrigatória', 'Deveria mostrar erro para senha obrigatória');
  });
});