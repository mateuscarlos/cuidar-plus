## 2026-02-01 - Committed Environment Secrets
**Vulnerability:** The `.env` file containing environment variables (potentially secrets) was tracked in the git repository.
**Learning:** Initial project setup or template generation failed to include `.env` in `.gitignore`, leading to accidental tracking of local configuration.
**Prevention:** Always verify `.gitignore` includes sensitive file patterns (`.env`, `*.pem`, etc.) before the first commit. Use pre-commit hooks to scan for secrets.

## 2025-02-18 - XSS via dangerouslySetInnerHTML in ChartStyle
**Vulnerability:** The `ChartStyle` component in `src/shared/ui/chart.tsx` used `dangerouslySetInnerHTML` to inject theme CSS, but failed to sanitize the `id`, `key`, and `color` properties. This allowed potential Cross-Site Scripting (XSS) if any of those values were derived from user input or external sources.
**Learning:** `dangerouslySetInnerHTML` is commonly used to inject styles in React when building components like Charts, but developer assumption that inputs to CSS generation (like IDs or colors) are safe leads to XSS vulnerabilities.
**Prevention:** Always implement an input sanitization helper (e.g., stripping characters like `<, >, ;, }, [, ], ", '`) before injecting dynamic values into `dangerouslySetInnerHTML`, even if the injection context is just a `<style>` block.
