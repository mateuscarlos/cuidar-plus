## 2025-02-18 - Route-based Code Splitting Pattern
**Learning:** When implementing code splitting for routes that use named exports (barrel files), `React.lazy` requires a default export. We must bridge this by returning an object with a `default` property in the import promise: `import('...').then(m => ({ default: m.Component }))`.
**Action:** Always check if route components are default or named exports before converting to `lazy`. Use the wrapper pattern for named exports.

## 2025-02-18 - Nested Suspense for Layouts
**Learning:** Placing a `Suspense` boundary inside the Layout component (wrapping `Outlet`) instead of just at the top level allows the sidebar/header to remain visible while the page content loads.
**Action:** Identify Layout components and wrap their `Outlet` in `Suspense` to avoid "white screen" flashes during navigation.
## 2025-02-18 - Search Input Debouncing & useCallback
**Learning:** When debouncing a search input using `useEffect` in a child component, the parent's handler function passed as a prop must be memoized using `useCallback`. Failure to do so causes the parent's function reference to change on every render, which in turn triggers the child's `useEffect` (since the function is in its dependency array), leading to continuous unwanted state updates or infinite render loops.
**Action:** Always wrap handler functions passed as props to debounced child components with `useCallback` in the parent. Ensure the child's `useEffect` dependencies include both the local value and the stable parent handler.
