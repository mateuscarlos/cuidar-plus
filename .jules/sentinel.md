## 2026-02-01 - Committed Environment Secrets
**Vulnerability:** The `.env` file containing environment variables (potentially secrets) was tracked in the git repository.
**Learning:** Initial project setup or template generation failed to include `.env` in `.gitignore`, leading to accidental tracking of local configuration.
**Prevention:** Always verify `.gitignore` includes sensitive file patterns (`.env`, `*.pem`, etc.) before the first commit. Use pre-commit hooks to scan for secrets.

## 2026-02-21 - XSS in Chart Component
**Vulnerability:** The `ChartStyle` component in `src/shared/ui/chart.tsx` used `dangerouslySetInnerHTML` to inject CSS styles constructed from `id` and `config` props without sanitization. This allowed XSS (via `</style><script>`) and CSS injection (via `] {`).
**Learning:** UI libraries (like shadcn/ui) components might assume safe inputs but are often used with user-controlled data. `dangerouslySetInnerHTML` inside library code is a hidden risk.
**Prevention:** Always sanitize inputs interpolated into style blocks or `dangerouslySetInnerHTML`, even if the component seems internal. For CSS generation, strip characters that can break out of the context (`<`, `>`, `;`, `}`, `[`, `]`, quotes).
