## 2025-02-18 - Route-based Code Splitting Pattern
**Learning:** When implementing code splitting for routes that use named exports (barrel files), `React.lazy` requires a default export. We must bridge this by returning an object with a `default` property in the import promise: `import('...').then(m => ({ default: m.Component }))`.
**Action:** Always check if route components are default or named exports before converting to `lazy`. Use the wrapper pattern for named exports.

## 2025-02-18 - Nested Suspense for Layouts
**Learning:** Placing a `Suspense` boundary inside the Layout component (wrapping `Outlet`) instead of just at the top level allows the sidebar/header to remain visible while the page content loads.
**Action:** Identify Layout components and wrap their `Outlet` in `Suspense` to avoid "white screen" flashes during navigation.

## 2025-03-15 - Optimizing Case-Insensitive Mock Data Filtering
**Learning:** For case-insensitive search filtering in lists with mock data (e.g., `usePatients`, `useUsers`), pre-compiling a case-insensitive `RegExp` with escaped user input once outside the loop is significantly more efficient than repeated `.toLowerCase()` and `.includes()` calls on item properties inside the filter loop. Additionally, consolidating multiple chained `.filter()` calls into a single pass with early-return conditions significantly reduces CPU overhead and intermediate array allocations.
**Action:** When working with client-side filtering logic, replace chained `.filter()` calls and repeated `.toLowerCase().includes()` string operations with a single loop and a pre-compiled `RegExp`.
