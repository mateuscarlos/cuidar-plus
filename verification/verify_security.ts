import { sanitizeData } from '../src/core/lib/security';
import assert from 'assert';

console.log('🔒 Verifying Security Utilities...');

// Test 1: Mask sensitive keys
const sensitiveData = {
  password: 'mySecretPassword',
  token: 'abc123token',
  user: {
    name: 'John Doe',
    accessToken: 'secretAccessToken',
    creditCard: '1234-5678-9012-3456'
  }
};

const sanitized1 = sanitizeData(sensitiveData) as { password: string, token: string, user: { name: string, accessToken: string, creditCard: string } };
assert.strictEqual(sanitized1.password, '*** MASKED ***', 'Password should be masked');
assert.strictEqual(sanitized1.token, '*** MASKED ***', 'Token should be masked');
assert.strictEqual(sanitized1.user.name, 'John Doe', 'Non-sensitive data should be preserved');
assert.strictEqual(sanitized1.user.accessToken, '*** MASKED ***', 'Nested sensitive data should be masked');
assert.strictEqual(sanitized1.user.creditCard, '*** MASKED ***', 'Credit card should be masked');

console.log('✅ Sensitive keys masked successfully');

// Test 2: Case insensitivity
const caseData = {
  PASSWORD: 'password',
  ApiKey: 'key123'
};
const sanitized2 = sanitizeData(caseData) as { PASSWORD: string, ApiKey: string };
assert.strictEqual(sanitized2.PASSWORD, '*** MASKED ***', 'Uppercase keys should be masked');
assert.strictEqual(sanitized2.ApiKey, '*** MASKED ***', 'Mixed case keys should be masked');

console.log('✅ Case insensitivity verified');

// Test 3: Arrays handling
const arrayData = [
  { id: 1, secret: 's1' },
  { id: 2, secret: 's2' }
];
const sanitized3 = sanitizeData(arrayData) as { id: number, secret: string }[];
assert.strictEqual(sanitized3[0].id, 1);
assert.strictEqual(sanitized3[0].secret, '*** MASKED ***');
assert.strictEqual(sanitized3[1].secret, '*** MASKED ***');

console.log('✅ Arrays handled successfully');

// Test 4: Special types preservation
const date = new Date();
const dataWithDate = {
  createdAt: date,
  password: '123'
};
const sanitized4 = sanitizeData(dataWithDate) as { createdAt: Date, password: string };
assert.strictEqual(sanitized4.createdAt, date, 'Date object should be preserved by reference');
assert.strictEqual(sanitized4.password, '*** MASKED ***');

console.log('✅ Special types preserved');

// Test 5: Null and undefined
assert.strictEqual(sanitizeData(null), null);
assert.strictEqual(sanitizeData(undefined), undefined);

console.log('✅ Null/Undefined handled successfully');

console.log('🎉 All security checks passed!');
