## 2026-02-01 - Committed Environment Secrets
**Vulnerability:** The `.env` file containing environment variables (potentially secrets) was tracked in the git repository.
**Learning:** Initial project setup or template generation failed to include `.env` in `.gitignore`, leading to accidental tracking of local configuration.
**Prevention:** Always verify `.gitignore` includes sensitive file patterns (`.env`, `*.pem`, etc.) before the first commit. Use pre-commit hooks to scan for secrets.

## 2026-03-01 - Sensitive Data in Dev Logs
**Vulnerability:** API request and response data (including passwords and tokens) were logged to the console in development mode via `api.config.ts`.
**Learning:** Development logging can inadvertently expose sensitive data if not sanitized. Developers often assume "development" logs are safe, but they can be leaked or viewed during screen sharing.
**Prevention:** Implement a centralized `sanitizeData` utility and apply it to all logging interceptors, even in development environments. Mask sensitive keys like `password`, `token`, `secret`.
