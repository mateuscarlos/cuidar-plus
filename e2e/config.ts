import { Config } from 'selenium-webdriver';

/**
 * Configurações globais para os testes E2E com Selenium
 */
export const testConfig = {
  // URL base da aplicação
  baseUrl: 'http://localhost:4200',
  
  // Configurações do Selenium WebDriver
  selenium: {
    server: 'http://localhost:4444/wd/hub',
    browserName: 'chrome',
    capabilities: {
      browserName: 'chrome',
      'goog:chromeOptions': {
        args: [
          '--headless',
          '--disable-gpu',
          '--window-size=1920,1080',
          '--no-sandbox',
          '--disable-dev-shm-usage'
        ]
      }
    }
  },
  
  // Configurações de timeout
  implicitWaitTimeout: 10000,   // Tempo de espera para elementos (ms)
  defaultTimeout: 15000,        // Timeout geral (ms)
  pageLoadTimeout: 30000,       // Timeout para carregamento de páginas (ms)
  
  // Credenciais para testes
  testUser: {
    email: 'usuario_teste@example.com',
    senha: 'senha123'
  }
};