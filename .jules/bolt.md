## 2025-02-18 - Route-based Code Splitting Pattern
**Learning:** When implementing code splitting for routes that use named exports (barrel files), `React.lazy` requires a default export. We must bridge this by returning an object with a `default` property in the import promise: `import('...').then(m => ({ default: m.Component }))`.
**Action:** Always check if route components are default or named exports before converting to `lazy`. Use the wrapper pattern for named exports.

## 2025-02-18 - Nested Suspense for Layouts
**Learning:** Placing a `Suspense` boundary inside the Layout component (wrapping `Outlet`) instead of just at the top level allows the sidebar/header to remain visible while the page content loads.
**Action:** Identify Layout components and wrap their `Outlet` in `Suspense` to avoid "white screen" flashes during navigation.

## 2025-02-18 - Debounce Pattern for Search Inputs
**Learning:** When using a `useDebounce` hook in a child component to filter parent data, the parent's callback function (passed as a prop) must be wrapped in `useCallback`. Otherwise, the parent's re-render (triggered by the debounced update) creates a new callback reference, firing the child's `useEffect` again, potentially leading to an infinite loop or redundant updates.
**Action:** Always wrap state-updating handlers passed to debounced child components in `useCallback`.
