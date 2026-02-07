# Specification

## Summary
**Goal:** After a successful Internet Identity login, skip any post-login user option/selection step and take the user directly to the main dashboard (AppShell).

**Planned changes:**
- Remove/bypass any intermediate post-login user option/selection UI so the app routes/renders directly into AppShell after login.
- Adjust first-time profile setup behavior so missing-profile prompts appear as a modal/overlay on top of the dashboard instead of blocking entry with a separate step/page.
- Preserve the dashboard’s normal default tab selection on first render (current default: Clients).

**User-visible outcome:** Users land on the dashboard immediately after logging in with Internet Identity, without being asked to choose a user option; if profile setup is needed, it appears as a modal over the dashboard.
