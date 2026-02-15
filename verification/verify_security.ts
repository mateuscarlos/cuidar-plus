
import { sanitizeData } from '../src/core/lib/security';

function testSanitizeData() {
  console.log('Running SanitizeData Verification...');

  const testCases = [
    {
      name: 'Simple object with password',
      input: { username: 'user', password: 'secretpassword' },
      expected: { username: 'user', password: '***REDACTED***' }
    },
    {
      name: 'Nested object with token',
      input: { auth: { accessToken: 'xyz123', type: 'Bearer' } },
      expected: { auth: { accessToken: '***REDACTED***', type: 'Bearer' } }
    },
    {
      name: 'Array of objects',
      input: [{ id: 1, secret: 'hidden' }, { id: 2, public: 'visible' }],
      expected: [{ id: 1, secret: '***REDACTED***' }, { id: 2, public: 'visible' }]
    },
    {
      name: 'Case insensitive match',
      input: { PasswordConfirm: 'match', creDitCard: '1234' },
      expected: { PasswordConfirm: '***REDACTED***', creDitCard: '***REDACTED***' }
    },
    {
      name: 'Non-sensitive data',
      input: { name: 'John', age: 30 },
      expected: { name: 'John', age: 30 }
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of testCases) {
    const result = sanitizeData(test.input);
    const resultStr = JSON.stringify(result);
    const expectedStr = JSON.stringify(test.expected);

    if (resultStr === expectedStr) {
      console.log(`✅ Passed: ${test.name}`);
      passed++;
    } else {
      console.error(`❌ Failed: ${test.name}`);
      console.error(`   Expected: ${expectedStr}`);
      console.error(`   Actual:   ${resultStr}`);
      failed++;
    }
  }

  console.log(`\nResults: ${passed} passed, ${failed} failed.`);

  if (failed > 0) {
    process.exit(1);
  }
}

testSanitizeData();
