/* eslint-disable @typescript-eslint/no-explicit-any */
import { sanitizeData } from '../src/core/lib/security';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ PASSED: ${message}`);
  }
}

function testSanitizeData() {
  console.log('Testing sanitizeData...');

  // Test 1: Simple object with password
  const test1 = {
    username: 'user1',
    password: 'secretPassword123',
    email: 'user1@example.com',
  };
  const result1 = sanitizeData(test1) as any;
  assert(result1.password === '***', 'Password should be masked');
  assert(result1.username === 'user1', 'Username should be preserved');
  assert(result1.email === 'user1@example.com', 'Email should be preserved');

  // Test 2: Nested object
  const test2 = {
    user: {
      name: 'John Doe',
      accessToken: 'token123',
      details: {
        apiKey: 'key456',
        publicInfo: 'public',
      },
    },
  };
  const result2 = sanitizeData(test2) as any;
  assert(result2.user.accessToken === '***', 'Nested accessToken should be masked');
  assert(result2.user.details.apiKey === '***', 'Deeply nested apiKey should be masked');
  assert(result2.user.name === 'John Doe', 'Nested name should be preserved');
  assert(result2.user.details.publicInfo === 'public', 'Deeply nested publicInfo should be preserved');

  // Test 3: Array of objects
  const test3 = [
    { id: 1, secret: 's1' },
    { id: 2, secret: 's2' },
  ];
  const result3 = sanitizeData(test3) as any[];
  assert(result3[0].secret === '***', 'Array item 1 secret should be masked');
  assert(result3[1].secret === '***', 'Array item 2 secret should be masked');
  assert(result3[0].id === 1, 'Array item 1 id should be preserved');

  // Test 4: Case insensitive keys
  const test4 = {
    UserPassword: 'pwd',
    API_KEY: 'key',
  };
  const result4 = sanitizeData(test4) as any;
  assert(result4.UserPassword === '***', 'UserPassword (mixed case) should be masked');
  assert(result4.API_KEY === '***', 'API_KEY (upper case) should be masked');

  // Test 5: Partial match
  const test5 = {
    confirmPassword: 'pwd',
    myTokenValue: 'tok',
  };
  const result5 = sanitizeData(test5) as any;
  assert(result5.confirmPassword === '***', 'confirmPassword (partial match) should be masked');
  assert(result5.myTokenValue === '***', 'myTokenValue (partial match) should be masked');

  // Test 6: Null and undefined
  assert(sanitizeData(null) === null, 'Null should be preserved');
  assert(sanitizeData(undefined) === undefined, 'Undefined should be preserved');

  // Test 7: Non-object
  assert(sanitizeData('string') === 'string', 'String should be preserved');
  assert(sanitizeData(123) === 123, 'Number should be preserved');

  console.log('All tests passed!');
}

testSanitizeData();
