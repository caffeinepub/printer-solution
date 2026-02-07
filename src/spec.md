# Specification

## Summary
**Goal:** Enable the currently disabled “Add” tab/entry point in dialog-driven workflows and make all popout dialogs/forms fully opaque (no transparency) across the UI.

**Planned changes:**
- Find every dialog/dialog-driven workflow where an “Add” tab/trigger exists and ensure it is enabled and selectable.
- Ensure selecting the “Add” tab/trigger reliably reveals the add/create form content without hidden/blocked states or console errors.
- Remove translucent styling from all dialog surfaces, popout forms, and nested popovers used within dialogs by using fully opaque background/theme classes (in light and dark modes), avoiding opacity modifiers and backdrop-blur effects, without modifying shared UI component files.

**User-visible outcome:** Users can click the “Add” tab anywhere it appears in dialogs to open the add/create form, and all dialog/popout surfaces (including dropdowns inside dialogs) appear with solid, readable, non-transparent backgrounds.
