## 2026-02-01 - Committed Environment Secrets
**Vulnerability:** The `.env` file containing environment variables (potentially secrets) was tracked in the git repository.
**Learning:** Initial project setup or template generation failed to include `.env` in `.gitignore`, leading to accidental tracking of local configuration.
**Prevention:** Always verify `.gitignore` includes sensitive file patterns (`.env`, `*.pem`, etc.) before the first commit. Use pre-commit hooks to scan for secrets.

## 2026-02-01 - The Truthiness Trap in Validation
**Vulnerability:** Password validation was bypassed because the check `!isStrongPassword(password)` evaluated to `false` even for weak passwords. The `isStrongPassword` function returned a non-null object `{ isValid: boolean, ... }`, which is always truthy in JavaScript/TypeScript.
**Learning:** Returning complex objects from validator functions without explicit boolean checks in the consumer can lead to silent security failures. The type system doesn't prevent `if (!object)` unless strict boolean checks are enforced.
**Prevention:** Always extract the boolean property (e.g., `.isValid`) when consuming validator functions that return objects. Consider using `eslint` rules like `@typescript-eslint/strict-boolean-expressions` to catch this.
