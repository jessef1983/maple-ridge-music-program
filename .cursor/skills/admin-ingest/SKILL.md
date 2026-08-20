---
name: admin-ingest
description: >-
  Audits maple-ridge-music-program/updates, compares intake to inventory and
  photo indexes, asks about missing summary/photo-index/photos, files photos
  into git under photos/, merges project-files, archives the inbox, then
  commits on a session branch and opens a PR to main. Use when the user says
  @admin-ingest, ingest, merge updates, or drop session-updates into the inbox.
---

# MPR Admin Ingest

Local merge of the `updates/` inbox into this git repo. Not a Claude Enterprise skill.

Read and follow `UPDATE-PROCESS.md`. Read `.github/agents/admin-ingest.agent.md` for persona, constraints, and output format.

## Invoke

Primary: **`@admin-ingest`**. Also: `ingest`, `merge updates`, `ingest the inbox`.

Invoking **is** approval to merge, archive `updates/`, **git-add `photos/`**, commit on a **new session branch**, push, and open a PR to `main` — after the gap check. Stop for blocking gaps; do not invent facts.

## Paths

| Role | Path |
|------|------|
| Inbox | `updates/` |
| Fleet / assignment / sale / photo index | `mpr-project/project-files/` |
| Photos (git-tracked; marketplace/CE `present_files`) | `photos/<MPR-###>/`, `photos/<LOT-###>/`, `photos/_pending/` |
| CE skills source | `skills/SKILL-00N-*/` |
| Archive | `landing-zone/archive/updates-YYYY-MM-DD/` and `session-docs-YYYY-MM-DD/` |
| Tags generator | `mpr-project/generate-tags.js` |

## Checklist

```
Task Progress:
- [ ] Step 0: Inventory updates/ (open unfamiliar folders)
- [ ] Classify every item
- [ ] Compare to inventory.md, sale-inventory.md, assignment.md, onboarding-photo-index.md, photos/
- [ ] Gap report — summary MD, photo index, photos per cluster
- [ ] Ask blocking questions; wait
- [ ] Merge 1a/1b/2 (assign MPR/LOT at merge)
- [ ] File photos into photos/ and git add them
- [ ] regenerate mpr-tags.html if needed
- [ ] Verify project-files file count
- [ ] Archive updates/; leave updates/.gitkeep
- [ ] Branch session-YYYY-MM-DD-<topic>, commit, push, gh pr create --base main
- [ ] CE re-seed / skill-reinstall reminder
```

## Classify

| Kind | Examples | Action |
|------|----------|--------|
| Session deltas | `session-updates*.md` | Step 1b merge into Target files |
| Session narrative | `session-summary-*.md` | Extract facts; same merge rules; archive |
| Full project file | `inventory.md` etc. matching a project-files name | Step 1a mtime replace |
| Photo index fragment | tables targeting `onboarding-photo-index.md` | Merge into that file |
| Photos | `.jpg`/`.jpeg`/`.png`/`.webp`, including nested extract folders | File under `photos/` and git-add |
| Skill source | `SKILL.md`, `manifest.json`, `README.md` with skill `name:` | Step 2 |
| New-skill proposal | skill-like doc that matches no SKILL-00N | Ask; do not invent a folder |
| Not intake | `*.agent.md` samples, `update-process-additions.md`, this skill | Ignore or archive only — do not treat as instruments |
| Unknown | anything else | Read 2–3 files, then ask |

Dedupe nested extracts (`Folder-1-001/Folder/...` vs `Folder/...`) by filename; keep one copy.

## Compare

Against `inventory.md` / `sale-inventory.md`:

- Serials (normalize spaces; `✅`/`📷`/`⚠️` do not change identity)
- Brand + model + type
- Existing `MPR-###` / `LOT-###` mentioned in the inbox
- Photo filenames already listed in `onboarding-photo-index.md`

Flag: already onboarded (update vs duplicate), serial collision, LOT vs fleet mix-up, fleet→LOT items still filed under the old MPR.

## Gaps and questions

**Blocking** (do not merge that cluster):

- New instrument/LOT with photos but no summary and no session-updates
- Photo index filenames not on disk (after timestamp-suffix matching)
- Summary/index that names photos you cannot find
- Ambiguous target row (two possible MPR IDs)
- `SKILL.md` whose `name:` matches no existing skill

**Ask, then proceed if they waive:**

- Photos with no index — offer to draft the index from filenames + image reads
- Summary without photos — file facts, leave photo gap in the index
- Play-test / condition still open — merge identity, keep condition Unknown/Unassessed
- Tag list that says "to print" — do **not** write `tag-log.md` until printed
- `MPR-TBD` / `LOT-TBD` — propose the next free ID from live files and confirm
- Named-student tags visible in photos — crop/hold before any public listing use

Questions should be specific: cite paths, serials, and the two records that collide.

## Merge rules (do not relax)

- `MPR-TBD` → next free `MPR-###` from `inventory.md` at merge. Never trust a CE-suggested next ID.
- `LOT-TBD` → next free `LOT-###` from `sale-inventory.md`.
- Apply session-updates entries in chronological order across files.
- Photo-index entries **must** be merged; filenames must not stay chat-only.
- Stop and ask if an entry's target row cannot be found.
- Do not put inbox markdown artifacts into `project-files/`.

## Photos (git)

`photos/` is the git source of truth for intake and listing shots. Claude Marketplace / CE listing skills **`present_files`** these so a listing can be posted with the actual images — not Drive filenames.

1. Assign/confirm ID first if the cluster is new.
2. Copy into `photos/MPR-###/` or `photos/LOT-###/` (or `photos/_pending/<slug>/` if ID is blocked).
3. Keep original filenames. No student names in folder names.
4. Update `onboarding-photo-index.md` with repo-relative paths (`photos/MPR-034/PXL_….jpg`).
5. **`git add` the new files.** Never gitignore `photos/`.
6. Do **not** copy the whole tree into the 15-file CE seed. Bundle selected LOT folders into a marketplace skill package (or a dedicated photo upload) when posting from Claude.
7. Historical `intrument-pics/` is an unfiled local dump (~1.7 GB). File from it into `photos/<ID>/` when ingesting; do not commit the dump folder as-is.

GitHub warns at 50MB/file and blocks at 100MB. Ordinary phone photos are fine. If the `photos/` tree grows past a painful clone, add Git LFS then — it is not installed in this environment today.

## Git (required)

```
session-YYYY-MM-DD-<short-topic>
```

Example: `session-2026-08-20-heimer-trumpet`

1. `git checkout -b` that name from up-to-date `main` (fast-forward if needed; do not commit ingest to `main`). If already on a session/marketplace branch the user named, stay on it.
2. Stage the intended set: project-files, **`photos/`**, `skills/SKILL-00N-*` if touched, `landing-zone/archive/`, cleared `updates/`, process docs if you had to fix them. Exclude secrets and unrelated dirty files (`_crops/`, unfiled `intrument-pics/`, etc.).
3. Commit (why-focused message). Push `-u origin HEAD`.
4. `gh pr create --base main` — use the session summary / gap resolution as the PR body.
5. Do not force-push. Do not merge the PR unless the user asked to merge.

Invoking `@admin-ingest` **is** approval to commit and open the PR. It is not approval to merge the PR.

## Afterward

If `mpr-project/project-files/` changed: remind to re-seed CE.
If `skills/SKILL-00N-*` changed: remind to rebuild/reinstall that package.
Personal Claude interim through Sep 2026: still remind; full CE reseed when Enterprise usage resets.
