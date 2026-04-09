## 2026-02-01 - Committed Environment Secrets
**Vulnerability:** The `.env` file containing environment variables (potentially secrets) was tracked in the git repository.
**Learning:** Initial project setup or template generation failed to include `.env` in `.gitignore`, leading to accidental tracking of local configuration.
**Prevention:** Always verify `.gitignore` includes sensitive file patterns (`.env`, `*.pem`, etc.) before the first commit. Use pre-commit hooks to scan for secrets.

## 2025-03-07 - Fix XSS in ChartStyle dangerouslySetInnerHTML
**Vulnerability:** Unsanitized variables (`id`, `key`, `color`) were being passed into a dynamically constructed `<style>` tag, which was rendered using `dangerouslySetInnerHTML`. This could allow an attacker to inject arbitrary characters that break out of the CSS rules and inject cross-site scripting (XSS) via JavaScript or other malicious HTML elements.
**Learning:** Even variables designed to hold specific non-HTML data types, such as IDs or CSS color values, should be sanitized if they are injected into an HTML context, especially when using `dangerouslySetInnerHTML`. The string concatenation within string literals doesn't escape HTML tags or specific CSS characters on its own.
**Prevention:** Always sanitize dynamic inputs injected directly into `dangerouslySetInnerHTML`. For CSS structures embedded within HTML, strip out characters like `<`, `>`, `;`, `}`, `[`, `]`, `"`, and `'` to constrain the value to a safe format. Ensure to use linting ignores effectively, like `// eslint-disable-next-line no-useless-escape` when necessary for regular expressions doing the sanitizing.
