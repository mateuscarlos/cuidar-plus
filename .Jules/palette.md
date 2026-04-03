# Palette's Journal

## 2025-01-26 - Search Input Cleansing
**Learning:** Browser-native search inputs (`type="search"`) inject their own clear button, creating a "double X" visual glitch when a custom clear action is added.
**Action:** Always apply `[&::-webkit-search-cancel-button]:hidden` (or `appearance-none`) when building custom search components with Shadcn/Tailwind.

## 2025-01-26 - Icon-Only Button Accessibility
**Learning:** Icon-only buttons are invisible to screen readers without labels. Tooltips alone are insufficient for AT users.
**Action:** Pair `Tooltip` (for sighted users) with `aria-label` (for AT users) on every icon button.

## 2024-04-03 - Added aria-label to icon-only buttons
**Learning:** Verified icon buttons using `<Button size="icon">` in this design system do not inherently enforce accessibility features, necessitating explicit `aria-label` additions. The project mixes routing between `src/pages` and `src/modules/.../presentation/pages`, requiring cross-checks on component modifications. Playwright locators for elements inside `<Sheet>` or `<Dialog>` (Shadcn components) should await visibility explicitly to avoid timeouts, and using `scroll_into_view_if_needed()` ensures hovered/clicked items are interactive when within scrollable areas like `ScrollArea`.
**Action:** Always ensure any `<Button size="icon">` or custom SVG-only interactive element receives a clear, localized `aria-label`. Use Playwright's `wait_for(state="visible")` aggressively when interacting with Shadcn portals (dialogs/sheets).
