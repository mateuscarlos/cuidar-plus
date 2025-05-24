import { By, WebDriver, until } from 'selenium-webdriver';
import { ElementHelpers } from '../utils/element-helpers';
import { testConfig } from '../../config'; 

/**
 * Page Object para gerenciamento de usuários
 */
export class UsuariosPage {
  // Seletores para elementos da página
  private pageTitle = By.css('h1');
  private createUserBtn = By.css('[data-testid="cadastrar-usuario-btn"]');
  private searchInput = By.css('input[placeholder*="Buscar usuário"]');
  private searchButton = By.css('button[type="submit"]');
  private usersList = By.css('.usuarios-list, .table-usuarios');
  private userItems = By.css('tr.usuario-item, .usuario-card');
  private emptyResultMessage = By.css('.empty-results, .no-results');
  private paginationContainer = By.css('.pagination');
  private sectorFilter = By.id('setor');
  private roleFilter = By.id('funcao');

  constructor(private driver: WebDriver, private helpers: ElementHelpers) {}

  /**
   * Navega para a página de lista de usuários
   */
  async navigate(): Promise<void> {
    await this.driver.get(`${testConfig.baseUrl}/usuarios/lista`);
    await this.helpers.waitForElementToBeVisible(this.pageTitle);
  }

  /**
   * Navega para a página de cadastro de usuários
   */
  async goToCreateUser(): Promise<void> {
    await this.helpers.click(this.createUserBtn);
    // Wait for redirect
    await this.driver.wait(until.urlContains('/usuarios/criar'), 5000);
  }

  /**
   * Busca usuários pelo texto fornecido
   */
  async searchUser(termo: string): Promise<void> {
    await this.helpers.sendKeys(this.searchInput, termo);
    await this.helpers.click(this.searchButton);
    
    // Esperar até que a busca seja concluída
    await this.driver.wait(async () => {
      return await this.helpers.isElementPresent(this.userItems) || 
             await this.helpers.isElementPresent(this.emptyResultMessage);
    }, 5000);
  }

  /**
   * Filtra usuários por setor
   */
  async filterBySector(nomeSetor: string): Promise<void> {
    await this.helpers.selectByVisibleText(this.sectorFilter, nomeSetor);
    
    // Aguardar a atualização da lista
    await this.driver.sleep(500);
  }

  /**
   * Filtra usuários por função
   */
  async filterByRole(nomeFuncao: string): Promise<void> {
    await this.helpers.selectByVisibleText(this.roleFilter, nomeFuncao);
    
    // Aguardar a atualização da lista
    await this.driver.sleep(500);
  }

  /**
   * Obtém o número de resultados de usuários na lista atual
   */
  async getResultCount(): Promise<number> {
    if (await this.helpers.isElementPresent(this.emptyResultMessage)) {
      return 0;
    }
    
    const usuarios = await this.driver.findElements(this.userItems);
    return usuarios.length;
  }

  /**
   * Clica em um usuário específico por nome
   */
  async clickUserByName(nome: string): Promise<void> {
    const usuarioXpath = By.xpath(`//td[contains(text(),'${nome}')]/ancestor::tr[contains(@class,'usuario-item')] | //div[contains(@class,'usuario-card')][contains(.,'${nome}')]`);
    await this.helpers.click(usuarioXpath);
  }
}