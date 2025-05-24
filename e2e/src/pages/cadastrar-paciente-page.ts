import { By, WebDriver, until } from 'selenium-webdriver';
import { ElementHelpers } from '../utils/element-helpers';
import { testConfig } from '../../config'; 

/**
 * Page Object para cadastro de pacientes
 */
export class CadastrarPacientePage {
  // Seletores para elementos da página
  private pageTitle = By.css('h1');
  private nomeInput = By.id('nome_completo');
  private cpfInput = By.id('cpf');
  private dataNascInput = By.id('data_nascimento');
  private sexoSelect = By.id('sexo');
  private emailInput = By.id('email');
  private telefoneInput = By.id('telefone');
  private celularInput = By.id('celular');
  private cepInput = By.id('cep');
  private logradouroInput = By.id('logradouro');
  private numeroInput = By.id('numero');
  private complementoInput = By.id('complemento');
  private bairroInput = By.id('bairro');
  private cidadeInput = By.id('cidade');
  private estadoInput = By.id('estado');
  private convenioSelect = By.id('convenio');
  private planoSelect = By.id('plano');
  private dataValidadeInput = By.id('validade_plano');
  private carteirinhaInput = By.id('carteirinha');
  private tipoSanguineoSelect = By.id('tipo_sanguineo');
  private alergiaSelect = By.id('possui_alergia');
  private descricaoAlergiaInput = By.id('descricao_alergia');
  private statusSelect = By.id('status');
  private cadastrarBtn = By.css('button[type="submit"]');
  private cancelarBtn = By.css('button[type="button"][class*="btn-secondary"]');
  private sucessoModal = By.id('sucessoModal');

  constructor(private driver: WebDriver, private helpers: ElementHelpers) {}

  /**
   * Navega para a página de cadastro de pacientes
   */
  async navigate(): Promise<void> {
    await this.driver.get(`${testConfig.baseUrl}/pacientes/criar`);
    await this.helpers.waitForElementToBeVisible(this.pageTitle);
  }

  /**
   * Preenche o formulário de cadastro de paciente
   */
  async fillForm(pacienteData: any): Promise<void> {
    // Dados pessoais
    if (pacienteData.nome_completo) {
      await this.helpers.sendKeys(this.nomeInput, pacienteData.nome_completo);
    }
    
    if (pacienteData.cpf) {
      await this.helpers.sendKeys(this.cpfInput, pacienteData.cpf);
    }
    
    if (pacienteData.data_nascimento) {
      await this.helpers.sendKeys(this.dataNascInput, pacienteData.data_nascimento);
    }
    
    if (pacienteData.sexo) {
      await this.helpers.selectByVisibleText(this.sexoSelect, pacienteData.sexo);
    }
    
    // Contato
    if (pacienteData.email) {
      await this.helpers.sendKeys(this.emailInput, pacienteData.email);
    }
    
    if (pacienteData.telefone) {
      await this.helpers.sendKeys(this.telefoneInput, pacienteData.telefone);
    }
    
    if (pacienteData.celular) {
      await this.helpers.sendKeys(this.celularInput, pacienteData.celular);
    }
    
    // Endereço
    if (pacienteData.endereco?.cep) {
      await this.helpers.sendKeys(this.cepInput, pacienteData.endereco.cep);
      // Esperar um tempo para que o sistema busque o CEP automaticamente
      await this.driver.sleep(1000);
    }
    
    if (pacienteData.endereco?.logradouro) {
      await this.helpers.sendKeys(this.logradouroInput, pacienteData.endereco.logradouro);
    }
    
    if (pacienteData.endereco?.numero) {
      await this.helpers.sendKeys(this.numeroInput, pacienteData.endereco.numero);
    }
    
    if (pacienteData.endereco?.complemento) {
      await this.helpers.sendKeys(this.complementoInput, pacienteData.endereco.complemento);
    }
    
    if (pacienteData.endereco?.bairro) {
      await this.helpers.sendKeys(this.bairroInput, pacienteData.endereco.bairro);
    }
    
    if (pacienteData.endereco?.cidade) {
      await this.helpers.sendKeys(this.cidadeInput, pacienteData.endereco.cidade);
    }
    
    if (pacienteData.endereco?.estado) {
      await this.helpers.selectByVisibleText(this.estadoInput, pacienteData.endereco.estado);
    }
    
    // Convênio
    if (pacienteData.convenio) {
      await this.helpers.selectByVisibleText(this.convenioSelect, pacienteData.convenio);
      // Esperar carregar os planos
      await this.driver.sleep(500);
    }
    
    if (pacienteData.plano) {
      await this.helpers.selectByVisibleText(this.planoSelect, pacienteData.plano);
    }
    
    if (pacienteData.validade_plano) {
      await this.helpers.sendKeys(this.dataValidadeInput, pacienteData.validade_plano);
    }
    
    if (pacienteData.carteirinha) {
      await this.helpers.sendKeys(this.carteirinhaInput, pacienteData.carteirinha);
    }
    
    // Informações médicas
    if (pacienteData.tipo_sanguineo) {
      await this.helpers.selectByVisibleText(this.tipoSanguineoSelect, pacienteData.tipo_sanguineo);
    }
    
    if (pacienteData.possui_alergia !== undefined) {
      await this.helpers.selectByVisibleText(
        this.alergiaSelect, 
        pacienteData.possui_alergia ? 'Sim' : 'Não'
      );
      
      if (pacienteData.possui_alergia && pacienteData.descricao_alergia) {
        await this.helpers.sendKeys(this.descricaoAlergiaInput, pacienteData.descricao_alergia);
      }
    }
    
    // Status
    if (pacienteData.status) {
      await this.helpers.selectByVisibleText(this.statusSelect, pacienteData.status);
    }
  }

  /**
   * Submete o formulário de cadastro
   */
  async submitForm(): Promise<void> {
    await this.helpers.click(this.cadastrarBtn);
    
    // Esperar pela exibição do modal de sucesso
    try {
      await this.helpers.waitForElementToBeVisible(this.sucessoModal);
    } catch (error) {
      // Se não aparecer o modal de sucesso, provavelmente há erros no formulário
      console.error('Erro ao cadastrar paciente, formulário pode conter erros.');
      throw error;
    }
  }

  /**
   * Verifica se o cadastro foi bem-sucedido
   */
  async isCadastroSucesso(): Promise<boolean> {
    return await this.helpers.isElementVisible(this.sucessoModal);
  }

  /**
   * Cancela o cadastro e retorna à lista
   */
  async cancelarCadastro(): Promise<void> {
    await this.helpers.click(this.cancelarBtn);
  }
}