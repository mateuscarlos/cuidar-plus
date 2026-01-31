## 2026-01-31 - [Synchronous Route Imports]
**Learning:** The application imported all module pages synchronously in `App.tsx`, causing a monolithic initial bundle.
**Action:** Implement route-based code splitting using `React.lazy` and `Suspense` by default for top-level routes in modular React apps.
