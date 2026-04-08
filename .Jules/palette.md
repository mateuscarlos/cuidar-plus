# Palette's Journal

## 2025-01-26 - Search Input Cleansing
**Learning:** Browser-native search inputs (`type="search"`) inject their own clear button, creating a "double X" visual glitch when a custom clear action is added.
**Action:** Always apply `[&::-webkit-search-cancel-button]:hidden` (or `appearance-none`) when building custom search components with Shadcn/Tailwind.

## 2025-01-26 - Icon-Only Button Accessibility
**Learning:** Icon-only buttons are invisible to screen readers without labels. Tooltips alone are insufficient for AT users.
**Action:** Pair `Tooltip` (for sighted users) with `aria-label` (for AT users) on every icon button.

## 2025-01-26 - Search Clear Focus
**Learning:** Users expect focus to return to the input after clearing it, so they can type immediately.
**Action:** Use `useRef` to focus the input programmatically in the clear handler.

## 2025-01-26 - Radix UI Select Labeling
**Learning:** Radix UI `Select` components don't automatically associate external labels. `SelectTrigger` renders a button.
**Action:** Add `id` to `SelectTrigger` and `htmlFor` to the `label` element to ensure proper association.
