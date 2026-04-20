## 2026-02-01 - Committed Environment Secrets
**Vulnerability:** The `.env` file containing environment variables (potentially secrets) was tracked in the git repository.
**Learning:** Initial project setup or template generation failed to include `.env` in `.gitignore`, leading to accidental tracking of local configuration.
**Prevention:** Always verify `.gitignore` includes sensitive file patterns (`.env`, `*.pem`, etc.) before the first commit. Use pre-commit hooks to scan for secrets.

## 2026-02-04 - Exposed Sensitive Data in API Logs
**Vulnerability:** Full API request and response objects, including authentication tokens and passwords, were being logged to the console when `ENV.ENABLE_DEBUG` was true.
**Learning:** Generic debug logging interceptors often overlook the sensitivity of the data they process.
**Prevention:** Always wrap data logging with a sanitization function that masks known sensitive keys (e.g., password, token) before outputting to any log.
