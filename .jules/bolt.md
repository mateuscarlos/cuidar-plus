## 2025-02-18 - Route-based Code Splitting Pattern
**Learning:** When implementing code splitting for routes that use named exports (barrel files), `React.lazy` requires a default export. We must bridge this by returning an object with a `default` property in the import promise: `import('...').then(m => ({ default: m.Component }))`.
**Action:** Always check if route components are default or named exports before converting to `lazy`. Use the wrapper pattern for named exports.

## 2025-02-18 - Nested Suspense for Layouts
**Learning:** Placing a `Suspense` boundary inside the Layout component (wrapping `Outlet`) instead of just at the top level allows the sidebar/header to remain visible while the page content loads.
**Action:** Identify Layout components and wrap their `Outlet` in `Suspense` to avoid "white screen" flashes during navigation.

## 2025-02-18 - Single-Pass Aggregation Optimization
**Learning:** Calculating multiple statistics (e.g. counting different status types) from a single array using separate `.filter().length` calls iterates the entire array each time (O(M*N) where M is number of checks). This is a common performance anti-pattern in React render functions.
**Action:** Replace multiple independent `.filter()` loops with a single `.reduce()` pass to aggregate all stats in O(N) time. Always wrap this aggregation in a `useMemo` so the work is only done when the source data actually changes.
