import { sanitizeData } from '../src/core/lib/security';

const testCases = [
  {
    name: 'Simple object with sensitive key',
    input: { name: 'John', password: 'secret123' },
    expected: { name: 'John', password: '***' },
  },
  {
    name: 'Nested object',
    input: { user: { name: 'Alice', token: 'abcdef' } },
    expected: { user: { name: 'Alice', token: '***' } },
  },
  {
    name: 'Array of objects',
    input: [{ id: 1, secret: '123' }, { id: 2, secret: '456' }],
    expected: [{ id: 1, secret: '***' }, { id: 2, secret: '***' }],
  },
  {
    name: 'Case insensitive',
    input: { apiKey: '123', API_KEY: '456', TOken: '789' },
    expected: { apiKey: '***', API_KEY: '***', TOken: '***' },
  },
  {
    name: 'Non-sensitive data',
    input: { public: 'info' },
    expected: { public: 'info' },
  },
];

console.log('🛡️ Verifying sanitizeData...\n');

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
    console.error(`   Got:      ${resultStr}`);
    failed++;
  }
}

console.log(`\nSummary: ${passed} passed, ${failed} failed.`);

if (failed > 0) {
  process.exit(1);
}
