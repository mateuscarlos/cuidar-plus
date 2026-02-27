# Palette's Journal

## 2025-01-26 - Search Input Cleansing
**Learning:** Browser-native search inputs (`type="search"`) inject their own clear button, creating a "double X" visual glitch when a custom clear action is added.
**Action:** Always apply `[&::-webkit-search-cancel-button]:hidden` (or `appearance-none`) when building custom search components with Shadcn/Tailwind.

## 2025-01-26 - Icon-Only Button Accessibility
**Learning:** Icon-only buttons are invisible to screen readers without labels. Tooltips alone are insufficient for AT users.
**Action:** Pair `Tooltip` (for sighted users) with `aria-label` (for AT users) on every icon button.

## 2025-01-26 - Complex Card Skeleton Loading
**Learning:** Using a generic `Skeleton` block for complex cards (like `PatientCard`) creates significant layout shift and a jarring visual transition when data loads.
**Action:** Create a dedicated `*Skeleton` component (e.g., `PatientCardSkeleton`) that mimics the internal structure (avatar, badge, text lines) of the actual card to provide a seamless loading experience.
