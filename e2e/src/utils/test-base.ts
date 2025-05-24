import { Builder, WebDriver } from 'selenium-webdriver';
import { Options as ChromeOptions } from 'selenium-webdriver/chrome';
import { testConfig } from '../../config';
import { ElementHelpers } from './element-helpers';

/**
 * Classe base para todos os testes E2E
 * Gerencia configuração do navegador, inicialização e finalização
 */
export class TestBase {
  protected driver!: WebDriver;
  protected helpers!: ElementHelpers;

  /**
   * Configura o WebDriver antes de cada teste
   */
  async setUp(): Promise<void> {
    console.log('Iniciando WebDriver...');
    
    const chromeOptions = new ChromeOptions();
    chromeOptions.addArguments(...testConfig.selenium.capabilities['goog:chromeOptions'].args);

    this.driver = await new Builder()
      .forBrowser(testConfig.selenium.browserName)
      .setChromeOptions(chromeOptions)
      .build();

    // Configurar timeouts
    await this.driver.manage().setTimeouts({
      implicit: testConfig.implicitWaitTimeout,
      pageLoad: testConfig.pageLoadTimeout,
      script: testConfig.defaultTimeout
    });
    
    // Maximizar janela mesmo em modo headless
    await this.driver.manage().window().maximize();
    
    // Inicializar helpers
    this.helpers = new ElementHelpers(this.driver);
    
    console.log('WebDriver iniciado com sucesso.');
  }

  /**
   * Finaliza o WebDriver após cada teste
   */
  async tearDown(): Promise<void> {
    console.log('Finalizando WebDriver...');
    if (this.driver) {
      await this.driver.quit();
    }
    console.log('WebDriver finalizado.');
  }

  /**
   * Navega para uma URL específica usando a baseUrl
   */
  async navigateTo(url: string): Promise<void> {
    console.log(`Navegando para: ${testConfig.baseUrl}${url}`);
    await this.driver.get(`${testConfig.baseUrl}${url}`);
  }

  /**
   * Tira um screenshot do estado atual
   */
  async takeScreenshot(name: string): Promise<void> {
    try {
      const image = await this.driver.takeScreenshot();
      // Aqui você pode implementar a lógica para salvar o screenshot
      console.log(`Screenshot capturado: ${name}`);
    } catch (error) {
      console.error(`Erro ao capturar screenshot ${name}:`, error);
    }
  }
}