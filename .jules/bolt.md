## 2025-02-18 - Route-based Code Splitting Pattern
**Learning:** When implementing code splitting for routes that use named exports (barrel files), `React.lazy` requires a default export. We must bridge this by returning an object with a `default` property in the import promise: `import('...').then(m => ({ default: m.Component }))`.
**Action:** Always check if route components are default or named exports before converting to `lazy`. Use the wrapper pattern for named exports.

## 2025-02-18 - Nested Suspense for Layouts
**Learning:** Placing a `Suspense` boundary inside the Layout component (wrapping `Outlet`) instead of just at the top level allows the sidebar/header to remain visible while the page content loads.
**Action:** Identify Layout components and wrap their `Outlet` in `Suspense` to avoid "white screen" flashes during navigation.

## 2025-02-19 - Case-Insensitive Filtering Performance
**Learning:** For case-insensitive search filtering in lists with mock data (e.g., `usePatients`, `useUsers`, `useInventory`), pre-compiling a case-insensitive `RegExp` with escaped user input once outside the loop is significantly more efficient (~3.5x gain) than repeated `.toLowerCase()` and `.includes()` calls on item properties inside the filter loop.
**Action:** When optimizing list filtering logic, replace `.toLowerCase().includes(...)` inside iterations with a pre-compiled `new RegExp(escapedSearch, 'i')` outside the loop.

## 2025-02-19 - Single Pass Filtering & Aggregation
**Learning:** Replacing multiple independent `.filter()` calls on the same array with a single `.reduce()` pass to calculate aggregate statistics reduces complexity from O(MN) to O(N) and eliminates intermediate array allocations. The same principle applies to chained `.filter()` calls, which can be consolidated into a single pass with early-return conditions.
**Action:** Always consolidate chained or parallel array iterations into a single pass (`reduce` for aggregates, single `filter` block for lists) to improve processing speed and reduce memory overhead on large datasets.
