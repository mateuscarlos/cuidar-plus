import { By, WebDriver, until } from 'selenium-webdriver';
import { ElementHelpers } from '../utils/element-helpers';
import { testConfig } from '../../config';

/**
 * Page Object para a tela de login
 */
export class LoginPage {
  // Seletores para elementos da página
  private emailInput = By.id('email');
  private senhaInput = By.id('senha');
  private loginButton = By.css('button[type="submit"]');
  private errorMessage = By.css('.alert-danger');
  private logoImage = By.css('.login-logo img');

  constructor(private driver: WebDriver, private helpers: ElementHelpers) {}

  /**
   * Navega para a página de login
   */
  async navigate(): Promise<void> {
    await this.driver.get(`${testConfig.baseUrl}/login`);
    await this.helpers.waitForElementToBeVisible(this.loginButton);
  }

  /**
   * Realiza login com credenciais
   */
  async login(email: string, senha: string): Promise<void> {
    await this.helpers.sendKeys(this.emailInput, email);
    await this.helpers.sendKeys(this.senhaInput, senha);
    await this.helpers.click(this.loginButton);

    // Esperar pelo redirecionamento após o login
    try {
      await this.driver.wait(until.urlContains('/home'), 5000);
    } catch (error) {
      console.error('Erro ao realizar login, verificando mensagens de erro...');
      if (await this.helpers.isElementPresent(this.errorMessage)) {
        const message = await this.driver.findElement(this.errorMessage).getText();
        throw new Error(`Login falhou: ${message}`);
      } else {
        throw error;
      }
    }
  }

  /**
   * Tenta realizar login com expectativa de falha
   */
  async attemptInvalidLogin(email: string, senha: string): Promise<string> {
    await this.helpers.sendKeys(this.emailInput, email);
    await this.helpers.sendKeys(this.senhaInput, senha);
    await this.helpers.click(this.loginButton);
    
    // Esperar mensagem de erro
    await this.helpers.waitForElementToBeVisible(this.errorMessage);
    return await this.driver.findElement(this.errorMessage).getText();
  }
}