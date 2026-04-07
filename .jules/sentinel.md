## 2026-02-01 - Committed Environment Secrets
**Vulnerability:** The `.env` file containing environment variables (potentially secrets) was tracked in the git repository.
**Learning:** Initial project setup or template generation failed to include `.env` in `.gitignore`, leading to accidental tracking of local configuration.
**Prevention:** Always verify `.gitignore` includes sensitive file patterns (`.env`, `*.pem`, etc.) before the first commit. Use pre-commit hooks to scan for secrets.

## 2026-02-01 - XSS/CSS Injection in Chart Component
**Vulnerability:** The `ChartStyle` component (src/shared/ui/chart.tsx) injected dynamic properties (`id`, `key`, `color`) directly into a `<style>` tag using `dangerouslySetInnerHTML` without sanitization. If any of these properties come from user input or an API, it allows for XSS or CSS injection.
**Learning:** Shadcn UI's `Chart` component uses `dangerouslySetInnerHTML` for dynamic styling, which can be a hidden XSS vector if chart configurations are derived from untrusted sources.
**Prevention:** Always sanitize dynamic strings injected into `<style>` tags using a strict allowlist (e.g., `val.replace(/[^a-zA-Z0-9#(),.\s%/-]/g, "")`) to prevent attackers from breaking out of CSS rules and executing arbitrary scripts.
