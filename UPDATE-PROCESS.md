# Update Process — LOCKED IN

**Rule zero: before touching any existing folder, open it and read what's inside. Never assume a folder is clutter because its name is unfamiliar or its timestamp is old. This document exists because that rule was broken once already (Aug 14 — see Incident Log at bottom).**

---

## Real, Confirmed File Locations

**How to run this process:** invoke **`@admin-ingest`** in Cursor, Copilot, or Claude Code (`.github/agents/admin-ingest.agent.md`). The agent audits `updates/`, compares to inventory, asks about missing summary / photo index / photos, files photos into git, then executes the steps below and opens a PR. Do not skip the gap check.

```
C:\jf-devops\maple-ridge-music-program\
├── updates\                                          ← Inbox. User drops new files here — manual file replacements AND session-updates*.md from CE.
├── photos\                                           ← Git-tracked per-MPR / per-LOT photos (marketplace `present_files`). Not in the 15-file CE seed.
│   └── _pending\                                     ← Photos waiting for an assigned ID
├── landing-zone\
│   └── archive\                                      ← Everything superseded goes here, dated.
├── .github\agents\admin-ingest.agent.md                    ← Copilot/Cursor/Claude local ingest agent
├── mpr-project\
│   ├── generate-tags.js                              ← Local dev tool. Run from here: `node generate-tags.js`. NOT uploaded.
│   ├── tags-template.html                            ← Master template for generate-tags.js. NOT uploaded.
│   └── project-files\                                ← Deployment folder. Exactly 15 files. Nothing else, ever.
└── skills\                                            ← ALL skill material lives here. Nowhere else.
    ├── SKILL-001-Instrument-Inventory-Management\     ← Source folder for skill 1
    │   ├── SKILL.md
    │   ├── README.md
    │   └── manifest.json
    ├── SKILL-002-Instrument-Sales\                    ← Source folder for skill 2
    │   ├── SKILL.md
    │   ├── README.md
    │   └── manifest.json
    ├── SKILL-003-Instrument-Purchase\                 ← Source folder for skill 3
    │   ├── SKILL.md
    │   ├── README.md
    │   └── manifest.json
    ├── SKILL-004-Coupa-Expense-Reconciliation\        ← Source folder for skill 4 (needs Coupa MCP connection)
    │   ├── SKILL.md
    │   ├── README.md
    │   ├── manifest.json
    │   └── references\
    │       └── coupa-api-expense-search-guide.md      ← Live-verified Coupa query patterns. Ships INSIDE the package.
    ├── SKILL-005-Music-Purchase\                      ← Source folder for skill 5
    │   ├── SKILL.md
    │   ├── README.md
    │   └── manifest.json
    ├── archives\                                      ← Superseded .skill package builds only
    │   ├── instrument-inventory-management-1.0.0.skill
    │   ├── instrument-inventory-management-2.0.0.skill
    │   ├── instrument-sales-1.0.0.skill
    │   ├── instrument-purchase-1.0.0.skill
    │   └── coupa-expense-reconciliation-1.0.0.skill
    ├── instrument-inventory-management-2.1.0.skill    ← CURRENT build. One per skill, latest version only.
    ├── instrument-sales-1.1.0.skill
    ├── instrument-purchase-1.1.0.skill
    ├── coupa-expense-reconciliation-1.1.0.skill
    └── music-purchase-1.0.0.skill
```

**A skill folder may carry a `references/` subfolder** (SKILL-004 does). Those files ship inside the `.skill` package so it stays self-contained — never link out of the package with `../`.

**Naming convention for packages:** `<skill-slug>-<version>.skill`, matching the slug used in `manifest.json`'s changelog. Do not invent a new slug (e.g. don't build `instrument-inventory.skill` when the established name is `instrument-inventory-management`).

**There is no `mpr-project/skills/` folder. There is no `skills/instrument-inventory/` folder (singular, unnumbered).** If either is ever found to exist, it is a mistake — merge its content into the correct `SKILL-00N-*` folder and delete it.

---

## Process (Every Update)

Run via `@admin-ingest` unless the user is doing a tiny documented one-file edit.

