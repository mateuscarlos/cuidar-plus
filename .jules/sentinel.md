## 2026-02-01 - Committed Environment Secrets
**Vulnerability:** The `.env` file containing environment variables (potentially secrets) was tracked in the git repository.
**Learning:** Initial project setup or template generation failed to include `.env` in `.gitignore`, leading to accidental tracking of local configuration.
**Prevention:** Always verify `.gitignore` includes sensitive file patterns (`.env`, `*.pem`, etc.) before the first commit. Use pre-commit hooks to scan for secrets.

## 2026-02-01 - Sensitive Data Logging (Passwords, Tokens)
**Vulnerability:** The Axios interceptors for API requests and responses were logging raw `config.data` and `response.data` in development mode (`ENABLE_DEBUG`). This meant sensitive information like passwords, access tokens, refresh tokens, and PII (CPF, RG) were being exposed in the console.
**Learning:** It is crucial to sanitize all incoming and outgoing data before logging it, even in development environments, to prevent accidental leakage of sensitive information to the console or log aggregators.
**Prevention:** Implement a recursive data sanitization utility that masks values of sensitive keys (e.g., `password`, `token`, `cpf`) with a string like `[REDACTED]`. Always wrap log outputs containing payloads with this utility function.
