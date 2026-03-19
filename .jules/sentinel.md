## 2026-02-01 - Committed Environment Secrets
**Vulnerability:** The `.env` file containing environment variables (potentially secrets) was tracked in the git repository.
**Learning:** Initial project setup or template generation failed to include `.env` in `.gitignore`, leading to accidental tracking of local configuration.
**Prevention:** Always verify `.gitignore` includes sensitive file patterns (`.env`, `*.pem`, etc.) before the first commit. Use pre-commit hooks to scan for secrets.

## 2026-02-01 - XSS in dangerouslySetInnerHTML Style Injection
**Vulnerability:** Radix UI / Shadcn chart components dynamically generate CSS rules mapping theme colors, injecting raw text variables (`id`, `key`, `color`) directly into `<style dangerouslySetInnerHTML={{ ... }}>` without any sanitization.
**Learning:** Even internal UI variables and CSS properties can be vectors for DOM-based XSS when string-interpolated into dangerouslySetInnerHTML attributes. An attacker could potentially inject closing style tags and arbitrary scripts via manipulated configurations.
**Prevention:** Never use `dangerouslySetInnerHTML` with string interpolation unless all interpolated values are properly sanitized or escaped. Always sanitize variables used inside `<style>` blocks (e.g., removing `<`, `>`, `"`, `'`, `[`, `]`, `;`, `}`) to prevent CSS injection and escaping the style context.
