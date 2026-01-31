## 2024-05-22 - Handling Nested Interactive Elements in Cards
**Learning:** You cannot nest a semantic `<button>` inside a clickable card (`role="button"`) as it violates the "interactive controls must not be nested" rule.
**Action:** When a card has a primary action that covers the whole card, convert any redundant internal buttons to visual-only elements (e.g., `div` with button styling) and hide them from screen readers (`aria-hidden="true"`), or ensure they are moved out of the interactive container.
