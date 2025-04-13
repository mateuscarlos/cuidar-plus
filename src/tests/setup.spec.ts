import { configure } from 'jasmine-core';

// Create an interface for the configure function instead of trying to augment the module
interface JasmineConfigOptions {
  spec_dir: string;
  spec_files: string[];
  helpers: string[];
}

// Use the imported configure function with type assertion
configure({
    spec_dir: 'src/tests',
    spec_files: [
        '**/*[sS]pec.js'
    ],
    helpers: [
        'helpers/**/*.js'
    ]
});

// Arquivo setup para configurar o ambiente de testes
// Não importar diretamente jasmine-core que utiliza módulos do Node

// Configure Jasmine using the global jasmine object
jasmine.getEnv().configure({
  random: false,
  stopSpecOnExpectationFailure: false
});

// Add custom matchers or other setup here if needed
beforeAll(() => {
  // Any global setup before all tests
});

describe('Test Environment Setup', () => {
  it('should initialize properly', () => {
    expect(true).toBeTruthy();
  });
});