import { sanitizeData } from '../src/core/lib/security';

function runTests() {
  console.log('🔒 Starting Security Verification Tests...\n');

  const testCases = [
    {
      name: 'Simple object with sensitive key',
      input: { id: 1, password: 'my-secret-password', email: 'test@example.com' },
      expected: { id: 1, password: '***', email: 'test@example.com' },
    },
    {
      name: 'Nested object with sensitive key',
      input: { user: { id: 1, authToken: 'abc-123', name: 'User' } },
      expected: { user: { authToken: '***', id: 1, name: 'User' } },
    },
    {
      name: 'Array of objects with sensitive keys',
      input: [{ id: 1, secret: 'secret1' }, { id: 2, secret: 'secret2' }],
      expected: [{ id: 1, secret: '***' }, { id: 2, secret: '***' }],
    },
    {
      name: 'Deeply nested object',
      input: { a: { b: { c: { token: 'sensitive' } } } },
      expected: { a: { b: { c: { token: '***' } } } },
    },
    {
      name: 'Case insensitive match',
      input: { UserPassword: '123' },
      expected: { UserPassword: '***' },
    },
     {
      name: 'Partial match (contains sensitive key)',
      input: { api_token_v2: 'xyz' },
      expected: { api_token_v2: '***' },
    },
    {
      name: 'Non-sensitive object',
      input: { name: 'Public', status: 'active' },
      expected: { name: 'Public', status: 'active' },
    },
    {
      name: 'Null value',
      input: null,
      expected: null,
    },
    {
      name: 'Undefined value',
      input: undefined,
      expected: undefined,
    },
  ];

  let passed = 0;
  let failed = 0;

  testCases.forEach((test, index) => {
    try {
      const result = sanitizeData(test.input);

      // Normalize JSON string for comparison (handling key order if implementation changes)
      // Though my implementation preserves insertion order roughly, recursion rebuilds it.
      // JSON.stringify order is not guaranteed for objects generally but in V8 it is insertion order for non-integer keys.

      // Let's use a simple deep equal check if needed, but stringify is usually fine for simple tests.
      const resultJson = JSON.stringify(result);
      // We need to sort keys to be robust, but for this simple script, expected output keys are manually ordered to match input order which sanitizeData preserves.

      // Wait, input { user: { id: 1, authToken: ... } } -> expected { user: { authToken: '***', id: 1 ... } }
      // My manual expectation above had different key order in 'Nested object'.
      // Correct expectation should preserve order: { user: { id: 1, authToken: '***', name: 'User' } }

      // Let's fix the test case expectation in code if it fails.

      // Actually, my `sanitizeData` iterates `Object.entries(data)`, which returns keys in order.
      // So order should be preserved.

      // However, let's just compare object structures if possible, but stringify is easiest.

      // Let's relax the comparison slightly or be precise.
      // I'll assume order is preserved.

      // Re-checking the "Nested object" expectation in my mental model:
      // input: { user: { id: 1, authToken: 'abc-123', name: 'User' } }
      // sanitizeData iterates user. user is object. iterates id, authToken, name.
      // reconstructs: { id: 1, authToken: '***', name: 'User' }
      // So expected should matches input order.

      const expectedJson = JSON.stringify(test.expected);

      // Helper to sort keys for robust comparison
      const sortKeys = (obj: unknown): unknown => {
        if (obj === null || typeof obj !== 'object') return obj;
        if (Array.isArray(obj)) return obj.map(sortKeys);
        return Object.keys(obj as Record<string, unknown>).sort().reduce((acc: Record<string, unknown>, key) => {
          acc[key] = sortKeys((obj as Record<string, unknown>)[key]);
          return acc;
        }, {});
      };

      const resultSorted = JSON.stringify(sortKeys(result));
      const expectedSorted = JSON.stringify(sortKeys(test.expected));

      if (resultSorted === expectedSorted) {
        console.log(`✅ Test ${index + 1}: "${test.name}" PASSED`);
        passed++;
      } else {
        console.error(`❌ Test ${index + 1}: "${test.name}" FAILED`);
        console.error(`   Expected: ${expectedSorted}`);
        console.error(`   Received: ${resultSorted}`);
        failed++;
      }
    } catch (error) {
       console.error(`❌ Test ${index + 1}: "${test.name}" CRASHED`, error);
       failed++;
    }
  });

  console.log(`\nTests Completed: ${passed} Passed, ${failed} Failed`);

  if (failed > 0) {
    process.exit(1);
  } else {
    console.log('🎉 All security tests passed!');
  }
}

runTests();
