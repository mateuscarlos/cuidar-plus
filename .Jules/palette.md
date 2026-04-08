# Palette's Journal

## 2025-01-26 - Search Input Cleansing
**Learning:** Browser-native search inputs (`type="search"`) inject their own clear button, creating a "double X" visual glitch when a custom clear action is added.
**Action:** Always apply `[&::-webkit-search-cancel-button]:hidden` (or `appearance-none`) when building custom search components with Shadcn/Tailwind.

## 2025-01-26 - Icon-Only Button Accessibility
**Learning:** Icon-only buttons are invisible to screen readers without labels. Tooltips alone are insufficient for AT users.
**Action:** Pair `Tooltip` (for sighted users) with `aria-label` (for AT users) on every icon button.

## 2025-03-18 - AppLayout Decorative Icons and Navigation Accessibility
**Learning:** Found that `<Stethoscope />` icons used purely for visual branding alongside text did not have `aria-hidden="true"`, causing screen readers to announce redundant elements. Additionally, the mobile menu toggle button lacked an `aria-label`, making navigation inaccessible for AT users.
**Action:** Always add `aria-hidden="true"` to decorative SVGs/icons to prevent screen reader noise, and ensure `aria-label` is present on all icon-only structural buttons (like menu toggles).
