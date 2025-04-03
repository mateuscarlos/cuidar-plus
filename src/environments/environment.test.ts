export const environment = {
  production: false,
  testing: true,
  apiUrl: 'http://localhost:5002', // Using a different port than dev for the testing API
  logLevel: 'debug',
  mockEnabled: false  // We'll use the real API but in a test environment
};