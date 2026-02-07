
import { sanitizeData } from '../src/core/lib/security';

const mockData = {
  username: 'user123',
  password: 'REDACTED_PASSWORD',
  token: 'REDACTED_TOKEN_VALUE',
  profile: {
    firstName: 'John',
    lastName: 'Doe',
    cpf: '000.000.000-00',
    rg: '00.000.000-0',
    address: {
      street: '123 Main St',
      city: 'Anytown'
    },
    // Test false positives
    target: 'should not be masked (contains rg)',
    company: 'should not be masked (contains pan)',
    span: 'should not be masked (contains pan)',
    argon: 'should not be masked (contains rg)',
    authorization: 'Bearer REDACTED_AUTH', // Exact match sensitive
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
      cardNumber: '0000 0000 0000 0000',
      cvv: '000',
      expiry: '12/99',
      pan: '000000000' // Exact match sensitive
    }
  ],
  auth: {
    accessToken: 'REDACTED_ACCESS_TOKEN',
    refreshToken: 'REDACTED_REFRESH_TOKEN'
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
