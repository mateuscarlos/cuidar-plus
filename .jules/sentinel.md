## 2026-01-31 - [Vulnerability] Exposed Sensitive Data in Development Logs
**Vulnerability:** The application was configured to log full API request and response objects, including sensitive fields like `password`, `token`, and `Authorization` headers, to the console when in development mode (`ENABLE_DEBUG` is true).
**Learning:** Developers often enable verbose logging for debugging but forget to exclude sensitive fields. In a frontend environment, these logs can persist or be visible during screen sharing/demos.
**Prevention:** Always implement a sanitization layer for loggers that automatically masks known sensitive keys (password, token, key, secret) before outputting to the console or external logging services.
