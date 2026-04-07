## 2026-02-01 - Committed Environment Secrets
**Vulnerability:** The `.env` file containing environment variables (potentially secrets) was tracked in the git repository.
**Learning:** Initial project setup or template generation failed to include `.env` in `.gitignore`, leading to accidental tracking of local configuration.
**Prevention:** Always verify `.gitignore` includes sensitive file patterns (`.env`, `*.pem`, etc.) before the first commit. Use pre-commit hooks to scan for secrets.

## $(date +%Y-%m-%d) - ChartStyle XSS Vulnerability
**Vulnerability:** XSS vulnerability in `src/shared/ui/chart.tsx` where dynamic props (`id`, `key`, `color`) were injected into a `<style>` block via `dangerouslySetInnerHTML` without escaping, allowing `<` and `>` to prematurely close the style tag.
**Learning:** Using regex like `/[^a-zA-Z0-9-_.#()%, ]/g` to strip characters is too destructive for CSS and can break valid color formats like `hsl(120 100% 50% / 0.5)` which use `/`.
**Prevention:** Instead of stripping, safely escape characters. For `<style>` blocks, escape `<` to `\3C ` and `>` to `\3E ` to prevent HTML parser breakouts while remaining valid CSS.