### Step 0: Inventory before acting
Before moving, deleting, or archiving ANYTHING:
```
For each top-level folder/file you don't immediately recognize:
  → open it, read 2-3 files inside
  → identify what it actually is
  → THEN decide: current / stale / misplaced / genuinely obsolete
```
Never label something "clutter" from the name and timestamp alone.

### Step 0b: Audit, compare, gap check (ingest)

Before merging, classify every item in `/updates/` and compare serials / brands / IDs / photo filenames to `inventory.md`, `sale-inventory.md`, `assignment.md`, `onboarding-photo-index.md`, and `photos/`.

**Each intake cluster needs all three** (or an explicit user waiver):

1. **Summary MD** — `session-updates*.md` and/or `session-summary-*.md`
2. **Photo index** — filenames + what each shot shows (for `onboarding-photo-index.md`)
3. **Photos** — files on disk matching the index (match Pixel shots on the 9-digit timestamp when suffixes differ)

Stop and ask intelligent questions on collisions, missing pieces, `MPR-TBD`/`LOT-TBD` (propose the next free ID from live files — do not trust a CE-suggested next ID), nested duplicate extract folders, and tag lists that have not actually been printed (`tag-log.md` only after a real print).

Ignore `*.agent.md` samples and process-notes in the inbox — they are not instrument records.

### Step 1a: Manual full-file replacements → project-files/
```
For each file in /updates/ that matches a project-files/ filename (a manual edit, not a CE session artifact):
  compare mtime: /updates/FILE vs project-files/FILE
  if /updates/ is newer → cp /updates/FILE → project-files/FILE
  else → skip
```
Applies to: `assignment.md`, `inventory.md`, `sale-inventory.md`, `students.md`, `watchlist.md`, `tag-log.md`, `repertoire.md`,
and the reference docs (`README.md`, `CLAUDE.md`, `GETTING_STARTED.md`, `ROUTING.md`,
`PROJECT_DESCRIPTION.md`, `model-reference.md`, `onboarding-photo-index.md`).

### Step 1b: session-updates*.md → merge deltas into project-files/
Claude Enterprise can't edit the uploaded project files in place, so as of 2026-08-14 every skill records
changes made during a chat session as dated entries in a session-updates artifact (format: timestamp, skill/workflow
origin, target file, the literal row/field to apply) instead of handing back a whole regenerated file. The
user downloads that one file per CE session and drops it in `/updates/`.

**Expected filenames:** `session-updates-<chat-name-slug>.md` (preferred) or legacy `session-updates.md` /
`session-updates (N).md`. Match any `session-updates*.md` in `/updates/`.
```
If /updates/ contains session-updates*.md:
  → read every dated entry in chronological order (across files if several)
  → for each entry: open its Target file in project-files/, and apply the change
    - if the entry uses MPR-TBD (or omits ID for a new instrument): assign the next free MPR-###
      from inventory.md at merge time — never trust a CE-suggested next ID
    - otherwise apply exactly as described (append row / update field)
  → if an entry is ambiguous or its target row can't be found, stop and ask the user
  → photo-index entries targeting onboarding-photo-index.md must be merged (create section if missing)
  → once every entry is applied, archive the session-updates files to
    landing-zone/archive/updates-YYYY-MM-DD/ (per Step 4)
```
A session-updates entry whose `Target file` is `tag-log.md` or `inventory.md`'s reconciliation block
follows the same apply rule — these aren't hand-written project files with their own step, they're
just another target file an entry can point at.

