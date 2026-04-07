## 2026-02-01 - Committed Environment Secrets
**Vulnerability:** The `.env` file containing environment variables (potentially secrets) was tracked in the git repository.
**Learning:** Initial project setup or template generation failed to include `.env` in `.gitignore`, leading to accidental tracking of local configuration.
**Prevention:** Always verify `.gitignore` includes sensitive file patterns (`.env`, `*.pem`, etc.) before the first commit. Use pre-commit hooks to scan for secrets.

## 2026-03-26 - CSS Injection via dangerouslySetInnerHTML in ChartStyle
**Vulnerability:** Structural characters like `{`, `}`, `<`, `>`, `"`, and `'` were not being sanitized from chart configuration keys and colors prior to injection in `<style dangerouslySetInnerHTML>` inside `src/shared/ui/chart.tsx`. An attacker could break out of the selector block or close the style tag to inject arbitrary CSS or HTML.
**Learning:** Even though `dangerouslySetInnerHTML` is commonly flagged for XSS, when injecting raw strings into `<style>` elements inside it, one must be exceedingly careful about unescaped keys, ids, and colors that could act as vectors to manipulate the DOM or CSS rules structure.
**Prevention:** Always sanitize dynamic properties (like `id`, `keys`, `colors`) injected into `<style>` tags via string interpolation by stripping out structural syntax using a regex such as `replace(/[<>;}\[\]"']/g, "")`.
