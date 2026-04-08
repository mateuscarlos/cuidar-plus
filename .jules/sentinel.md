## 2026-02-01 - Committed Environment Secrets
**Vulnerability:** The `.env` file containing environment variables (potentially secrets) was tracked in the git repository.
**Learning:** Initial project setup or template generation failed to include `.env` in `.gitignore`, leading to accidental tracking of local configuration.
**Prevention:** Always verify `.gitignore` includes sensitive file patterns (`.env`, `*.pem`, etc.) before the first commit. Use pre-commit hooks to scan for secrets.

## 2026-02-02 - Sensitive Data Exposure in Development Logs
**Vulnerability:** Raw request and response payloads, including passwords and tokens, were logged to the console in development mode.
**Learning:** Debugging tools often prioritize visibility over security, leading to accidental exposure of credentials during screen sharing or shared sessions.
**Prevention:** Implement a centralized data sanitization utility that automatically masks sensitive keys (e.g., `password`, `token`) in all logging outputs.