### Step 2: Skill files → the matching SKILL-00N folder, in place
```
if /updates/SKILL.md exists:
  → identify WHICH skill it belongs to by reading its `name:` frontmatter field
  → find the matching skills/SKILL-00N-*/  folder (do NOT create a new one)
  → cp /updates/SKILL.md → skills/SKILL-00N-*/SKILL.md   (overwrite in place)
  → bump manifest.json "version", append a "changelog" entry describing what changed
  → build new package: Compress-Archive -Path "skills/SKILL-00N-*/*" -DestinationPath "skills/<slug>-<newversion>.skill"
  → move the OLD package version from skills/ root into skills/archives/
  → confirm skills/ root has exactly one .skill file per skill (the latest)
```
**A file in `/updates/` that doesn't match any existing SKILL-00N's `name:` frontmatter, or that arrives as a
free-form spec/design doc rather than SKILL.md/README.md/manifest.json, is a new-skill proposal, not an update.**
Do not force it into an existing folder or invent a folder silently. Confirm scope with the user first — new
skills sometimes need converting from a technical spec into the conversational workflow format the others use,
and not every proposal is actually runnable as an Enterprise project skill (e.g. one needing live web scraping
or SMS/webhook delivery can't run inside a skill at all — that's a candidate for parking as a proposal in
`landing-zone/archive/proposals/`, not for building). Once scoped and approved, create the next `SKILL-00N-*/`
folder, build its package, and add both to the file tree and checklists in this document.

### Step 3: Regenerate dynamic files
```
Run (from mpr-project/): node generate-tags.js
→ reads project-files/inventory.md, tag-log.md, and assignment.md
→ writes project-files/mpr-tags.html fresh, with instruments needing a tag flagged (⚠️ NEEDS TAG)
```
`generate-tags.js` and `tags-template.html` are local dev tools — they live in `mpr-project/`,
never in `project-files/`, and are never uploaded to Claude Enterprise (it doesn't execute code;
it only reads files). `mpr-tags.html` is the one artifact that DOES belong in `project-files/` —
it's served directly to users via `present_files` for the Instrument Tagging workflow. It is never
hand-edited and never carried over from a previous session — it is always freshly generated in
this step, every time `inventory.md`, `tag-log.md`, or `assignment.md` changes. Run this step
**after** Step 1/1b so the regenerated tag flags reflect any tag-log.md entries just merged in.

### Step 4: File photos

**Copy** (never move/delete) intake photos from `/updates/` or `intrument-pics/` into `photos/<MPR-###>/` or `photos/<LOT-###>/`, then **`git add` them**.
Unassigned IDs go to `photos/_pending/<slug>/` until Step 1b assigns the ID.
Keep original camera filenames; no student names in folder names.

**Index rules (required for every photo cluster):**
- `onboarding-photo-index.md` **Folder:** line must be exactly `` `photos/MPR-###/` `` or `` `photos/LOT-###/` `` (no brand suffix).
- Table filenames must be the **full** on-disk name (`PXL_….jpg`, `IMG_….jpg`). Do not leave bare 9-digit stems in new rows; expand CE shorthand at merge.
- `1000######.jpg` means a **non-Pixel camera** — record as missing until that export lands; do not invent Pixel names for them.
- Fleet→LOT (LOT-020 / LOT-021): keep files under the fleet `photos/MPR-###/` and say so on the Folder line.

Do not gitignore `photos/`. Do **not** `git add` photo binaries under `landing-zone/archive/` (markdown archive only). Do not dump `photos/` into the 15-file CE seed.
`intrument-pics/` is local-only (gitignored dump) — **copy** from it into `photos/`; never delete the dump during ingest.

