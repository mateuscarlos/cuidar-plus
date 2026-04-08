## 2025-02-18 - Route-based Code Splitting Pattern
**Learning:** When implementing code splitting for routes that use named exports (barrel files), `React.lazy` requires a default export. We must bridge this by returning an object with a `default` property in the import promise: `import('...').then(m => ({ default: m.Component }))`.
**Action:** Always check if route components are default or named exports before converting to `lazy`. Use the wrapper pattern for named exports.

## 2025-02-18 - Nested Suspense for Layouts
**Learning:** Placing a `Suspense` boundary inside the Layout component (wrapping `Outlet`) instead of just at the top level allows the sidebar/header to remain visible while the page content loads.
**Action:** Identify Layout components and wrap their `Outlet` in `Suspense` to avoid "white screen" flashes during navigation.

## 2025-02-19 - Query Thrashing with Controlled Inputs
**Learning:** Binding `useQuery` keys directly to high-frequency state (like search inputs) causes a network request on every keystroke, bypassing cache. Debouncing the state update (not just the event handler) is critical.
**Action:** Use a `useDebounce` hook to create a delayed version of the state for the query key, or debounce the setter.
