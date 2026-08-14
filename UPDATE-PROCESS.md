# Update Process — LOCKED IN

**Rule zero: before touching any existing folder, open it and read what's inside. Never assume a folder is clutter because its name is unfamiliar or its timestamp is old. This document exists because that rule was broken once already (Aug 14 — see Incident Log at bottom).**

---

## Real, Confirmed File Locations

```
C:\jf-devops\maple-ridge-music-program\
├── updates\                                          ← Inbox. User drops new files here — manual file replacements AND session-updates.md from CE.
├── landing-zone\
│   └── archive\                                      ← Everything superseded goes here, dated.
├── mpr-project\
│   ├── generate-tags.js                              ← Local dev tool. Run from here: `node generate-tags.js`. NOT uploaded.
│   ├── tags-template.html                            ← Master template for generate-tags.js. NOT uploaded.
│   └── project-files\                                ← Deployment folder. Exactly 14 files. Nothing else, ever.
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
    │   └── manifest.json
    ├── archives\                                      ← Superseded .skill package builds only
    │   ├── instrument-inventory-management-1.0.0.skill
    │   ├── instrument-inventory-management-2.0.0.skill
    │   ├── instrument-sales-1.0.0.skill
    │   └── instrument-purchase-1.0.0.skill
    ├── instrument-inventory-management-2.1.0.skill    ← CURRENT build. One per skill, latest version only.
    ├── instrument-sales-1.1.0.skill
    ├── instrument-purchase-1.1.0.skill
    └── coupa-expense-reconciliation-1.0.0.skill
```

**Naming convention for packages:** `<skill-slug>-<version>.skill`, matching the slug used in `manifest.json`'s changelog. Do not invent a new slug (e.g. don't build `instrument-inventory.skill` when the established name is `instrument-inventory-management`).

**There is no `mpr-project/skills/` folder. There is no `skills/instrument-inventory/` folder (singular, unnumbered).** If either is ever found to exist, it is a mistake — merge its content into the correct `SKILL-00N-*` folder and delete it.

---

## Process (Every Update)

### Step 0: Inventory before acting
Before moving, deleting, or archiving ANYTHING:
```
For each top-level folder/file you don't immediately recognize:
  → open it, read 2-3 files inside
  → identify what it actually is
  → THEN decide: current / stale / misplaced / genuinely obsolete
```
Never label something "clutter" from the name and timestamp alone.

### Step 1a: Manual full-file replacements → project-files/
```
For each file in /updates/ that matches a project-files/ filename (a manual edit, not a CE session artifact):
  compare mtime: /updates/FILE vs project-files/FILE
  if /updates/ is newer → cp /updates/FILE → project-files/FILE
  else → skip
```
Applies to: `assignment.md`, `inventory.md`, `sale-inventory.md`, `students.md`, `watchlist.md`, `tag-log.md`,
and the reference docs (`README.md`, `CLAUDE.md`, `GETTING_STARTED.md`, `ROUTING.md`,
`PROJECT_DESCRIPTION.md`, `model-reference.md`, `onboarding-photo-index.md`).

### Step 1b: session-updates.md → merge deltas into project-files/
Claude Enterprise can't edit the uploaded project files in place, so as of 2026-08-14 every skill records
changes made during a chat session as dated entries in `session-updates.md` (format: timestamp, skill/workflow
origin, target file, the literal row/field to apply) instead of handing back a whole regenerated file. The
user downloads that one file per CE session and drops it in `/updates/`.
```
If /updates/session-updates.md exists:
  → read every dated entry in chronological order
  → for each entry: open its Target file in project-files/, and apply the change exactly as described
    (append the given row, or update the given field) — don't reinterpret or "clean up" the entry's content,
    it's already the literal row the skill produced
  → if an entry is ambiguous or its target row can't be found (e.g. an MPR ID that doesn't exist), stop and
    ask the user rather than guessing where it goes
  → once every entry is applied, archive session-updates.md to landing-zone/archive/session-docs-YYYY-MM-DD/
    (per Step 4) rather than deleting it — it's the audit trail for what changed and why
```
A `session-updates.md` entry whose `Target file` is `tag-log.md` or `inventory.md`'s reconciliation block
follows the same apply-literally rule — these aren't hand-written project files with their own step, they're
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

### Step 4: Archive the session's clutter
Move to `landing-zone/archive/session-docs-YYYY-MM-DD/`:
- any `session-summary-*.md`, `research-quality-audit-*.md`, `HANDOFF-*.md` produced this session
- the previous `mpr-tags.html` if one was sitting in project-files/ (shouldn't be, per Step 3)
- the contents of `/updates/` once fully merged (copy to `landing-zone/archive/updates-YYYY-MM-DD/`, then clear `/updates/`)

### Step 5: Verify — run the checklist below before saying "done"

---

## project-files/ — exactly 14 files, nothing else

```
✅ assignment.md          ✅ CLAUDE.md
✅ inventory.md           ✅ GETTING_STARTED.md
✅ sale-inventory.md      ✅ PROJECT_DESCRIPTION.md
✅ students.md            ✅ README.md
✅ watchlist.md           ✅ ROUTING.md
✅ tag-log.md             ✅ model-reference.md
✅ mpr-tags.html          ✅ onboarding-photo-index.md

❌ NEVER: .skill files (belong in skills/ root, never project-files/)
❌ NEVER: generate-tags.js / tags-template.html (local dev tools — belong in mpr-project/, one level up.
          Claude Enterprise doesn't execute code, so these have no purpose in the upload.)
❌ NEVER: mpr-tags.html left over from a prior session (regenerate, don't carry forward)
❌ NEVER: session-summary-*.md / HANDOFF-*.md / research-quality-audit-*.md (archive immediately)
❌ NEVER: an unmerged session-updates.md sitting in project-files/ — it belongs in /updates/ until
          merged (Step 1b), then archived (Step 4); it is never itself a project-files/ file
```

The user's deploy process is: **delete project-files/ entirely, then upload it fresh.** That means
anything sitting in project-files/ at the moment of upload IS going to Enterprise. If it's not on
the list of 14 above, it doesn't belong there — no exceptions, no "just this once" reference docs,
no local tooling (Claude Enterprise reads files, it doesn't execute them).

---

## Verification Checklist (run every time, before declaring done)

```
[ ] project-files/ contains exactly the 14 files listed above — count them
[ ] Every data file in project-files/ has the SAME mtime as its /updates/ source (if one existed)
[ ] If /updates/session-updates.md existed, every dated entry was applied to its Target file — not just copied verbatim into the wrong place
[ ] mpr-tags.html was freshly regenerated this session, AFTER any tag-log.md/assignment.md merges (check its mtime is TODAY)
[ ] skills/ root contains exactly 4 .skill files — one per SKILL-00N folder, all "latest"
[ ] Every SKILL-00N-*/manifest.json version number matches its .skill package filename
[ ] Every superseded .skill build has been moved to skills/archives/
[ ] No stray folders exist: no mpr-project/skills/, no skills/instrument-inventory/ (unnumbered)
[ ] /updates/ has been archived or cleared
[ ] Session docs (summaries, audits, handoffs, and any merged session-updates.md) archived to landing-zone/archive/, not left in project-files/
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