### Step 5: Archive the session's clutter
Move to `landing-zone/archive/session-docs-YYYY-MM-DD/`:
- any `session-summary-*.md`, `research-quality-audit-*.md`, `HANDOFF-*.md` produced this session
- the previous `mpr-tags.html` if one was sitting in project-files/ (shouldn't be, per Step 3)
- the **markdown** contents of `/updates/` once fully merged (copy to `landing-zone/archive/updates-YYYY-MM-DD/`, then clear `/updates/`, leaving `updates/.gitkeep`)
- Inbox **photo binaries**: leave them out of git archive (already filed under `photos/`); do not double-commit jpgs into `landing-zone/archive/`

### Step 6: Verify — run the checklist below before saying "done"

### Step 7: Session branch and PR to main

Do **not** commit ingest merges on `main`.

- Branch: `session-YYYY-MM-DD-<short-topic>` (e.g. `session-2026-08-20-wfl-timpani`)
- Commit merged `project-files/`, `photos/`, `skills/SKILL-00N-*/` if touched, and the archive
- Push and open a PR into `main` (`gh pr create --base main`). Use the session summary / gap notes as the PR body
- Do not merge the PR unless the user asked to merge
- After merge (human): delete the local `project-files/` copy in CE and re-upload fresh from `mpr-project/project-files/` on `main`

---

## project-files/ — exactly 15 files, nothing else

```
✅ assignment.md          ✅ CLAUDE.md
✅ inventory.md           ✅ GETTING_STARTED.md
✅ sale-inventory.md      ✅ PROJECT_DESCRIPTION.md
✅ students.md            ✅ README.md
✅ watchlist.md           ✅ ROUTING.md
✅ tag-log.md             ✅ model-reference.md
✅ repertoire.md          ✅ onboarding-photo-index.md
✅ mpr-tags.html

❌ NEVER: .skill files (belong in skills/ root, never project-files/)
❌ NEVER: generate-tags.js / tags-template.html (local dev tools — belong in mpr-project/, one level up.
          Claude Enterprise doesn't execute code, so these have no purpose in the upload.)
❌ NEVER: mpr-tags.html left over from a prior session (regenerate, don't carry forward)
❌ NEVER: session-summary-*.md / HANDOFF-*.md / research-quality-audit-*.md (archive immediately)
❌ NEVER: an unmerged session-updates*.md sitting in project-files/ — it belongs in /updates/ until
          merged (Step 1b), then archived (Step 5); it is never itself a project-files/ file
```

The user's deploy process is: **delete project-files/ entirely, then upload it fresh.** That means
anything sitting in project-files/ at the moment of upload IS going to Enterprise. If it's not on
the list of 15 above, it doesn't belong there — no exceptions, no "just this once" reference docs,
no local tooling (Claude Enterprise reads files, it doesn't execute them).

---

## Verification Checklist (run every time, before declaring done)

```
[ ] project-files/ contains exactly the 15 files listed above — count them
[ ] Every data file in project-files/ has the SAME mtime as its /updates/ source (if one existed)
[ ] If /updates/session-updates*.md existed, every dated entry was applied (MPR-TBD → next free MPR-### at merge) — not just copied verbatim into the wrong place
[ ] mpr-tags.html was freshly regenerated this session, AFTER any tag-log.md/assignment.md merges (check its mtime is TODAY)
[ ] skills/ root contains exactly 5 .skill files — one per SKILL-00N folder, all "latest"
[ ] Every SKILL-00N-*/manifest.json version number matches its .skill package filename
[ ] Any references/ files are inside the built package (SKILL-004) — no ../ links out of a skill
[ ] Every superseded .skill build has been moved to skills/archives/
[ ] No stray folders exist: no mpr-project/skills/, no skills/instrument-inventory/ (unnumbered)
[ ] /updates/ has been archived or cleared (`.gitkeep` remains)
[ ] Session docs (summaries, audits, handoffs, and any merged session-updates*.md) archived to landing-zone/archive/, not left in project-files/
[ ] New photos are under `photos/<MPR-### or LOT-###>/` (or `_pending/`), indexed in `onboarding-photo-index.md`, and **git-added** (not left untracked)
[ ] Gap check ran: each merged cluster had summary MD, photo index, and photos — or the user waived a named gap
[ ] Changes are on `session-YYYY-MM-DD-<topic>` with a PR to `main` (not committed on `main`)
```

If any box fails, fix it before telling the user it's done. Do not report "ready for deployment"
against an unverified checklist.

---

## Incident Log

**2026-08-14 — Called the pre-existing skill source folders "clutter."**
`SKILL-001-Instrument-Inventory-Management/`, `SKILL-002-Instrument-Sales/`, and
`SKILL-003-Instrument-Purchase/` had existed since Aug 13 and were the actual, correct skill
source structure — each with its own SKILL.md, README.md, and manifest.json. Because their
folder names didn't match an assumption made mid-session, they were flagged for deletion and a
parallel, wrongly-named structure (`skills/instrument-inventory/SKILL.md`, a package called
`instrument-inventory.skill`) was built instead. The real SKILL-001/SKILL.md never got the Aug 14
governance rewrite until this was caught and corrected.

**Root cause:** skipped Step 0 (open and read before judging). Fixed by making Step 0 the first
line of this document, not a footnote.
