import { sanitizeData } from '../src/core/lib/security';

function testSanitizeData() {
  console.log('Testing sanitizeData...');

  const sensitive = {
    username: 'user',
    password: 'secretPassword',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
    meta: {
      ip: '127.0.0.1',
      accessToken: 'access-token-123',
    },
    items: [
      { id: 1, secret: 'hidden' },
      { id: 2, note: 'public' },
    ],
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sanitized = sanitizeData(sensitive) as any;

  // Assertions
  if (sanitized.password !== '*****') {
    console.error('Expected password to be *****, got:', sanitized.password);
    throw new Error('Failed to sanitize password');
  }
  if (sanitized.token !== '*****') {
    console.error('Expected token to be *****, got:', sanitized.token);
    throw new Error('Failed to sanitize token');
  }
  if (sanitized.meta.accessToken !== '*****') {
    console.error('Expected accessToken to be *****, got:', sanitized.meta.accessToken);
    throw new Error('Failed to sanitize nested accessToken');
  }
  if (sanitized.items[0].secret !== '*****') {
    console.error('Expected secret to be *****, got:', sanitized.items[0].secret);
    throw new Error('Failed to sanitize array item secret');
  }
  if (sanitized.username !== 'user') {
    console.error('Expected username to be user, got:', sanitized.username);
    throw new Error('Incorrectly sanitized username');
  }
  if (sanitized.meta.ip !== '127.0.0.1') {
    console.error('Expected meta.ip to be 127.0.0.1, got:', sanitized.meta.ip);
    throw new Error('Incorrectly sanitized meta.ip');
  }

  console.log('✅ sanitizeData test passed!');
}

testSanitizeData();
