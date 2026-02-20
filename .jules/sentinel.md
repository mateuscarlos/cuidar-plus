## 2026-02-01 - Committed Environment Secrets
**Vulnerability:** The `.env` file containing environment variables (potentially secrets) was tracked in the git repository.
**Learning:** Initial project setup or template generation failed to include `.env` in `.gitignore`, leading to accidental tracking of local configuration.
**Prevention:** Always verify `.gitignore` includes sensitive file patterns (`.env`, `*.pem`, etc.) before the first commit. Use pre-commit hooks to scan for secrets.

## 2025-05-27 - Centralized API Log Sanitization
**Vulnerability:** Sensitive data (passwords, tokens) exposed in console logs via Axios interceptors in development mode.
**Learning:** Developers often enable debug logging which inadvertently captures sensitive request/response payloads. A centralized sanitization utility is necessary.
**Prevention:** Use `sanitizeData` helper in `src/core/lib/security.ts` to wrap any data object before logging.
