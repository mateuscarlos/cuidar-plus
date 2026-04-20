## 2026-02-01 - Committed Environment Secrets
**Vulnerability:** The `.env` file containing environment variables (potentially secrets) was tracked in the git repository.
**Learning:** Initial project setup or template generation failed to include `.env` in `.gitignore`, leading to accidental tracking of local configuration.
**Prevention:** Always verify `.gitignore` includes sensitive file patterns (`.env`, `*.pem`, etc.) before the first commit. Use pre-commit hooks to scan for secrets.

## 2026-02-05 - Sensitive Data in Logs
**Vulnerability:** API interceptors were logging full request/response objects including passwords and tokens when `ENABLE_DEBUG` was active.
**Learning:** Debug logging, even if intended for development, can leak sensitive data if not properly sanitized or if the "development" flag is enabled in production builds.
**Prevention:** Implement a global data sanitizer for all logging mechanisms. treat logs as public output and never dump raw data without filtering known sensitive keys.
