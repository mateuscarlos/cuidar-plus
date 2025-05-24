import { By, WebDriver } from 'selenium-webdriver';
import { ElementHelpers } from '../utils/element-helpers';

/**
 * Page Object para a tela inicial (home)
 */
export class HomePage {
  // Seletores para elementos da página
  private userWelcome = By.css('.welcome-message');
  private pacientesCard = By.css('[data-testid="card-pacientes"]');
  private farmaciaCard = By.css('[data-testid="card-farmacia"]');
  private usuariosCard = By.css('[data-testid="card-usuarios"]');
  private configuracaoCard = By.css('[data-testid="card-configuracao"]');
  private relatoriosCard = By.css('[data-testid="card-relatorios"]');

  constructor(private driver: WebDriver, private helpers: ElementHelpers) {}

  /**
   * Verifica se o usuário está na página inicial
   */
  async isOnHomePage(): Promise<boolean> {
    return await this.helpers.isElementVisible(this.userWelcome);
  }

  /**
   * Obtém o nome do usuário logado
   */
  async getUserName(): Promise<string> {
    const welcomeText = await this.driver.findElement(this.userWelcome).getText();
    // Extrair nome do usuário de uma mensagem como "Bem-vindo, Nome Sobrenome"
    const match = welcomeText.match(/Bem-vindo(?:\(a\))?,\s+(.+)$/i);
    return match ? match[1].trim() : welcomeText;
  }

  /**
   * Navega para a seção de Pacientes
   */
  async navigateToPacientes(): Promise<void> {
    await this.helpers.click(this.pacientesCard);
  }

  /**
   * Navega para a seção de Farmácia
   */
  async navigateToFarmacia(): Promise<void> {
    await this.helpers.click(this.farmaciaCard);
  }

  /**
   * Navega para a seção de Usuários
   */
  async navigateToUsuarios(): Promise<void> {
    await this.helpers.click(this.usuariosCard);
  }

  /**
   * Navega para a seção de Configurações
   */
  async navigateToConfiguracoes(): Promise<void> {
    await this.helpers.click(this.configuracaoCard);
  }

  /**
   * Navega para a seção de Relatórios
   */
  async navigateToRelatorios(): Promise<void> {
    await this.helpers.click(this.relatoriosCard);
  }

  /**
   * Verifica se todos os cards principais estão visíveis
   */
  async areMainCardsVisible(): Promise<boolean> {
    const cards = [
      this.pacientesCard,
      this.farmaciaCard,
      this.usuariosCard,
      this.configuracaoCard,
      this.relatoriosCard
    ];
    
    for (const card of cards) {
      if (!await this.helpers.isElementVisible(card)) {
        return false;
      }
    }
    
    return true;
  }
}