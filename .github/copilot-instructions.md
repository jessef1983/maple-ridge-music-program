# Copilot instructions — Maple Ridge Music Program

This repo is the git source for the Maple Ridge School music program. Claude Enterprise is seeded from `mpr-project/project-files/` and from `.skill` packages under `skills/`. It does not pick up git edits automatically.

## Custom agent: `@admin-ingest`

Use **`@admin-ingest`** (`.github/agents/admin-ingest.agent.md`, skill `admin-ingest`) whenever the user wants to merge `updates/`, ingest session-updates/summaries/photos, or file intake into inventory and git.

Do not merge the inbox as a casual edit. Audit, compare to `inventory.md` / `sale-inventory.md` / `onboarding-photo-index.md`, ask about missing summary / photo index / photos, file **`photos/` into git**, then follow `UPDATE-PROCESS.md`. Finish on a `session-YYYY-MM-DD-<topic>` branch with a PR to `main`.

## Do not

- Invent new `MPR-###` IDs in CE-style session files; assign at merge from live `inventory.md`
- Put the full photo library into the 15-file `project-files/` seed
- Leave new `photos/` files untracked
- Commit ingest merges directly to `main`

## CE skills vs admin-ingest

`skills/SKILL-00N-*` are Enterprise chat workflows (assignment, onboarding, sales, …). `@admin-ingest` is local only. Marketplace posting from Claude uses listing photos committed under `photos/`, bundled into a skill package.
