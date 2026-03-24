## 2026-02-01 - Committed Environment Secrets
**Vulnerability:** The `.env` file containing environment variables (potentially secrets) was tracked in the git repository.
**Learning:** Initial project setup or template generation failed to include `.env` in `.gitignore`, leading to accidental tracking of local configuration.
**Prevention:** Always verify `.gitignore` includes sensitive file patterns (`.env`, `*.pem`, etc.) before the first commit. Use pre-commit hooks to scan for secrets.

## 2026-02-01 - XSS in ChartStyle via CSS Variables
**Vulnerability:** XSS vulnerability in `ChartStyle` component when injecting `id`, `key`, and `color` props into a `<style>` block using `dangerouslySetInnerHTML`.
**Learning:** React's built-in protections don't apply when using `dangerouslySetInnerHTML`. Any unsanitized props passed into CSS inside this block, especially CSS variables and selectors, can be exploited to break out of the style tag and inject arbitrary scripts or styles.
**Prevention:** Always sanitize any dynamic variables (id, keys, colors) injected into `<style>` via `dangerouslySetInnerHTML` by stripping structural CSS/HTML characters (e.g., `<>;}[]"'`) using a helper function, or avoid using `dangerouslySetInnerHTML` for styles whenever possible.
