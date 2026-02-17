## 2024-05-22 - Actionable Empty States
**Learning:** Empty states in list views (like `PatientList`) are prime opportunities for "micro-UX" improvements. By distinguishing between "no data at all" and "no results found for filters", we can guide the user to the next logical action (create new vs clear filters). Implementing "Clear Filters" requires the filter components to be fully controlled by the parent page, often necessitating a refactor from uncontrolled local state to lifted state.
**Action:** When encountering list views with filters, check if the empty state provides a way to reset filters. If not, plan to lift the filter state to the parent component and implement a "Clear Filters" action in the empty state.

## 2024-05-22 - Local Mock Data
**Learning:** This project supports a `VITE_ENABLE_MOCK_DATA=true` environment variable to run the frontend with mock data, bypassing the backend. This is crucial for verifying UI changes in isolation without needing a full backend setup.
**Action:** Always check for `VITE_ENABLE_MOCK_DATA` support when working on frontend tasks to enable faster feedback loops.
