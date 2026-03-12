## 2026-02-01 - Committed Environment Secrets
**Vulnerability:** The `.env` file containing environment variables (potentially secrets) was tracked in the git repository.
**Learning:** Initial project setup or template generation failed to include `.env` in `.gitignore`, leading to accidental tracking of local configuration.
**Prevention:** Always verify `.gitignore` includes sensitive file patterns (`.env`, `*.pem`, etc.) before the first commit. Use pre-commit hooks to scan for secrets.
## 2026-03-12 - Prevent Over-redaction in sanitizeData Function
**Vulnerability:** A `sanitizeData` function intended to mask sensitive keys in logs used substring matching (`lowerKey.includes(k)`) where `k` was `"rg"`.
**Learning:** This approach resulted in severe over-redaction, stripping out data from totally harmless keys like `target` and `large` because they contained the string `"rg"`. Over-aggressive security measures can break primary logging and debugging capabilities.
**Prevention:** Use exact matching (`Set.has(lowerKey)`) or very carefully crafted exact-word regexes when filtering short acronym-based sensitive keys like `rg` or `cpf`.
