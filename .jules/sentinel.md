## 2026-02-01 - Committed Environment Secrets
**Vulnerability:** The `.env` file containing environment variables (potentially secrets) was tracked in the git repository.
**Learning:** Initial project setup or template generation failed to include `.env` in `.gitignore`, leading to accidental tracking of local configuration.
**Prevention:** Always verify `.gitignore` includes sensitive file patterns (`.env`, `*.pem`, etc.) before the first commit. Use pre-commit hooks to scan for secrets.

## 2025-03-01 - CSS Injection / XSS in Recharts Tooltip
**Vulnerability:** The `ChartStyle` component (`src/shared/ui/chart.tsx`) constructs dynamic CSS themes based on `ChartConfig` and passes unsanitized variables (`id`, `key`, `color`) directly into `dangerouslySetInnerHTML`.
**Learning:** Components from shadcn/ui or external libraries using dynamic CSS generation can be vectors for injection if user-provided configuration properties aren't sanitized before entering style blocks. A malicious config label or ID could break out of the style tag.
**Prevention:** Apply a sanitization function (`sanitizeForStyle`) that strips risky characters (`<`, `>`, `;`, `}`, `[`, `]`, `"`, `'`) when mapping configuration into dynamic CSS rules within `dangerouslySetInnerHTML`. Note that `eslint-disable-line no-useless-escape` may be needed for the regex `/[<>;}\[\]"']/g`.
