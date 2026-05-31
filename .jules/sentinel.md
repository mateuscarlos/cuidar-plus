## 2026-02-01 - Committed Environment Secrets
**Vulnerability:** The `.env` file containing environment variables (potentially secrets) was tracked in the git repository.
**Learning:** Initial project setup or template generation failed to include `.env` in `.gitignore`, leading to accidental tracking of local configuration.
**Prevention:** Always verify `.gitignore` includes sensitive file patterns (`.env`, `*.pem`, etc.) before the first commit. Use pre-commit hooks to scan for secrets.

## 2026-03-05 - Centralized Data Sanitization
**Vulnerability:** API request/response interceptors were logging full payloads, including passwords and tokens, in debug mode.
**Learning:** Debug logging often bypasses security checks if not explicitly designed with sanitization in mind. A centralized helper (`sanitizeData`) ensures consistent masking across all log sources.
**Prevention:** Implement a recursive sanitization utility at the start of the project and enforce its use in all logging layers (interceptors, middleware, error handlers).
