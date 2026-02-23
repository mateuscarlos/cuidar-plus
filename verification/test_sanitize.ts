import { sanitizeData } from '../src/core/lib/security';

const testCases = [
  {
    name: 'Simple object with password',
    input: { username: 'user', password: 'secretpassword' },
    expected: { username: 'user', password: '***' },
  },
  {
    name: 'Nested object',
    input: { user: { name: 'John', token: '12345' } },
    expected: { user: { name: 'John', token: '***' } },
  },
  {
    name: 'Array of objects',
    input: [{ id: 1, secret: 'abc' }, { id: 2, secret: 'def' }],
    expected: [{ id: 1, secret: '***' }, { id: 2, secret: '***' }],
  },
  {
    name: 'Case insensitive key match',
    input: { userPassword: '123', apiToken: '456' },
    expected: { userPassword: '***', apiToken: '***' },
  },
  {
    name: 'Non-sensitive data',
    input: { id: 1, name: 'Test' },
    expected: { id: 1, name: 'Test' },
  },
  {
      name: 'Null input',
      input: null,
      expected: null
  }
];

let failed = false;

console.log('Running sanitizeData tests...\n');

for (const test of testCases) {
  const result = sanitizeData(test.input);
  const resultStr = JSON.stringify(result);
  const expectedStr = JSON.stringify(test.expected);

  if (resultStr === expectedStr) {
    console.log(`✅ ${test.name}: PASSED`);
  } else {
    console.error(`❌ ${test.name}: FAILED`);
    console.error(`   Input:    ${JSON.stringify(test.input)}`);
    console.error(`   Expected: ${expectedStr}`);
    console.error(`   Actual:   ${resultStr}`);
    failed = true;
  }
}

if (failed) {
  console.error('\nTests failed!');
  process.exit(1);
} else {
  console.log('\nAll tests passed!');
}
