# Maple Ridge Music Program — local agents

This file is for **Cursor / Copilot / Claude Code** working in the git repo. The Claude Enterprise upload lives in `mpr-project/project-files/` and has its own `CLAUDE.md`.

## `@admin-ingest`

When the user drops files in `updates/` or says ingest / merge updates:

1. Load `.github/agents/admin-ingest.agent.md` and `.github/skills/admin-ingest/SKILL.md` (mirrored under `.cursor/skills/admin-ingest/` and `.claude/skills/admin-ingest/`).
2. Follow `UPDATE-PROCESS.md`.
3. Audit → compare to inventory → ask about missing **summary MD, photo index, photos** → merge → file **`photos/` into git** → archive inbox → **session branch + PR to `main`**.

Do not invent `MPR-###` IDs. Do not commit ingest merges to `main`.

## Other local rules

- CE session-updates protocol: `.cursor/rules/session-updates-protocol.mdc`
- After CE-facing publish: re-seed reminder
- CE business skills: `skills/SKILL-00N-*/` — not the admin-ingest agent
