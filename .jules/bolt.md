## 2025-02-18 - Route-based Code Splitting Pattern
**Learning:** When implementing code splitting for routes that use named exports (barrel files), `React.lazy` requires a default export. We must bridge this by returning an object with a `default` property in the import promise: `import('...').then(m => ({ default: m.Component }))`.
**Action:** Always check if route components are default or named exports before converting to `lazy`. Use the wrapper pattern for named exports.

## 2025-02-18 - Nested Suspense for Layouts
**Learning:** Placing a `Suspense` boundary inside the Layout component (wrapping `Outlet`) instead of just at the top level allows the sidebar/header to remain visible while the page content loads.
**Action:** Identify Layout components and wrap their `Outlet` in `Suspense` to avoid "white screen" flashes during navigation.

## 2025-10-25 - Reducing redundant filter passes during React renders
**Learning:** Replacing multiple independent `.filter().length` calls on the same array with a single `.reduce()` pass to calculate aggregate statistics is a key performance optimization that reduces complexity from O(MN) to O(N) and eliminates intermediate array allocations, yielding significant improvement on large datasets.
**Action:** When calculating aggregate statistics (e.g., counts by status) from an array within a React component render cycle, replace multiple `.filter().length` statements with a single `.reduce()` pass and wrap the calculation in a `useMemo` hook.
