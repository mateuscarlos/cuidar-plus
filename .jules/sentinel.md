## 2026-02-01 - Committed Environment Secrets
**Vulnerability:** The `.env` file containing environment variables (potentially secrets) was tracked in the git repository.
**Learning:** Initial project setup or template generation failed to include `.env` in `.gitignore`, leading to accidental tracking of local configuration.
**Prevention:** Always verify `.gitignore` includes sensitive file patterns (`.env`, `*.pem`, etc.) before the first commit. Use pre-commit hooks to scan for secrets.
## 2026-04-07 - [Fix XSS in Chart component via dangerouslySetInnerHTML]
**Vulnerability:** A cross-site scripting (XSS) vulnerability was found in the `ChartStyle` component (`src/shared/ui/chart.tsx`). The `color` property from the user-provided chart configuration was being injected directly into a `<style>` tag using `dangerouslySetInnerHTML` without any escaping or sanitization.
**Learning:** Even within CSS/style contexts, `dangerouslySetInnerHTML` can be exploited if malicious strings containing `</style><script>...` are injected. In React/shadcn-ui components, data passed to config props isn't automatically safe for raw HTML injection.
**Prevention:** Always sanitize or escape user-controlled variables before interpolating them into HTML strings for `dangerouslySetInnerHTML`. For CSS contexts, replace `<` and `>` with their CSS unicode equivalents (`\3C ` and `\3E `) rather than removing characters, to preserve valid CSS syntax like `/` in color channels.
