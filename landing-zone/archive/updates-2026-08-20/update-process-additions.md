# UPDATE-PROCESS.md — Additions

Drop these into the existing file during your next Claude Code session.

---

## Revised: Workflow — Updating This Upload

Replace the current step list with:

1. Merge anything in `/updates/` into the matching file here — manual full-file
   replacements by mtime, AND any `session-updates*.md` from a CE session,
   applied entry by entry (assign real `MPR-###` where entries say `MPR-TBD`)
2. Merge skill file updates into the matching `skills/SKILL-00N-*/` folder,
   rebuild the `.skill` package
3. Regenerate `mpr-tags.html` locally (`node generate-tags.js`), after Step 1
   so tag-log.md merges are reflected
4. File any new intake/sale photos into `photos/<MPR-ID or LOT-ID>/` (see
   **Photo Seed Directory** below) and update the relevant index file
   (`onboarding-photo-index.md` / `photo-index.md`) with the new relative paths
5. Archive session clutter (summaries, handoffs, audits, merged
   `session-updates.md`) to `landing-zone/archive/`
6. Verify `project-files/` holds exactly the files listed in CLAUDE.md,
   nothing else
7. **Cut a session branch and open a PR to main:**
   - Branch name: `session-YYYY-MM-DD-<short-topic>`
     (e.g. `session-2026-08-20-wfl-timpani`)
   - Commit the merged `project-files/`, `skills/SKILL-00N-*/`, and
     `photos/` changes on that branch
   - Open a PR into `main`. Use the session's own summary/handoff notes as
     the PR description — you're already writing them for the archive step,
     just paste them in
   - Review and merge the PR yourself (solo maintainer — no second
     approver required)
   - Delete the branch after merge
8. Delete the local `project-files/` folder entirely and re-upload it fresh
   from the now-merged `main` — anything sitting here at upload time goes to
   Claude Enterprise
9. **Reminder:** re-upload `project-files/` and/or reinstall any updated
   `.skill` package in Claude Enterprise — nothing here takes effect there
   until it does

**Why the PR step:** every session's changes now land as a reviewable diff
with a rollback point, instead of overwriting the folder with no history.
If a merge turns out wrong, revert the PR instead of hand-fixing files.

---

## New: Photo Seed Directory

A top-level `photos/` folder, sibling to `project-files/`:

```
photos/
├── MPR-030/              # Dillon French horn — intake photos
├── MPR-034/               # Besson Eb tuba
├── MPR-087/                # Signet 123 oboe
├── LOT-001/                 # Spencer alto sax — sale listing photos
├── LOT-007/                  # Normandy clarinet
└── ...
```

**Conventions:**
- One folder per `MPR-###` (fleet/intake) or `LOT-###` (sale pipeline) ID
- Filenames stay descriptive but don't need student names
  (e.g. `mpr-034-bell-obstruction-2026-08-15.jpg`)
- `onboarding-photo-index.md` and `photo-index.md` reference relative paths
  into this folder instead of loose Drive filenames — this closes the
  "photos not yet located" gap on LOT-016/017/018
- Photos still awaiting an assigned MPR ID (e.g. the PLATZ oboe, the three
  WFL timpani) go in a holding folder — `photos/_pending/` — and move into
  their real `MPR-###/` folder at the same time the ID is assigned during
  merge Step 1

**Size note:** GitHub warns at 50MB per file and hard-blocks at 100MB.
Ordinary phone photos are well under that, but if the fleet's photo volume
grows substantially, Git LFS is worth revisiting then — not needed now.

---

## Revision History addition

Add to CLAUDE.md's Revision History once these land:

- **[next update date]** — Added PR-to-main step at end of the update
  process (session branch → PR → merge, with rollback via revert) and a
  `photos/` seed directory (per-MPR/LOT-ID subfolders, `_pending/` holding
  area for unassigned IDs) so onboarding/sale photos live in the repo
  instead of only in Drive/session-updates files.
