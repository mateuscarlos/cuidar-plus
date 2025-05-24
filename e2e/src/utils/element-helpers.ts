import { WebDriver, WebElement, By, until, Condition } from 'selenium-webdriver';
import { testConfig } from '../../config';

/**
 * Classe de ajuda para manipulação de elementos da página
 * Provê métodos de espera, interação e verificação
 */
export class ElementHelpers {
  constructor(private driver: WebDriver) {}

  /**
   * Espera elemento estar presente no DOM
   */
  async waitForElement(locator: By): Promise<WebElement> {
    return await this.driver.wait(until.elementLocated(locator), testConfig.defaultTimeout);
  }

  /**
   * Espera elemento estar visível
   */
  async waitForElementToBeVisible(locator: By): Promise<WebElement> {
    const element = await this.waitForElement(locator);
    return await this.driver.wait(until.elementIsVisible(element), testConfig.defaultTimeout);
  }

  /**
   * Espera elemento estar clicável
   */
  async waitForElementToBeClickable(locator: By): Promise<WebElement> {
    const element = await this.waitForElementToBeVisible(locator);
    return await this.driver.wait(until.elementIsEnabled(element), testConfig.defaultTimeout);
  }

  /**
   * Clica em um elemento com segurança (após esperar ele estar disponível)
   */
  async click(locator: By): Promise<void> {
    try {
      const element = await this.waitForElementToBeClickable(locator);
      await element.click();
    } catch (error) {
      console.error(`Erro ao clicar no elemento ${locator}:`, error);
      throw error;
    }
  }

  /**
   * Preenche um campo de texto
   */
  async sendKeys(locator: By, text: string): Promise<void> {
    try {
      const element = await this.waitForElementToBeVisible(locator);
      await element.clear();
      await element.sendKeys(text);
    } catch (error) {
      console.error(`Erro ao preencher o elemento ${locator}:`, error);
      throw error;
    }
  }

  /**
   * Seleciona uma opção em um dropdown pelo texto visível
   */
  async selectByVisibleText(locator: By, optionText: string): Promise<void> {
    try {
      await this.click(locator);
      const options = await this.driver.findElements(By.xpath(`//option[text()='${optionText}']`));
      if (options.length > 0) {
        await options[0].click();
      } else {
        throw new Error(`Opção '${optionText}' não encontrada no dropdown`);
      }
    } catch (error) {
      console.error(`Erro ao selecionar opção no dropdown ${locator}:`, error);
      throw error;
    }
  }

  /**
   * Verifica se um elemento está presente no DOM
   */
  async isElementPresent(locator: By): Promise<boolean> {
    try {
      const elements = await this.driver.findElements(locator);
      return elements.length > 0;
    } catch (error) {
      return false;
    }
  }

  /**
   * Verifica se um elemento está visível
   */
  async isElementVisible(locator: By): Promise<boolean> {
    try {
      const element = await this.driver.findElement(locator);
      return await element.isDisplayed();
    } catch (error) {
      return false;
    }
  }

  /**
   * Espera texto estar presente em um elemento
   */
  async waitForTextPresent(locator: By, text: string): Promise<boolean> {
    return await this.driver.wait(async () => {
      try {
        const element = await this.driver.findElement(locator);
        const elementText = await element.getText();
        return elementText.includes(text);
      } catch (error) {
        return false;
      }
    }, testConfig.defaultTimeout);
  }

  /**
   * Executa JavaScript na página
   */
  async executeScript(script: string): Promise<any> {
    return await this.driver.executeScript(script);
  }

  /**
   * Espera carregamento da página completo
   */
  async waitForPageLoad(): Promise<void> {
    await this.driver.wait(() => {
      return this.driver.executeScript('return document.readyState').then(readyState => {
        return readyState === 'complete';
      });
    }, testConfig.pageLoadTimeout);
  }
}