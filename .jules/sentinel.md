## 2026-02-01 - Committed Environment Secrets
**Vulnerability:** The `.env` file containing environment variables (potentially secrets) was tracked in the git repository.
**Learning:** Initial project setup or template generation failed to include `.env` in `.gitignore`, leading to accidental tracking of local configuration.
**Prevention:** Always verify `.gitignore` includes sensitive file patterns (`.env`, `*.pem`, etc.) before the first commit. Use pre-commit hooks to scan for secrets.

## 2026-03-05 - Sensitive Data Exposure in Debug Logs
**Vulnerability:** The API request and response interceptors were logging full `config.data` and `response.data` to the console when `ENABLE_DEBUG` was true. This could expose passwords, tokens, and PII.
**Learning:** Debugging tools often inadvertently bypass security controls. Developers might enable debug mode in production or share console logs that contain sensitive data.
**Prevention:** Implemented a `sanitizeData` utility that recursively masks sensitive keys (e.g., password, token) before logging. All logging mechanisms must pass data through sanitization filters.
