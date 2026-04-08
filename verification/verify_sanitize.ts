import { sanitizeData } from '../src/core/lib/security';

const testCases = [
  {
    name: 'Simple object with sensitive key',
    input: { password: 'secret', name: 'John' },
    expected: { password: '***', name: 'John' },
  },
  {
    name: 'Nested object with sensitive key',
    input: { user: { password: 'secret', email: 'john@example.com' } },
    expected: { user: { password: '***', email: 'john@example.com' } },
  },
  {
    name: 'Array of objects with sensitive keys',
    input: [{ token: 'abc-123' }, { token: 'xyz-789' }],
    expected: [{ token: '***' }, { token: '***' }],
  },
  {
    name: 'Object with partial match key',
    input: { userPassword: 'secret', confirmPassword: 'secret' },
    expected: { userPassword: '***', confirmPassword: '***' },
  },
  {
    name: 'Non-sensitive data',
    input: { id: 1, name: 'John' },
    expected: { id: 1, name: 'John' },
  },
  {
    name: 'Null value',
    input: null,
    expected: null,
  },
];

console.log('Running sanitizeData verification...\n');

let passed = 0;
let failed = 0;

testCases.forEach((test, index) => {
  const result = sanitizeData(test.input);
  const jsonResult = JSON.stringify(result);
  const jsonExpected = JSON.stringify(test.expected);

  if (jsonResult === jsonExpected) {
    console.log(`✅ Test ${index + 1}: ${test.name} passed`);
    passed++;
  } else {
    console.error(`❌ Test ${index + 1}: ${test.name} failed`);
    console.error(`   Expected: ${jsonExpected}`);
    console.error(`   Received: ${jsonResult}`);
    failed++;
  }
});

console.log(`\nResults: ${passed} passed, ${failed} failed`);

if (failed > 0) {
  process.exit(1);
}
