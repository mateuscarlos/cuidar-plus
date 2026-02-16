## 2024-05-22 - Icon-Only Buttons Accessibility
**Learning:** Icon-only buttons (like search) often lack `aria-label` and explanatory tooltips, making them inaccessible to screen readers and potentially confusing for users.
**Action:** Always wrap icon-only buttons in a `Tooltip` component and add a descriptive `aria-label` to the button element.
