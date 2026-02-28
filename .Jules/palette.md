# Palette's Journal

## 2025-01-26 - Search Input Cleansing
**Learning:** Browser-native search inputs (`type="search"`) inject their own clear button, creating a "double X" visual glitch when a custom clear action is added.
**Action:** Always apply `[&::-webkit-search-cancel-button]:hidden` (or `appearance-none`) when building custom search components with Shadcn/Tailwind.

## 2025-01-26 - Icon-Only Button Accessibility
**Learning:** Icon-only buttons are invisible to screen readers without labels. Tooltips alone are insufficient for AT users.
**Action:** Pair `Tooltip` (for sighted users) with `aria-label` (for AT users) on every icon button.

## 2025-01-26 - Application Routing Trap
**Learning:** The application uses a hybrid routing approach in `src/App.tsx`. Some routes use the `src/pages/` flat structure (e.g., `/dashboard`, `/insurers`), while others like `/patients` map to a deep modular structure (`src/modules/patients/presentation/pages`). Changing `src/pages/Patients.tsx` had no effect on the `/patients` route.
**Action:** Always check `src/App.tsx` first to determine which component is actually rendered for a given route before making UX changes.
