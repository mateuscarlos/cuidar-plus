import { TestBase } from '../utils/test-base';
import { LoginPage } from '../pages/login-page';
import { HomePage } from '../pages/home-page';
import { PatientsListPage } from '../pages/patients-list-page'; // Renamed class
import { PatientFollowUpPage } from '../pages/patient-followup-page'; // Renamed class
import { testConfig } from '../../config';
import { By } from 'selenium-webdriver';

describe('Patient Follow-up Tests', function() {
  let testBase: TestBase;
  let loginPage: LoginPage;
  let homePage: HomePage;
  let patientsListPage: PatientsListPage; // Renamed variable
  let followUpPage: PatientFollowUpPage; // Renamed variable

  // Test data
  const followUpData = {
    data_atendimento: '01/06/2025',
    hora_atendimento: '10:00',
    tipo_atendimento: 'Consulta',
    sintomas_relatados: 'Dor de cabeça, náusea',
    queixas_principais: 'Dor severa na região frontal',
    nivel_dor: 'Moderada',
    localizacao_dor: 'Região frontal da cabeça',
    sinais_vitais: {
      pressao_arterial: '120/80',
      frequencia_cardiaca: 75,
      temperatura: 36.5,
      saturacao_oxigenio: 98
    },
    intervencoes: {
      orientacoes_fornecidas: 'Repouso, hidratação e medicação conforme prescrito'
    },
    plano_acao: {
      data_proximo: '15/06/2025',
      hora_proximo: '10:30'
    }
  };

  beforeEach(async function() {
    testBase = new TestBase();
    await testBase.setUp();
    
    // Initialize pages - method approach to access protected members
    loginPage = await testBase.createPageInstance(LoginPage);
    homePage = await testBase.createPageInstance(HomePage);
    patientsListPage = await testBase.createPageInstance(PatientsListPage);
    followUpPage = await testBase.createPageInstance(PatientFollowUpPage);
    
    // Login before each test
    await loginPage.navigate();
    await loginPage.login(testConfig.testUser.email, testConfig.testUser.senha);
    
    // Navigate to patients section
    await homePage.navigateToPacientes();
  });

  afterEach(async function() {
    await testBase.tearDown();
  });

  it('should create new follow-up for a patient', async function() {
    // Navigate to create follow-up
    await testBase.navigateTo('/pacientes/acompanhamento/criar');
    
    // Select a patient
    await followUpPage.selecionarPaciente('Maria');
    
    // Fill the follow-up form
    await followUpPage.preencherFormulario(followUpData);
    
    // Save the follow-up
    await followUpPage.salvarAcompanhamento();
    
    // Verify if the follow-up was saved successfully
    const isSucesso = await followUpPage.isAcompanhamentoSalvoComSucesso();
    expect(isSucesso).toBeTruthy('Should show success message after saving');
  });

  it('should validate required fields in follow-up form', async function() {
    // Navigate to create follow-up
    await testBase.navigateTo('/pacientes/acompanhamento/criar');
    
    // Try to save without filling fields
    const submitButton = await testBase.getElement(By.css('button[type="submit"]'));
    await submitButton.click();
    
    // Check validation messages for required fields
    const pacienteError = await testBase.getElement(By.id('paciente-error'));
    const dataError = await testBase.getElement(By.id('data_atendimento-error'));
    
    expect(await pacienteError.isDisplayed()).toBeTruthy('Should show error for required patient');
    expect(await dataError.isDisplayed()).toBeTruthy('Should show error for required date');
  });
  
  it('should cancel follow-up creation and return to patient list', async function() {
    // Navigate to create follow-up
    await testBase.navigateTo('/pacientes/acompanhamento/criar');
    
    // Cancel the follow-up
    await followUpPage.cancelarAcompanhamento();
    
    // Check if returned to patient list
    const currentUrl = await testBase.getCurrentUrl();
    expect(currentUrl).toContain('/pacientes', 'Should return to patients section when canceling');
  });
});