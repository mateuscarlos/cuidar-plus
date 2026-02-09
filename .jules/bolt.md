## 2025-02-18 - Route-based Code Splitting Pattern
**Learning:** When implementing code splitting for routes that use named exports (barrel files), `React.lazy` requires a default export. We must bridge this by returning an object with a `default` property in the import promise: `import('...').then(m => ({ default: m.Component }))`.
**Action:** Always check if route components are default or named exports before converting to `lazy`. Use the wrapper pattern for named exports.

## 2025-02-18 - Nested Suspense for Layouts
**Learning:** Placing a `Suspense` boundary inside the Layout component (wrapping `Outlet`) instead of just at the top level allows the sidebar/header to remain visible while the page content loads.
**Action:** Identify Layout components and wrap their `Outlet` in `Suspense` to avoid "white screen" flashes during navigation.

## 2026-02-09 - List Memoization Pattern
**Learning:** `PatientsPage` was re-rendering the entire patient list (including all `PatientCard`s) whenever local state (like modal visibility) changed. This was due to recreated handler functions and unmemoized components.
**Action:** Always wrap list items (`PatientCard`) and list containers (`PatientList`) in `React.memo` when the parent component has frequent state updates (like modals/drawers). Ensure handlers passed to them are wrapped in `useCallback`.
