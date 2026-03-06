## 2026-02-01 - Committed Environment Secrets
**Vulnerability:** The `.env` file containing environment variables (potentially secrets) was tracked in the git repository.
**Learning:** Initial project setup or template generation failed to include `.env` in `.gitignore`, leading to accidental tracking of local configuration.
**Prevention:** Always verify `.gitignore` includes sensitive file patterns (`.env`, `*.pem`, etc.) before the first commit. Use pre-commit hooks to scan for secrets.

## 2026-03-06 - ChartStyle XSS via Theme Configuration
**Vulnerability:** The `ChartStyle` component in `src/shared/ui/chart.tsx` used `dangerouslySetInnerHTML` to inject CSS variables for theming, but it did not sanitize the `id`, `key`, or `color` properties from the chart configuration, leaving a potential Cross-Site Scripting (XSS) vulnerability via injected style tags.
**Learning:** Even seemingly harmless data like theme configuration colors and ids can be used to inject malicious scripts when passed to `dangerouslySetInnerHTML`. Never trust configuration data to be safe for unescaped HTML injection.
**Prevention:** Always sanitize any dynamic values (e.g., stripping dangerous characters like `<`, `>`, `;`, `}`, `[`, `]`, `"`, `'`) before interpolating them into a string that is passed to `dangerouslySetInnerHTML`.
