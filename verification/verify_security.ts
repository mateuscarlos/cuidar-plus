import { sanitizeData } from '../src/core/lib/security';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

function testSanitizeData() {
  console.log('Testing sanitizeData...');

  // 1. Basic masking
  const data1 = {
    password: 'my-secret-password',
    token: 'abc-123',
    name: 'John Doe',
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sanitized1 = sanitizeData(data1) as any;
  assert(sanitized1.password === '***MASKED***', 'Password should be masked');
  assert(sanitized1.token === '***MASKED***', 'Token should be masked');
  assert(sanitized1.name === 'John Doe', 'Name should be preserved');

  // 2. Case insensitive
  const data2 = {
    PASSWORD: 'SECRET',
    Token: 'abc-123',
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sanitized2 = sanitizeData(data2) as any;
  assert(sanitized2.PASSWORD === '***MASKED***', 'PASSWORD should be masked');
  assert(sanitized2.Token === '***MASKED***', 'Token should be masked');

  // 3. Partial match
  const data3 = {
    userPassword: 'secret',
    accessToken: 'token',
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sanitized3 = sanitizeData(data3) as any;
  assert(sanitized3.userPassword === '***MASKED***', 'userPassword should be masked');
  assert(sanitized3.accessToken === '***MASKED***', 'accessToken should be masked');

  // 4. Nested objects
  const data4 = {
    user: {
      password: 'secret',
      details: {
        creditCard: '1234-5678',
      },
    },
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sanitized4 = sanitizeData(data4) as any;
  assert(sanitized4.user.password === '***MASKED***', 'Nested password should be masked');
  assert(sanitized4.user.details.creditCard === '***MASKED***', 'Nested creditCard should be masked');

  // 5. Arrays
  const data5 = [
    { password: 'secret1' },
    { password: 'secret2' },
  ];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sanitized5 = sanitizeData(data5) as any;
  assert(sanitized5[0].password === '***MASKED***', 'Array item 1 password should be masked');
  assert(sanitized5[1].password === '***MASKED***', 'Array item 2 password should be masked');

  console.log('All tests passed!');
}

try {
  testSanitizeData();
} catch (error) {
  console.error('Test failed:', error);
  process.exit(1);
}
