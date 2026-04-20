# Palette's Journal

## 2025-01-26 - Search Input Cleansing
**Learning:** Browser-native search inputs (`type="search"`) inject their own clear button, creating a "double X" visual glitch when a custom clear action is added.
**Action:** Always apply `[&::-webkit-search-cancel-button]:hidden` (or `appearance-none`) when building custom search components with Shadcn/Tailwind.

## 2025-01-26 - Icon-Only Button Accessibility
**Learning:** Icon-only buttons are invisible to screen readers without labels. Tooltips alone are insufficient for AT users.
**Action:** Pair `Tooltip` (for sighted users) with `aria-label` (for AT users) on every icon button.

## 2025-01-26 - Actionable Empty States
**Learning:** Empty states (e.g. "No results found") are dead ends if they don't provide a way out.
**Action:** When a list is empty due to filters, always provide a direct "Clear Filters" button in the empty state component.
