## 2025-02-18 - Route-based Code Splitting Pattern
**Learning:** When implementing code splitting for routes that use named exports (barrel files), `React.lazy` requires a default export. We must bridge this by returning an object with a `default` property in the import promise: `import('...').then(m => ({ default: m.Component }))`.
**Action:** Always check if route components are default or named exports before converting to `lazy`. Use the wrapper pattern for named exports.

## 2025-02-18 - Nested Suspense for Layouts
**Learning:** Placing a `Suspense` boundary inside the Layout component (wrapping `Outlet`) instead of just at the top level allows the sidebar/header to remain visible while the page content loads.
**Action:** Identify Layout components and wrap their `Outlet` in `Suspense` to avoid "white screen" flashes during navigation.

## 2025-02-18 - Verification of Re-renders via Playwright
**Learning:** In the absence of specialized performance tools, injecting temporary `console.log` statements in components and counting them via Playwright's `page.on("console", ...)` is a reliable way to measure re-renders and verify optimizations like `React.memo`.
**Action:** Use this pattern when you need to prove a performance win quantitatively without setting up a full profiling environment.

## 2025-02-18 - Memoization requires Referential Stability
**Learning:** Simply wrapping a child component in `React.memo` is insufficient if the parent passes inline arrow functions as props. The parent must use `useCallback` to ensure prop stability, otherwise the memoization is defeated.
**Action:** When optimizing a list item with `memo`, always audit the parent component and wrap passed handlers in `useCallback`.
