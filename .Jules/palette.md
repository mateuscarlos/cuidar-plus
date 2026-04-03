# Palette's Journal

## 2025-01-26 - Search Input Cleansing
**Learning:** Browser-native search inputs (`type="search"`) inject their own clear button, creating a "double X" visual glitch when a custom clear action is added.
**Action:** Always apply `[&::-webkit-search-cancel-button]:hidden` (or `appearance-none`) when building custom search components with Shadcn/Tailwind.

## 2025-01-26 - Icon-Only Button Accessibility
**Learning:** Icon-only buttons are invisible to screen readers without labels. Tooltips alone are insufficient for AT users.
**Action:** Pair `Tooltip` (for sighted users) with `aria-label` (for AT users) on every icon button.

## 2025-03-29 - Mobile-Only Button Accessibility
**Learning:** For mobile-only icon buttons (e.g., hamburger menus hidden on desktop), a `Tooltip` is unnecessary as mouse hover is unavailable.
**Action:** Use an `aria-label` alone alongside `aria-hidden="true"` on the inner SVG for robust accessibility on mobile interaction patterns.
