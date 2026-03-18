## 2026-02-01 - Committed Environment Secrets
**Vulnerability:** The `.env` file containing environment variables (potentially secrets) was tracked in the git repository.
**Learning:** Initial project setup or template generation failed to include `.env` in `.gitignore`, leading to accidental tracking of local configuration.
**Prevention:** Always verify `.gitignore` includes sensitive file patterns (`.env`, `*.pem`, etc.) before the first commit. Use pre-commit hooks to scan for secrets.
## 2024-03-24 - XSS via DangerouslySetInnerHTML in Styled Components
**Vulnerability:** The `ChartStyle` component in `src/shared/ui/chart.tsx` injected props (`id`, `key`, `color`) directly into a `<style>` block using React's `dangerouslySetInnerHTML` without sanitization. An attacker controlling these props could inject arbitrary HTML, close the style block prematurely, and execute a Cross-Site Scripting (XSS) attack.
**Learning:** Using `dangerouslySetInnerHTML` even for seemingly constrained CSS variables requires strict encoding or sanitization, as standard React escaping mechanisms are bypassed.
**Prevention:** Avoid `dangerouslySetInnerHTML` when possible. When necessary for dynamic inline styles across complex selectors, always sanitize interpolated values. A custom sanitizer that strips HTML structural and structural characters (`<`, `>`, `}`, `[`, `]`, `"`, `'`, `;`) is effective for CSS properties and IDs.
