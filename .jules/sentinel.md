## 2026-02-01 - Committed Environment Secrets
**Vulnerability:** The `.env` file containing environment variables (potentially secrets) was tracked in the git repository.
**Learning:** Initial project setup or template generation failed to include `.env` in `.gitignore`, leading to accidental tracking of local configuration.
**Prevention:** Always verify `.gitignore` includes sensitive file patterns (`.env`, `*.pem`, etc.) before the first commit. Use pre-commit hooks to scan for secrets.

## 2026-02-02 - Broken Password Validation Logic
**Vulnerability:** The `UserValidator.validatePassword` method incorrectly treated the object returned by `isStrongPassword` as a boolean, causing the check `!isStrongPassword(password)` to always evaluate to `false` and accept weak passwords.
**Learning:** Inconsistent validator signatures (some returning booleans, others objects) lead to dangerous assumptions.
**Prevention:** Standardize validator return types or strictly type-check usage. Ensure unit tests cover "fail" cases, not just "pass" cases.
