## 2026-02-01 - Committed Environment Secrets
**Vulnerability:** The `.env` file containing environment variables (potentially secrets) was tracked in the git repository.
**Learning:** Initial project setup or template generation failed to include `.env` in `.gitignore`, leading to accidental tracking of local configuration.
**Prevention:** Always verify `.gitignore` includes sensitive file patterns (`.env`, `*.pem`, etc.) before the first commit. Use pre-commit hooks to scan for secrets.

## 2026-02-01 - Sensitive Data Exposure in Debug Logs
**Vulnerability:** The API client configuration (`api.config.ts`) was logging full request/response bodies to the console in development mode, exposing sensitive user data (passwords, tokens) in plain text.
**Learning:** Default debug configurations often prioritize visibility over security. The `ENV.ENABLE_DEBUG` flag enabled verbose logging without sanitization, creating a risk of accidental data leakage during debugging sessions or screen sharing.
**Prevention:** Implement a centralized `sanitizeData` utility that recursively masks known sensitive keys (e.g., 'password', 'token') before any logging operation. Ensure this utility is applied to all logger instances.
