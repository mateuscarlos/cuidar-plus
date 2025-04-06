export const environment = {
  production: false,
  testing: true,
  apiUrl: 'http://localhost:5001', // Ajuste para a porta correta do Flask
  logLevel: 'debug',
  mockEnabled: false  // In dev mode, we might still want to use mocks sometimes
};