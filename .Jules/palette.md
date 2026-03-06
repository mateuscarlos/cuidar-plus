# Palette's Journal

## 2025-01-26 - Search Input Cleansing
**Learning:** Browser-native search inputs (`type="search"`) inject their own clear button, creating a "double X" visual glitch when a custom clear action is added.
**Action:** Always apply `[&::-webkit-search-cancel-button]:hidden` (or `appearance-none`) when building custom search components with Shadcn/Tailwind.

## 2025-01-26 - Icon-Only Button Accessibility
**Learning:** Icon-only buttons are invisible to screen readers without labels. Tooltips alone are insufficient for AT users.
**Action:** Pair `Tooltip` (for sighted users) with `aria-label` (for AT users) on every icon button.
## 2024-03-06 - Tooltips and Dialog Triggers Composition
**Learning:** When using Radix UI (shadcn-ui) components, placing a `<Tooltip>` directly inside `<SheetTrigger asChild>` (or similar Dialog triggers) breaks the trigger functionality because `<Tooltip>` is a context provider and drops DOM event listeners.
**Action:** Always compose multiple interactive components by wrapping the context providers around the triggers and nesting the triggers using `asChild`. For example: `<Tooltip><SheetTrigger asChild><TooltipTrigger asChild><Button>...</Button></TooltipTrigger></SheetTrigger></Tooltip>`.
