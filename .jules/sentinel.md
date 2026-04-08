## 2026-02-01 - Committed Environment Secrets
**Vulnerability:** The `.env` file containing environment variables (potentially secrets) was tracked in the git repository.
**Learning:** Initial project setup or template generation failed to include `.env` in `.gitignore`, leading to accidental tracking of local configuration.
**Prevention:** Always verify `.gitignore` includes sensitive file patterns (`.env`, `*.pem`, etc.) before the first commit. Use pre-commit hooks to scan for secrets.

## 2025-05-24 - Sensitive Data Leaked in Debug Logs
**Vulnerability:** Debug logs in API interceptors included the full request/response payload, exposing sensitive data (passwords, tokens) when ENABLE_DEBUG was true.
**Learning:** Even conditional debug logging can be dangerous if it doesn't sanitize data. Developers often rely on full payloads for debugging, which inadvertently captures sensitive fields.
**Prevention:** Implement a sanitizeData utility that recursively masks known sensitive keys and enforce its usage in all logging mechanisms, especially in core infrastructure like API clients.
