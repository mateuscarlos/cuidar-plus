## 2026-02-01 - Committed Environment Secrets
**Vulnerability:** The `.env` file containing environment variables (potentially secrets) was tracked in the git repository.
**Learning:** Initial project setup or template generation failed to include `.env` in `.gitignore`, leading to accidental tracking of local configuration.
**Prevention:** Always verify `.gitignore` includes sensitive file patterns (`.env`, `*.pem`, etc.) before the first commit. Use pre-commit hooks to scan for secrets.

## 2026-02-06 - Incorrect Return Type Handling in Validation
**Vulnerability:** `UserValidator.validatePassword` treated `isStrongPassword` result as a boolean, but it returned an object. This caused `!isStrongPassword(password)` to always evaluate to `false`, effectively bypassing password strength checks.
**Learning:** TypeScript truthiness of objects can mask logic errors when return types are not explicitly checked or when they change without updating consumers.
**Prevention:** Explicitly type check results or use boolean properties (e.g., `result.isValid`) rather than relying on truthiness of complex objects.
