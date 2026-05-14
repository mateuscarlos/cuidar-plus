## 2026-02-01 - Committed Environment Secrets
**Vulnerability:** The `.env` file containing environment variables (potentially secrets) was tracked in the git repository.
**Learning:** Initial project setup or template generation failed to include `.env` in `.gitignore`, leading to accidental tracking of local configuration.
**Prevention:** Always verify `.gitignore` includes sensitive file patterns (`.env`, `*.pem`, etc.) before the first commit. Use pre-commit hooks to scan for secrets.

## 2026-02-09 - Sensitive Data in API Logs
**Vulnerability:** API request and response interceptors were logging full payloads (including passwords and tokens) to the console in debug mode.
**Learning:** Even "debug only" logs can leak sensitive data if not properly sanitized, especially in browser consoles or when logs are persisted/shared. Generic masking (like masking any key with 'pass') causes too many false positives; specific blocklists are safer.
**Prevention:** Implement a centralized data sanitization utility that masks specific sensitive fields (password, token, etc.) before logging any data structure.
