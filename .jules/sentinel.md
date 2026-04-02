## 2026-02-01 - Committed Environment Secrets
**Vulnerability:** The `.env` file containing environment variables (potentially secrets) was tracked in the git repository.
**Learning:** Initial project setup or template generation failed to include `.env` in `.gitignore`, leading to accidental tracking of local configuration.
**Prevention:** Always verify `.gitignore` includes sensitive file patterns (`.env`, `*.pem`, etc.) before the first commit. Use pre-commit hooks to scan for secrets.

## 2025-02-23 - CSS Injection via dangerouslySetInnerHTML
**Vulnerability:** The Shadcn UI `ChartStyle` component used `dangerouslySetInnerHTML` to inject dynamic CSS variables without sanitizing inputs like `id`, `key`, and `color`.
**Learning:** Even internal UI components passing seemingly safe data to style blocks can be exploited if an attacker can control those prop values (e.g., via user-defined chart themes), leading to CSS injection or XSS.
**Prevention:** Always sanitize dynamic properties injected into `<style>` tags via `dangerouslySetInnerHTML`. Use a strict allowlist regex like `/[^a-zA-Z0-9-_.#()%, ]/g` to permit only valid CSS values while stripping structural HTML/CSS characters.
