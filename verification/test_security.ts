import { sanitizeData, SENSITIVE_KEYS } from '../src/core/lib/security';
import assert from 'assert';

console.log('🔒 Testing Security Utilities...');

// Test 1: Sanitize object with sensitive keys
const test1Input = {
  username: 'user1',
  password: 'secretPassword123',
  token: 'abc-123-token',
  profile: {
    email: 'user@example.com',
    creditCard: '1234-5678-9012-3456',
  },
};

const test1Expected = {
  username: 'user1',
  password: "***",
  token: "***",
  profile: {
    email: 'user@example.com',
    creditCard: "***",
  },
};

const test1Result = sanitizeData(test1Input);
try {
  assert.deepStrictEqual(test1Result, test1Expected);
  console.log('✅ Test 1 Passed: Basic object sanitization');
} catch (e) {
  console.error('❌ Test 1 Failed:', e);
  process.exit(1);
}

// Test 2: Sanitize array of objects
const test2Input = [
  { id: 1, secret: 'hidden' },
  { id: 2, note: 'public' },
];

const test2Expected = [
  { id: 1, secret: "***" },
  { id: 2, note: 'public' },
];

const test2Result = sanitizeData(test2Input);
try {
  assert.deepStrictEqual(test2Result, test2Expected);
  console.log('✅ Test 2 Passed: Array sanitization');
} catch (e) {
  console.error('❌ Test 2 Failed:', e);
  process.exit(1);
}

// Test 3: Sanitize nested objects and mixed types
const test3Input = {
  data: {
    apiKey: 'key-123',
    items: [
      { name: 'item1', authorization: 'bearer token' },
      'string-item',
    ],
  },
};

const test3Expected = {
  data: {
    apiKey: "***",
    items: [
      { name: 'item1', authorization: "***" },
      'string-item',
    ],
  },
};

const test3Result = sanitizeData(test3Input);
try {
  assert.deepStrictEqual(test3Result, test3Expected);
  console.log('✅ Test 3 Passed: Nested/Mixed sanitization');
} catch (e) {
  console.error('❌ Test 3 Failed:', e);
  process.exit(1);
}

// Test 4: Verify original object is not mutated
const test4Input = { password: 'original' };
sanitizeData(test4Input);
try {
  assert.strictEqual(test4Input.password, 'original');
  console.log('✅ Test 4 Passed: Immutability check');
} catch (e) {
  console.error('❌ Test 4 Failed:', e);
  process.exit(1);
}

// Test 5: Check all SENSITIVE_KEYS
console.log('🔎 Checking all SENSITIVE_KEYS coverage...');
SENSITIVE_KEYS.forEach(key => {
    const input = { [key]: 'value', [`my${key}Field`]: 'value', [`${key}Confirm`]: 'value' };
    const result = sanitizeData(input) as Record<string, string>;

    // Check exact match
    if (result[key] !== '***') {
        console.error(`❌ Failed to mask exact key: ${key}`);
        process.exit(1);
    }
    // Check partial match (suffix/prefix/compound) if implemented that way
    // My implementation uses .includes(), so `myPasswordField` should be masked if 'password' is in list.
    if (result[`my${key}Field`] !== '***') {
         console.error(`❌ Failed to mask partial key: my${key}Field`);
         process.exit(1);
    }
});
console.log('✅ Test 5 Passed: All sensitive keys covered');

console.log('🎉 All security tests passed!');
