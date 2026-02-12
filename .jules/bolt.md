## 2025-02-18 - Route-based Code Splitting Pattern
**Learning:** When implementing code splitting for routes that use named exports (barrel files), `React.lazy` requires a default export. We must bridge this by returning an object with a `default` property in the import promise: `import('...').then(m => ({ default: m.Component }))`.
**Action:** Always check if route components are default or named exports before converting to `lazy`. Use the wrapper pattern for named exports.

## 2025-02-18 - Nested Suspense for Layouts
**Learning:** Placing a `Suspense` boundary inside the Layout component (wrapping `Outlet`) instead of just at the top level allows the sidebar/header to remain visible while the page content loads.
**Action:** Identify Layout components and wrap their `Outlet` in `Suspense` to avoid "white screen" flashes during navigation.

## 2025-02-19 - Optimization of Multiple Array Filters
**Learning:** Chaining or using multiple `.filter()` calls on the same array to derive different stats is significantly slower (O(k*N)) than a single `.reduce()` pass (O(N)). In this case, replacing 3 filters with 1 reduce improved performance by ~64% on 10k items.
**Action:** When calculating multiple statistics from a collection, prefer `reduce` over multiple `filter`s.
