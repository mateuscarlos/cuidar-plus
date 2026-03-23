## 2026-02-01 - Committed Environment Secrets
**Vulnerability:** The `.env` file containing environment variables (potentially secrets) was tracked in the git repository.
**Learning:** Initial project setup or template generation failed to include `.env` in `.gitignore`, leading to accidental tracking of local configuration.
**Prevention:** Always verify `.gitignore` includes sensitive file patterns (`.env`, `*.pem`, etc.) before the first commit. Use pre-commit hooks to scan for secrets.
## 2026-03-23 - [XSS Vulnerability in Chart Component]
**Vulnerability:** The `ChartStyle` component in `src/shared/ui/chart.tsx` used `dangerouslySetInnerHTML` to inject dynamic theme CSS based on user-configurable `id`, `key`, and `color` properties without any sanitization.
**Learning:** This is a common pattern in shadcn/ui components where dynamic values are directly interpolated into `<style>` tags. Even if values typically come from developer configuration, if any part of the `ChartConfig` is derived from user input or database records, it creates a vector for Cross-Site Scripting (XSS) or CSS injection (e.g., by breaking out with `</style><script>`).
**Prevention:** Always wrap dynamically interpolated values inside `dangerouslySetInnerHTML` with a sanitization helper (e.g., `String(val).replace(/[<>;}\[\]"']/g, "")`) that strips characters capable of breaking the styling context or executing scripts.
