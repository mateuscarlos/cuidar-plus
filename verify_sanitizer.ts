
import { sanitizeData } from './src/core/lib/security';

function runTests() {
  console.log('Running sanitizer tests...');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, message: string) {
    if (condition) {
      console.log(`✅ ${message}`);
      passed++;
    } else {
      console.error(`❌ ${message}`);
      failed++;
    }
  }

  // Test 1: Simple object
  const simple = { username: 'user', password: '123' };
  const sanitizedSimple = sanitizeData(simple);
  assert(sanitizedSimple.username === 'user', 'Preserves username');
  assert(sanitizedSimple.password === '***SENSITIVE***', 'Masks password');

  // Test 2: Nested object
  const nested = {
    user: {
      name: 'Alice',
      api_token: 'abc'
    }
  };
  const sanitizedNested = sanitizeData(nested);
  assert(sanitizedNested.user.name === 'Alice', 'Preserves nested name');
  assert(sanitizedNested.user.api_token === '***SENSITIVE***', 'Masks nested token');

  // Test 3: Array
  const array = [
    { id: 1, secret: 'shh' },
    { id: 2, public: 'yes' }
  ];
  const sanitizedArray = sanitizeData(array);
  assert(sanitizedArray[0].secret === '***SENSITIVE***', 'Masks secret in array');
  assert(sanitizedArray[1].public === 'yes', 'Preserves public in array');

  // Test 4: Case insensitivity
  const mixedCase = { PasSwoRd: '123', UserToken: 'abc' };
  const sanitizedMixed = sanitizeData(mixedCase);
  assert(sanitizedMixed.PasSwoRd === '***SENSITIVE***', 'Masks PasSwoRd');
  assert(sanitizedMixed.UserToken === '***SENSITIVE***', 'Masks UserToken');

  // Test 5: Safe substring
  // "token" matches "user_token" (contains).
  // But what about "tokenizer"? My logic is `includes`.
  // SENSITIVE_KEYS = ['token'] => "tokenizer" includes "token".
  // This might be false positive. Let's check behavior.
  const edgeCase = { tokenizer: 'parser' };
  const sanitizedEdge = sanitizeData(edgeCase);
  // This assertion documents behavior. If it masks, I might want to refine strictness later,
  // but for now "fail safe" is better.
  // Actually, 'token' is in the list. So 'tokenizer' will be masked.
  // Is this desired? Maybe not. But better safe than sorry for now.
  // I will check if it masks it.
  assert(sanitizedEdge.tokenizer === '***SENSITIVE***', 'Masks tokenizer (fail-safe)');

  // Test 6: Null/Undefined
  assert(sanitizeData(null) === null, 'Handles null');
  assert(sanitizeData(undefined) === undefined, 'Handles undefined');

  console.log(`\nTests finished. Passed: ${passed}, Failed: ${failed}`);
  if (failed > 0) process.exit(1);
}

runTests();
