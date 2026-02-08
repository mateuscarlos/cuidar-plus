## 2025-02-18 - Route-based Code Splitting Pattern
**Learning:** When implementing code splitting for routes that use named exports (barrel files), `React.lazy` requires a default export. We must bridge this by returning an object with a `default` property in the import promise: `import('...').then(m => ({ default: m.Component }))`.
**Action:** Always check if route components are default or named exports before converting to `lazy`. Use the wrapper pattern for named exports.

## 2025-02-18 - Nested Suspense for Layouts
**Learning:** Placing a `Suspense` boundary inside the Layout component (wrapping `Outlet`) instead of just at the top level allows the sidebar/header to remain visible while the page content loads.
**Action:** Identify Layout components and wrap their `Outlet` in `Suspense` to avoid "white screen" flashes during navigation.

## 2025-02-18 - Debounce Hook & Callback Stability
**Learning:** When using a debounce hook (or any effect) in a child component that triggers a parent callback (like `onSearchChange`), the parent callback MUST be stable (wrapped in `useCallback`). If not, the child's `useEffect` will re-run on every render of the parent, potentially causing infinite loops or defeating the debounce by triggering updates too often.
**Action:** Always wrap event handlers passed to components with effects (like filters) in `useCallback`.
