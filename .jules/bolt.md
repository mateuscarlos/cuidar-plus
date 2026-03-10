## 2025-02-18 - Route-based Code Splitting Pattern
**Learning:** When implementing code splitting for routes that use named exports (barrel files), `React.lazy` requires a default export. We must bridge this by returning an object with a `default` property in the import promise: `import('...').then(m => ({ default: m.Component }))`.
**Action:** Always check if route components are default or named exports before converting to `lazy`. Use the wrapper pattern for named exports.

## 2025-02-18 - Nested Suspense for Layouts
**Learning:** Placing a `Suspense` boundary inside the Layout component (wrapping `Outlet`) instead of just at the top level allows the sidebar/header to remain visible while the page content loads.
**Action:** Identify Layout components and wrap their `Outlet` in `Suspense` to avoid "white screen" flashes during navigation.

## 2024-03-10 - Consolidate Multiple Array Iterations
**Learning:** Chaining multiple `.filter()` calls on arrays of mock data (or cached local state) is a common anti-pattern that creates intermediate arrays and requires O(K*N) passes (where K is the number of filters).
**Action:** When working on data filtering hooks (e.g., `useUsers`, `useInventory`), consolidate multiple conditions into a single pass using early returns inside a single `.filter()` call. This significantly reduces CPU overhead and intermediate array memory allocations.
