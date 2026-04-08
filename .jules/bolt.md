## 2025-02-18 - Route-based Code Splitting Pattern
**Learning:** When implementing code splitting for routes that use named exports (barrel files), `React.lazy` requires a default export. We must bridge this by returning an object with a `default` property in the import promise: `import('...').then(m => ({ default: m.Component }))`.
**Action:** Always check if route components are default or named exports before converting to `lazy`. Use the wrapper pattern for named exports.

## 2025-02-18 - Nested Suspense for Layouts
**Learning:** Placing a `Suspense` boundary inside the Layout component (wrapping `Outlet`) instead of just at the top level allows the sidebar/header to remain visible while the page content loads.
**Action:** Identify Layout components and wrap their `Outlet` in `Suspense` to avoid "white screen" flashes during navigation.
## 2025-02-18 - Debounce Pattern for List Filters
**Learning:** Search filter components should implement debouncing using a `useEffect` hook with a local state for the input value and a timeout (e.g., 500ms) to trigger the parent's `onSearchChange` prop, which must be memoized via `useCallback` to prevent infinite loops and unnecessary re-renders of memoized child components.
**Action:** When optimizing search inputs, always pair local debouncing (`setTimeout`) with stable callback references (`useCallback`) in the parent and `React.memo` on the child component.
