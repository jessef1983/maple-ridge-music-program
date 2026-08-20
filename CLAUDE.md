# Maple Ridge Music Program (git repo)

This `CLAUDE.md` is for **Claude Code / Cursor / Copilot** in the repository. The Claude Enterprise project upload is the 15 files in `mpr-project/project-files/` — that folder has a separate `CLAUDE.md` for CE chats.

## Inbox ingest

Drop session artifacts and photos in `updates/`. Merge with **`@admin-ingest`**, not by hand-editing `project-files/` from memory.

- Copilot custom agent: `.github/agents/admin-ingest.agent.md`
- Skill (Cursor / Claude Code / Copilot): `.cursor/skills/admin-ingest/SKILL.md`, `.claude/skills/admin-ingest/SKILL.md`, `.github/skills/admin-ingest/SKILL.md`
- Process: `UPDATE-PROCESS.md`

Per intake cluster, require (or explicitly waive): **summary MD**, **photo index**, **photos**. Assign real `MPR-###` / `LOT-###` at merge. File photos under `photos/` and commit them (marketplace / CE listing skills `present_files` from git). Archive `updates/` afterward. Commit on `session-YYYY-MM-DD-<topic>` and open a PR to `main`.

`@admin-ingest` is **not** a `skills/SKILL-00N-*` Claude Enterprise package. CE cannot write this repo.

## Layout

- `updates/` — inbox
- `mpr-project/project-files/` — CE seed (exactly the files listed in that folder's `CLAUDE.md`)
- `photos/` — git-tracked per-MPR / per-LOT photos (not in the 15-file seed)
- `skills/SKILL-00N-*/` — CE workflow skill sources
- `landing-zone/archive/` — superseded inbox and session docs
