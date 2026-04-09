## 2026-02-01 - Committed Environment Secrets
**Vulnerability:** The `.env` file containing environment variables (potentially secrets) was tracked in the git repository.
**Learning:** Initial project setup or template generation failed to include `.env` in `.gitignore`, leading to accidental tracking of local configuration.
**Prevention:** Always verify `.gitignore` includes sensitive file patterns (`.env`, `*.pem`, etc.) before the first commit. Use pre-commit hooks to scan for secrets.

## 2026-02-01 - CSS Injection in ChartStyle
**Vulnerability:** The `ChartStyle` component in `src/shared/ui/chart.tsx` used `dangerouslySetInnerHTML` to inject dynamic styles based on a configuration object without sanitizing keys or colors.
**Learning:** Relying on unsanitized input to construct CSS rules inside a <style> block allows attackers to inject arbitrary CSS, potentially breaking the layout or leading to XSS vulnerabilities if the input is user-controlled.
**Prevention:** Always sanitize input dynamically injected into CSS rules. In this case, a `sanitizeForStyle` helper was introduced to strip dangerous characters (`<`, `>`, `;`, `}`, `[`, `]`, `"`, `'`) from keys and colors before interpolation.
