## 2026-02-01 - Committed Environment Secrets
**Vulnerability:** The `.env` file containing environment variables (potentially secrets) was tracked in the git repository.
**Learning:** Initial project setup or template generation failed to include `.env` in `.gitignore`, leading to accidental tracking of local configuration.
**Prevention:** Always verify `.gitignore` includes sensitive file patterns (`.env`, `*.pem`, etc.) before the first commit. Use pre-commit hooks to scan for secrets.

## 2025-03-08 - CSS Injection in ChartStyle `<style>` Tag
**Vulnerability:** The `ChartStyle` component in `src/shared/ui/chart.tsx` was directly injecting props (`id`, `key`, `color`) into a `<style>` tag using `dangerouslySetInnerHTML`.
**Learning:** Even within UI components, dynamically rendering raw strings into `<style>` tags can allow CSS injection or XSS if structural characters (like brackets and quotes) are not stripped.
**Prevention:** Always sanitize dynamic strings before rendering them via `dangerouslySetInnerHTML` in `<style>` blocks by stripping out structural characters like `<>;}[]"'`.
