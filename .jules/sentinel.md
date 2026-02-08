## 2026-02-01 - Committed Environment Secrets
**Vulnerability:** The `.env` file containing environment variables (potentially secrets) was tracked in the git repository.
**Learning:** Initial project setup or template generation failed to include `.env` in `.gitignore`, leading to accidental tracking of local configuration.
**Prevention:** Always verify `.gitignore` includes sensitive file patterns (`.env`, `*.pem`, etc.) before the first commit. Use pre-commit hooks to scan for secrets.

## 2026-02-12 - Sensitive Data Exposure in Logs
**Vulnerability:** Full request and response data, including sensitive fields like passwords and tokens, was being logged to the console in development mode (and potentially in production if debug flag was enabled).
**Learning:** Generic logging of API interactions for debugging purposes often overlooks the presence of PII or credentials within the payload.
**Prevention:** Implement a recursive data sanitization utility that masks known sensitive keys (e.g., password, token, cpf) before logging any object. Centralize this logic in the API client configuration.
