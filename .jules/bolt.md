## 2024-05-22 - Dead Code in src/pages
**Learning:** The project uses a modular architecture where pages are located in `src/modules/*/presentation/pages`. However, legacy or duplicate files exist in `src/pages/` (e.g., `Patients.tsx`) which are unused but can cause linting errors or confusion.
**Action:** When working on pages, always check `src/modules` first and verify which file is actually imported in `App.tsx`. Ignore or cleanup files in `src/pages` if they are not referenced.
