# Palette's Journal

## 2025-01-26 - Search Input Cleansing
**Learning:** Browser-native search inputs (`type="search"`) inject their own clear button, creating a "double X" visual glitch when a custom clear action is added.
**Action:** Always apply `[&::-webkit-search-cancel-button]:hidden` (or `appearance-none`) when building custom search components with Shadcn/Tailwind.

## 2025-01-26 - Icon-Only Button Accessibility
**Learning:** Icon-only buttons are invisible to screen readers without labels. Tooltips alone are insufficient for AT users.
**Action:** Pair `Tooltip` (for sighted users) with `aria-label` (for AT users) on every icon button.

## 2025-01-26 - Actionable Empty States
**Learning:** Generic "No results" messages frustrate users by requiring them to navigate away to fix the problem. Adding direct actions (e.g., "Clear Filters" or "Create New Item") inside the empty state keeps the user in flow.
**Action:** Implement empty states as components that accept `onClearFilters` and `onCreate` callbacks, and distinguish between "no results due to filters" and "no data at all".
