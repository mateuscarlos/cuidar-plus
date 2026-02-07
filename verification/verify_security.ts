
import { sanitizeData } from '../src/core/lib/security';

const mockData = {
  username: 'user123',
  password: 'supersecretpassword',
  token: 'eyJhGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  profile: {
    firstName: 'John',
    lastName: 'Doe',
    cpf: '123.456.789-00',
    rg: '12.345.678-9',
    address: {
      street: '123 Main St',
      city: 'Anytown'
    },
    // Test false positives
    target: 'should not be masked (contains rg)',
    company: 'should not be masked (contains pan)',
    span: 'should not be masked (contains pan)',
    argon: 'should not be masked (contains rg)',
    authorization: 'Bearer token', // Exact match sensitive
    author: 'should not be masked (contains auth)', // But 'auth' is not in substrings, 'token' is
    authToken: 'should be masked (contains token)',
  },
  settings: {
    theme: 'dark',
    notifications: true
  },
  paymentMethods: [
    {
      type: 'creditCard',
      cardNumber: '4111 1111 1111 1111',
      cvv: '123',
      expiry: '12/25',
      pan: '123456789' // Exact match sensitive
    }
  ],
  auth: {
    accessToken: 'access-token-123',
    refreshToken: 'refresh-token-456'
  }
};

console.log('Original Data:', JSON.stringify(mockData, null, 2));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sanitized = sanitizeData(mockData) as any;

console.log('Sanitized Data:', JSON.stringify(sanitized, null, 2));

// Assertions
const errors: string[] = [];

// True Positives
if (sanitized.password !== '***MASKED***') errors.push('Password was not masked');
if (sanitized.token !== '***MASKED***') errors.push('Token was not masked');
if (sanitized.profile.cpf !== '***MASKED***') errors.push('CPF was not masked');
if (sanitized.profile.rg !== '***MASKED***') errors.push('RG was not masked');
if (sanitized.profile.authorization !== '***MASKED***') errors.push('Authorization header was not masked');
if (sanitized.profile.authToken !== '***MASKED***') errors.push('AuthToken was not masked');
if (sanitized.auth.accessToken !== '***MASKED***') errors.push('AccessToken was not masked');
if (sanitized.auth.refreshToken !== '***MASKED***') errors.push('RefreshToken was not masked');
if (sanitized.paymentMethods[0].cvv !== '***MASKED***') errors.push('CVV in array was not masked');
if (sanitized.paymentMethods[0].cardNumber !== '***MASKED***') errors.push('CardNumber was not masked');
if (sanitized.paymentMethods[0].pan !== '***MASKED***') errors.push('PAN was not masked');

// False Positives
if (sanitized.profile.target === '***MASKED***') errors.push('Target was incorrectly masked (false positive for rg)');
if (sanitized.profile.company === '***MASKED***') errors.push('Company was incorrectly masked (false positive for pan)');
if (sanitized.profile.span === '***MASKED***') errors.push('Span was incorrectly masked (false positive for pan)');
if (sanitized.profile.argon === '***MASKED***') errors.push('Argon was incorrectly masked (false positive for rg)');
if (sanitized.profile.author === '***MASKED***') errors.push('Author was incorrectly masked');

// Integrity
if (sanitized.username !== 'user123') errors.push('Username was incorrectly modified');
if (sanitized.profile.firstName !== 'John') errors.push('First name was incorrectly modified');

if (errors.length > 0) {
  console.error('❌ Verification Failed:');
  errors.forEach(e => console.error(`- ${e}`));
  process.exit(1);
} else {
  console.log('✅ Verification Passed: sensitive data masked correctly and false positives avoided.');
}
