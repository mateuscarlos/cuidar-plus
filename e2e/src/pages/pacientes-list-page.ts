import { By, WebDriver, WebElement, until } from 'selenium-webdriver';
import { ElementHelpers } from '../utils/element-helpers';
import { testConfig } from '../../config'; 

/**
 * Page Object para a lista de pacientes
 */
export class PacientesListPage {
  // Seletores para elementos da página
  private pageTitle = By.css('h1');
  private cadastrarPacienteBtn = By.css('[data-testid="cadastrar-paciente-btn"]');
  private searchInput = By.css('input[placeholder*="Buscar paciente"]');
  private searchButton = By.css('button[type="submit"]');
  private pacientesList = By.css('.pacientes-list');
  private pacienteItems = By.css('.paciente-item');
  private emptyResultMessage = By.css('.empty-results');
  private paginationContainer = By.css('.pagination');

  constructor(private driver: WebDriver, private helpers: ElementHelpers) {}

  /**
   * Navega para a página de lista de pacientes
   */
  async navigate(): Promise<void> {
    await this.driver.get(`${testConfig.baseUrl}/pacientes/lista`);
    await this.helpers.waitForElementToBeVisible(this.pageTitle);
  }

  /**
   * Navega para a página de cadastro de pacientes
   */
  async goToCadastrarPaciente(): Promise<void> {
    await this.helpers.click(this.cadastrarPacienteBtn);
    // Wait for redirect
    await this.driver.wait(until.urlContains('/pacientes/criar'), 5000);
  }

  /**
   * Busca pacientes pelo texto fornecido
   */
  async buscarPaciente(termo: string): Promise<void> {
    await this.helpers.sendKeys(this.searchInput, termo);
    await this.helpers.click(this.searchButton);
    
    // Esperar até que a busca seja concluída
    // Podemos identificar isso pela presença de resultados ou mensagem de vazio
    await this.driver.wait(async () => {
      return await this.helpers.isElementPresent(this.pacienteItems) || 
             await this.helpers.isElementPresent(this.emptyResultMessage);
    }, 5000);
  }

  /**
   * Obtém o número de resultados de pacientes na lista atual
   */
  async getNumeroDeResultados(): Promise<number> {
    if (await this.helpers.isElementPresent(this.emptyResultMessage)) {
      return 0;
    }
    
    const pacientes = await this.driver.findElements(this.pacienteItems);
    return pacientes.length;
  }

  /**
   * Clica em um paciente específico por nome
   */
  async clickPacienteByName(nome: string): Promise<void> {
    const pacienteXpath = By.xpath(`//div[contains(@class,'paciente-item')]//h5[contains(text(),'${nome}')]/ancestor::div[contains(@class,'paciente-item')]`);
    await this.helpers.click(pacienteXpath);
  }

  /**
   * Verifica se existem controles de paginação
   */
  async hasPagination(): Promise<boolean> {
    return await this.helpers.isElementPresent(this.paginationContainer);
  }

  /**
   * Navega para a próxima página, se houver
   */
  async goToNextPage(): Promise<boolean> {
    const nextButton = By.css('.pagination .page-item:not(.disabled) .page-link[aria-label="Next"]');
    if (await this.helpers.isElementPresent(nextButton)) {
      await this.helpers.click(nextButton);
      return true;
    }
    return false;
  }
}