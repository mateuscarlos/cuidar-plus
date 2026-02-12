## 2026-02-12 - Standardized Button Loading State
**Learning:** Adding an `isLoading` prop to Shadcn UI `Button` component simplifies usage across the app but requires careful handling of `asChild`. When `asChild` is true (e.g., used with `Link`), injecting a spinner automatically is unsafe due to `Slot` expecting a single child.
**Action:** Always check `asChild` before injecting content into `Slot`-based components. For icon-only buttons, the consumer must manually hide the icon when loading to prevent layout breakage.
