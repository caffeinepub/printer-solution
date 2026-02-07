# Specification

## Summary
**Goal:** Remove the profile setup flow and apply a cohesive visual refresh across the app UI.

**Planned changes:**
- Remove/disable any “Set up your profile” modal/dialog and related UI so authenticated users go straight into the main AppShell.
- Ensure the app remains fully usable when `getCallerUserProfile` returns `null`, including a non-broken header/profile area and functioning tabs/pages.
- Refresh and standardize UI styling across LoginPage, AppShell header, tab navigation, page surfaces, and dialogs (consistent colors, typography, spacing, and component styling).
- Update dialogs/popups to use solid, readable surfaces (non-transparent) with good contrast in both light and dark mode.
- Ensure all user-facing text affected/introduced by these changes is in English.

**User-visible outcome:** After logging in, users land directly in the main app without any profile setup prompt; the interface looks consistently refreshed across major screens/components, and the app works normally even if no user profile exists.
