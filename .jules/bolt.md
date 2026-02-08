## 2025-02-18 - Route-based Code Splitting Pattern
**Learning:** When implementing code splitting for routes that use named exports (barrel files), `React.lazy` requires a default export. We must bridge this by returning an object with a `default` property in the import promise: `import('...').then(m => ({ default: m.Component }))`.
**Action:** Always check if route components are default or named exports before converting to `lazy`. Use the wrapper pattern for named exports.

## 2025-02-18 - Nested Suspense for Layouts
**Learning:** Placing a `Suspense` boundary inside the Layout component (wrapping `Outlet`) instead of just at the top level allows the sidebar/header to remain visible while the page content loads.
**Action:** Identify Layout components and wrap their `Outlet` in `Suspense` to avoid "white screen" flashes during navigation.

## 2025-02-19 - Filter Input Performance Bottleneck
**Learning:** List pages (e.g., `PatientsPage`) were passing inline filter handlers to child components, triggering re-renders and potential API calls on every keystroke. Controlled inputs without debouncing in the parent component caused excessive re-renders.
**Action:** When implementing filter components, ensure inputs are debounced (either locally or via a hook) and parent handlers are memoized with `useCallback` to prevent unnecessary re-renders of heavy list components.
