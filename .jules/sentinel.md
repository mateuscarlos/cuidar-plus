## 2026-02-01 - Committed Environment Secrets
**Vulnerability:** The `.env` file containing environment variables (potentially secrets) was tracked in the git repository.
**Learning:** Initial project setup or template generation failed to include `.env` in `.gitignore`, leading to accidental tracking of local configuration.
**Prevention:** Always verify `.gitignore` includes sensitive file patterns (`.env`, `*.pem`, etc.) before the first commit. Use pre-commit hooks to scan for secrets.

## 2026-02-05 - CSS Injection in ChartStyle
**Vulnerability:** The `ChartStyle` component used `dangerouslySetInnerHTML` to inject styles with unsanitized user inputs (`id`, `key`, `color`).
**Learning:** CSS injection is often overlooked but can allow attackers to inject arbitrary CSS, potentially leading to phishing or XSS via attributes.
**Prevention:** Always sanitize inputs when constructing CSS strings, especially within `<style>` blocks. Use whitelisting for IDs/keys and strict blacklisting for values.
