## 2026-02-01 - Committed Environment Secrets
**Vulnerability:** The `.env` file containing environment variables (potentially secrets) was tracked in the git repository.
**Learning:** Initial project setup or template generation failed to include `.env` in `.gitignore`, leading to accidental tracking of local configuration.
**Prevention:** Always verify `.gitignore` includes sensitive file patterns (`.env`, `*.pem`, etc.) before the first commit. Use pre-commit hooks to scan for secrets.

## 2025-02-27 - Unsanitized API Logs Exposing Credentials
**Vulnerability:** Axios interceptors logged full request/response bodies, potentially exposing passwords, auth tokens, and PII to the browser console and log aggregators.
**Learning:** Default API client setups often favor debugging over security. A global object sanitization function must correctly handle recursive data structures and edge cases (like Dates and Blobs).
**Prevention:** Always implement an interceptor-level data sanitizer (`sanitizeData`) to explicitly mask fields matching sensitive patterns before passing them to console.log or tracking services.
