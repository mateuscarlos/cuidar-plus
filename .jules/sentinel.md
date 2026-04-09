## 2026-02-01 - Committed Environment Secrets
**Vulnerability:** The `.env` file containing environment variables (potentially secrets) was tracked in the git repository.
**Learning:** Initial project setup or template generation failed to include `.env` in `.gitignore`, leading to accidental tracking of local configuration.
**Prevention:** Always verify `.gitignore` includes sensitive file patterns (`.env`, `*.pem`, etc.) before the first commit. Use pre-commit hooks to scan for secrets.

## 2026-02-01 - XSS via unescaped variables in dangerouslySetInnerHTML
**Vulnerability:** The application was using `dangerouslySetInnerHTML` in `ChartStyle` (`src/shared/ui/chart.tsx`) with unsanitized `id`, `key`, and `color` configuration values.
**Learning:** This exposes the application to XSS and arbitrary CSS injection if an attacker can control the chart configuration properties. CSS parsing can be broken by injecting specific control characters like `<`, `>`, and `;`.
**Prevention:** Avoid injecting dynamic CSS configurations by using inline styles directly on elements or proper CSS-in-JS libraries. If `dangerouslySetInnerHTML` must be used for dynamic stylesheets, always rigorously sanitize input by stripping characters needed to break out of the context (e.g. `[<>;}\[\]"']`).