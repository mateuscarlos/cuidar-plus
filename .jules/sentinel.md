## 2026-02-01 - Committed Environment Secrets
**Vulnerability:** The `.env` file containing environment variables (potentially secrets) was tracked in the git repository.
**Learning:** Initial project setup or template generation failed to include `.env` in `.gitignore`, leading to accidental tracking of local configuration.
**Prevention:** Always verify `.gitignore` includes sensitive file patterns (`.env`, `*.pem`, etc.) before the first commit. Use pre-commit hooks to scan for secrets.

## 2026-03-05 - ChartStyle CSS Injection (XSS)
**Vulnerability:** The ChartStyle component injected `color` values from user configuration directly into a `<style>` tag using `dangerouslySetInnerHTML` without sanitization. This could allow arbitrary CSS or HTML injection if a color value contained characters like `<` or `}`.
**Learning:** When using `dangerouslySetInnerHTML` to inject CSS styles constructed from component props (even ones seemingly harmless like colors), unsanitized input can be an attack vector to break out of the style tag. This is a common pattern in generic UI libraries that accept wide configurations.
**Prevention:** Use a dedicated sanitization function (e.g., `sanitizeForStyle`) to strip dangerous characters (like `<`, `>`, `;`, `}`, `[`, `]`, `"`, `'`) before interpolating values into raw style blocks.
