# Palette's Journal

## 2025-01-26 - Search Input Cleansing
**Learning:** Browser-native search inputs (`type="search"`) inject their own clear button, creating a "double X" visual glitch when a custom clear action is added.
**Action:** Always apply `[&::-webkit-search-cancel-button]:hidden` (or `appearance-none`) when building custom search components with Shadcn/Tailwind.

## 2025-01-26 - Icon-Only Button Accessibility
**Learning:** Icon-only buttons are invisible to screen readers without labels. Tooltips alone are insufficient for AT users.
**Action:** Pair `Tooltip` (for sighted users) with `aria-label` (for AT users) on every icon button.

## 2025-02-12 - Controlled Filters for Clear Actions
**Learning:** Implementing a "Clear All Filters" action requires filter components (like search inputs) to be fully controlled by the parent state. Uncontrolled components with local state will not reflect the reset action.
**Action:** When designing filter components, prefer controlled props (`value` + `onChange`) over local state to enable external reset actions.

## 2025-02-12 - Modal Placement and Nesting
**Learning:** Dialog components (using Radix/Shadcn) should not be nested inside inline elements like `<span>` or layout-specific containers like `CardHeader`. This causes layout bugs and invalid HTML structure.
**Action:** Place `Dialog` components at the end of the page component's JSX return, outside of other structural elements.
