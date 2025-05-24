import { By, WebDriver, until } from 'selenium-webdriver';
import { ElementHelpers } from '../utils/element-helpers';
import { testConfig } from '../../config'; 

/**
 * Page Object para criação de acompanhamento de pacientes
 */
export class AcompanhamentoPacientePage {
  // Seletores para elementos da página
  private pageTitle = By.css('h1');
  private pacienteSelect = By.css('#paciente-select');
  private pacienteSearchInput = By.id('paciente-search');
  private dataAtendimentoInput = By.id('data_atendimento');
  private horaAtendimentoInput = By.id('hora_atendimento');
  private tipoAtendimentoSelect = By.id('tipo_atendimento');
  private sintomas = By.id('sintomas_relatados');
  private queixas = By.id('queixas_principais');
  private nivelDorSelect = By.id('nivel_dor');
  private localizacaoDorInput = By.id('localizacao_dor');
  private pressaoArterial = By.id('pressao_arterial');
  private frequenciaCardiaca = By.id('frequencia_cardiaca');
  private temperatura = By.id('temperatura');
  private saturacaoOxigenio = By.id('saturacao_oxigenio');
  private orientacoesFornecidas = By.id('orientacoes_fornecidas');
  private dataProximoInput = By.id('data_proximo');
  private horaProximoInput = By.id('hora_proximo');
  private salvarButton = By.css('button[type="submit"]');
  private cancelarButton = By.css('button[type="button"][class*="btn-secondary"]');
  private sucessoMessage = By.css('.success-message');

  constructor(private driver: WebDriver, private helpers: ElementHelpers) {}

  /**
   * Navega para a página de criação de acompanhamento
   */
  async navigate(): Promise<void> {
    await this.driver.get(`${testConfig.baseUrl}/pacientes/acompanhamento/criar`);
    await this.helpers.waitForElementToBeVisible(this.pageTitle);
  }

  /**
   * Busca e seleciona um paciente pelo nome
   */
  async selecionarPaciente(nomePaciente: string): Promise<void> {
    await this.helpers.click(this.pacienteSelect);
    await this.helpers.sendKeys(this.pacienteSearchInput, nomePaciente);
    await this.driver.sleep(500); // Esperar carregar os resultados
    
    // Selecionar o primeiro paciente da lista de resultados
    const pacienteResultItem = By.xpath(`//div[contains(@class,'paciente-item')]//h5[contains(text(),'${nomePaciente}')]/ancestor::div[contains(@class,'paciente-item')]`);
    await this.helpers.click(pacienteResultItem);
  }

  /**
   * Preenche o formulário de acompanhamento
   */
  async preencherFormulario(dadosAcompanhamento: any): Promise<void> {
    // Informações do atendimento
    if (dadosAcompanhamento.data_atendimento) {
      await this.helpers.sendKeys(this.dataAtendimentoInput, dadosAcompanhamento.data_atendimento);
    }
    
    if (dadosAcompanhamento.hora_atendimento) {
      await this.helpers.sendKeys(this.horaAtendimentoInput, dadosAcompanhamento.hora_atendimento);
    }
    
    if (dadosAcompanhamento.tipo_atendimento) {
      await this.helpers.selectByVisibleText(this.tipoAtendimentoSelect, dadosAcompanhamento.tipo_atendimento);
    }
    
    // Avaliação do paciente
    if (dadosAcompanhamento.sintomas_relatados) {
      await this.helpers.sendKeys(this.sintomas, dadosAcompanhamento.sintomas_relatados);
    }
    
    if (dadosAcompanhamento.queixas_principais) {
      await this.helpers.sendKeys(this.queixas, dadosAcompanhamento.queixas_principais);
    }
    
    // Nível de dor
    if (dadosAcompanhamento.nivel_dor) {
      await this.helpers.selectByVisibleText(this.nivelDorSelect, dadosAcompanhamento.nivel_dor);
    }
    
    if (dadosAcompanhamento.localizacao_dor) {
      await this.helpers.sendKeys(this.localizacaoDorInput, dadosAcompanhamento.localizacao_dor);
    }
    
    // Sinais vitais
    if (dadosAcompanhamento.sinais_vitais?.pressao_arterial) {
      await this.helpers.sendKeys(this.pressaoArterial, dadosAcompanhamento.sinais_vitais.pressao_arterial);
    }
    
    if (dadosAcompanhamento.sinais_vitais?.frequencia_cardiaca) {
      await this.helpers.sendKeys(this.frequenciaCardiaca, dadosAcompanhamento.sinais_vitais.frequencia_cardiaca.toString());
    }
    
    if (dadosAcompanhamento.sinais_vitais?.temperatura) {
      await this.helpers.sendKeys(this.temperatura, dadosAcompanhamento.sinais_vitais.temperatura.toString());
    }
    
    if (dadosAcompanhamento.sinais_vitais?.saturacao_oxigenio) {
      await this.helpers.sendKeys(this.saturacaoOxigenio, dadosAcompanhamento.sinais_vitais.saturacao_oxigenio.toString());
    }
    
    // Intervenções
    if (dadosAcompanhamento.intervencoes?.orientacoes_fornecidas) {
      await this.helpers.sendKeys(this.orientacoesFornecidas, dadosAcompanhamento.intervencoes.orientacoes_fornecidas);
    }
    
    // Plano de ação
    if (dadosAcompanhamento.plano_acao?.data_proximo) {
      await this.helpers.sendKeys(this.dataProximoInput, dadosAcompanhamento.plano_acao.data_proximo);
    }
    
    if (dadosAcompanhamento.plano_acao?.hora_proximo) {
      await this.helpers.sendKeys(this.horaProximoInput, dadosAcompanhamento.plano_acao.hora_proximo);
    }
  }

  /**
   * Submete o formulário de acompanhamento
   */
  async salvarAcompanhamento(): Promise<void> {
    await this.helpers.click(this.salvarButton);
    
    // Esperar pela mensagem de sucesso
    try {
      await this.helpers.waitForElementToBeVisible(this.sucessoMessage);
    } catch (error) {
      console.error('Erro ao salvar acompanhamento, formulário pode conter erros.');
      throw error;
    }
  }

  /**
   * Verifica se o acompanhamento foi salvo com sucesso
   */
  async isAcompanhamentoSalvoComSucesso(): Promise<boolean> {
    return await this.helpers.isElementVisible(this.sucessoMessage);
  }

  /**
   * Cancela a criação do acompanhamento
   */
  async cancelarAcompanhamento(): Promise<void> {
    await this.helpers.click(this.cancelarButton);
  }
}