## 2024-05-24 - Added tooltip and ARIA label to CEP search button
**Learning:** Icon-only buttons without labels (like the CEP search button in the PatientForm) can be confusing for both screen reader users and sighted users, negatively impacting accessibility and general user experience. Wrapping these buttons with Tooltips and adding `aria-label` provides necessary context.
**Action:** When adding or reviewing icon-only buttons, ensure they have an `aria-label` for screen readers and are wrapped in a `Tooltip` component (or equivalent) for visual context on hover.
