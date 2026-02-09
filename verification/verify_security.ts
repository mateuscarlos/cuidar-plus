import { sanitizeData } from '../src/core/lib/security';

console.log('🔒 Testing sanitizeData function...');

interface TestCase {
  name: string;
  input: unknown;
  check: (output: unknown) => boolean;
}

const testCases: TestCase[] = [
  {
    name: 'Simple object with sensitive key',
    input: { name: 'John', password: 'secret123' },
    check: (output: unknown) => {
      const o = output as { password: string; name: string };
      return o.password === '***HIDDEN***' && o.name === 'John';
    },
  },
  {
    name: 'Nested object',
    input: { user: { id: 1, accessToken: 'abc-def' } },
    check: (output: unknown) => {
      const o = output as { user: { accessToken: string; id: number } };
      return o.user.accessToken === '***HIDDEN***' && o.user.id === 1;
    },
  },
  {
    name: 'Array of objects',
    input: [{ token: '123' }, { apiKey: '456' }],
    check: (output: unknown) => {
      const o = output as [{ token: string }, { apiKey: string }];
      return o[0].token === '***HIDDEN***' && o[1].apiKey === '***HIDDEN***';
    },
  },
  {
    name: 'Safe object',
    input: { public: 'data', visible: true },
    check: (output: unknown) => {
      const o = output as { public: string; visible: boolean };
      return o.public === 'data' && o.visible === true;
    },
  },
  {
    name: 'False positives (passenger, keyboard)',
    input: { passenger: 'John', keyboard: 'US', bypass: true },
    check: (output: unknown) => {
      const o = output as { passenger: string; keyboard: string; bypass: boolean };
      // These should NOT be hidden now
      return o.passenger === 'John' && o.keyboard === 'US' && o.bypass === true;
    },
  },
  {
    name: 'Null value',
    input: null,
    check: (output: unknown) => output === null,
  }
];

let passed = 0;
let failed = 0;

testCases.forEach((test, index) => {
  try {
    console.log(`Running Test ${index + 1}: ${test.name}`);
    const output = sanitizeData(test.input);
    if (test.check(output)) {
      console.log(`✅ Test ${index + 1}: PASSED`);
      passed++;
    } else {
      console.error(`❌ Test ${index + 1}: FAILED`);
      console.error('Output:', JSON.stringify(output, null, 2));
      failed++;
    }
  } catch (error) {
    console.error(`❌ Test ${index + 1}: ERROR`, error);
    failed++;
  }
});

console.log(`\nResults: ${passed} passed, ${failed} failed`);

if (failed > 0) {
  process.exit(1);
}
