## 2025-02-18 - Route-based Code Splitting Pattern
**Learning:** When implementing code splitting for routes that use named exports (barrel files), `React.lazy` requires a default export. We must bridge this by returning an object with a `default` property in the import promise: `import('...').then(m => ({ default: m.Component }))`.
**Action:** Always check if route components are default or named exports before converting to `lazy`. Use the wrapper pattern for named exports.

## 2025-02-18 - Nested Suspense for Layouts
**Learning:** Placing a `Suspense` boundary inside the Layout component (wrapping `Outlet`) instead of just at the top level allows the sidebar/header to remain visible while the page content loads.
**Action:** Identify Layout components and wrap their `Outlet` in `Suspense` to avoid "white screen" flashes during navigation.

## 2025-03-25 - O(N) Array Reduction Optimization
**Learning:** Replacing multiple independent `.filter().length` calls on the same array with a single `.reduce()` pass calculates aggregate statistics much faster. It reduces complexity from O(3N) to O(N) and eliminates intermediate array allocations.
**Action:** Look for chained or repeated `.filter()` operations used solely for counting or aggregating data and consolidate them into a single `reduce` pass to save CPU overhead.
