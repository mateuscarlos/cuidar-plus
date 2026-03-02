## 2026-02-01 - Committed Environment Secrets
**Vulnerability:** The `.env` file containing environment variables (potentially secrets) was tracked in the git repository.
**Learning:** Initial project setup or template generation failed to include `.env` in `.gitignore`, leading to accidental tracking of local configuration.
**Prevention:** Always verify `.gitignore` includes sensitive file patterns (`.env`, `*.pem`, etc.) before the first commit. Use pre-commit hooks to scan for secrets.

## 2024-05-19 - XSS Vulnerability in CSS Injection
**Vulnerability:** The `ChartStyle` component in `src/shared/ui/chart.tsx` used `dangerouslySetInnerHTML` to inject CSS dynamically based on props. The component directly interpolated values like `id`, `color`, and `key` into the CSS string without escaping or sanitization. This allowed Cross-Site Scripting (XSS) via CSS injection. For example, passing an input containing `red; </style><script>alert(1)</script>` to a color field could terminate the `<style>` block and start executing malicious JavaScript.
**Learning:** Even when interpolating values into a `<style>` block, values must be strictly validated or sanitized to prevent attackers from breaking out of the style context and injecting executable scripts. CSS contexts are dangerous.
**Prevention:** Always validate or sanitize values injected into `<style>` via `dangerouslySetInnerHTML`. A helper function was created to strip dangerous characters like `<`, `>`, `;`, `}`, `[`, `]`, `"`, and `'`.
