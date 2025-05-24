import { By, WebDriver, until } from 'selenium-webdriver';

export class PacientesPage {
  constructor(private driver: WebDriver) {}

  // Seletores
  private cadastrarNovoBtn = By.css('[data-testid="cadastrar-paciente-btn"]');
  private pacientesList = By.css('.pacientes-list');
  private searchInput = By.css('input[placeholder="Buscar paciente..."]');
  private searchButton = By.css('button[type="submit"]');

  async navigate(): Promise<void> {
    await this.driver.get('http://localhost:4200/pacientes/lista');
    // Esperar até que a lista de pacientes esteja visível
    await this.driver.wait(until.elementLocated(this.pacientesList), 5000);
  }

  async cadastrarNovoPaciente(): Promise<void> {
    await this.driver.findElement(this.cadastrarNovoBtn).click();
    // Esperar pelo redirecionamento para a página de cadastro
    await this.driver.wait(until.urlContains('/pacientes/criar'), 5000);
  }

  async buscarPaciente(termo: string): Promise<void> {
    await this.driver.findElement(this.searchInput).clear();
    await this.driver.findElement(this.searchInput).sendKeys(termo);
    await this.driver.findElement(this.searchButton).click();
    
    // Esperar pelos resultados da busca
    await this.driver.sleep(1000); // Ou use um seletor mais específico para wait
  }

  async getNumeroDeResultados(): Promise<number> {
    const pacientes = await this.driver.findElements(By.css('.pacientes-list .paciente-item'));
    return pacientes.length;
  }
}