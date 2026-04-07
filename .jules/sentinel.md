## 2026-02-01 - Committed Environment Secrets
**Vulnerability:** The `.env` file containing environment variables (potentially secrets) was tracked in the git repository.
**Learning:** Initial project setup or template generation failed to include `.env` in `.gitignore`, leading to accidental tracking of local configuration.
**Prevention:** Always verify `.gitignore` includes sensitive file patterns (`.env`, `*.pem`, etc.) before the first commit. Use pre-commit hooks to scan for secrets.
## 2024-05-23 - [CRITICAL] Fix CSS Injection in ChartStyle
**Vulnerability:** The `ChartStyle` component used `dangerouslySetInnerHTML` to inject CSS dynamically, without sanitizing variables like `id` and `color`. This allows CSS injection attacks and potential XSS if a user has control over these properties.
**Learning:** React elements can be vulnerable to XSS and CSS injection when passing unsanitized props into `<style>` tags using `dangerouslySetInnerHTML`.
**Prevention:** Always sanitize dynamic inputs by stripping dangerous structural characters (e.g., `<>`, `[]`, `{}`, `;`, `"`, `'`) before injecting them into a DOM structure via `dangerouslySetInnerHTML`.
