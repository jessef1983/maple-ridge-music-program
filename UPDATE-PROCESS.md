# Update Process — LOCKED IN

**Rule zero: before touching any existing folder, open it and read what's inside. Never assume a folder is clutter because its name is unfamiliar or its timestamp is old. This document exists because that rule was broken once already (Aug 14 — see Incident Log at bottom).**

---

## Real, Confirmed File Locations

```
C:\jf-devops\maple-ridge-music-program\
├── updates\                                          ← Inbox. User drops new files here.
├── landing-zone\
│   └── archive\                                      ← Everything superseded goes here, dated.
├── mpr-project\
│   ├── generate-tags.js                              ← Local dev tool. Run from here: `node generate-tags.js`. NOT uploaded.
│   ├── tags-template.html                            ← Master template for generate-tags.js. NOT uploaded.
│   └── project-files\                                ← Deployment folder. Exactly 13 files. Nothing else, ever.
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
    ├── archives\                                      ← Superseded .skill package builds only
    │   ├── instrument-inventory-management-1.0.0.skill
    │   ├── instrument-sales-1.0.0.skill
    │   └── instrument-purchase-1.0.0.skill
    └── instrument-inventory-management-2.0.0.skill    ← CURRENT build, root of skills/. One per skill, latest version only.
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

### Step 1: Data files → project-files/
```
For each file in /updates/ that matches a project-files/ filename:
  compare mtime: /updates/FILE vs project-files/FILE
  if /updates/ is newer → cp /updates/FILE → project-files/FILE
  else → skip
```
Applies to: `assignment.md`, `inventory.md`, `sale-inventory.md`, `students.md`, `watchlist.md`,
and the reference docs (`README.md`, `CLAUDE.md`, `GETTING_STARTED.md`, `ROUTING.md`,
`PROJECT_DESCRIPTION.md`, `model-reference.md`, `onboarding-photo-index.md`).

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

### Step 3: Regenerate dynamic files
```
Run (from mpr-project/): node generate-tags.js
→ reads project-files/inventory.md, writes project-files/mpr-tags.html fresh
```
`generate-tags.js` and `tags-template.html` are local dev tools — they live in `mpr-project/`,
never in `project-files/`, and are never uploaded to Claude Enterprise (it doesn't execute code;
it only reads files). `mpr-tags.html` is the one artifact that DOES belong in `project-files/` —
it's served directly to users via `present_files` for the Instrument Tagging workflow. It is never
hand-edited and never carried over from a previous session — it is always freshly generated in
this step, every time inventory.md changes.

### Step 4: Archive the session's clutter
Move to `landing-zone/archive/session-docs-YYYY-MM-DD/`:
- any `session-summary-*.md`, `research-quality-audit-*.md`, `HANDOFF-*.md` produced this session
- the previous `mpr-tags.html` if one was sitting in project-files/ (shouldn't be, per Step 3)
- the contents of `/updates/` once fully merged (copy to `landing-zone/archive/updates-YYYY-MM-DD/`, then clear `/updates/`)

### Step 5: Verify — run the checklist below before saying "done"

---

## project-files/ — exactly 13 files, nothing else

```
✅ assignment.md          ✅ CLAUDE.md
✅ inventory.md           ✅ GETTING_STARTED.md
✅ sale-inventory.md      ✅ PROJECT_DESCRIPTION.md
✅ students.md            ✅ README.md
✅ watchlist.md           ✅ ROUTING.md
✅ mpr-tags.html          ✅ model-reference.md
                          ✅ onboarding-photo-index.md

❌ NEVER: .skill files (belong in skills/ root, never project-files/)
❌ NEVER: generate-tags.js / tags-template.html (local dev tools — belong in mpr-project/, one level up.
          Claude Enterprise doesn't execute code, so these have no purpose in the upload.)
❌ NEVER: mpr-tags.html left over from a prior session (regenerate, don't carry forward)
❌ NEVER: session-summary-*.md / HANDOFF-*.md / research-quality-audit-*.md (archive immediately)
```

The user's deploy process is: **delete project-files/ entirely, then upload it fresh.** That means
anything sitting in project-files/ at the moment of upload IS going to Enterprise. If it's not on
the list of 13 above, it doesn't belong there — no exceptions, no "just this once" reference docs,
no local tooling (Claude Enterprise reads files, it doesn't execute them).

---

## Verification Checklist (run every time, before declaring done)

```
[ ] project-files/ contains exactly the 13 files listed above — count them
[ ] Every data file in project-files/ has the SAME mtime as its /updates/ source (if one existed)
[ ] mpr-tags.html was freshly regenerated this session (check its mtime is TODAY)
[ ] skills/ root contains exactly 3 .skill files — one per SKILL-00N folder, all "latest"
[ ] Every SKILL-00N-*/manifest.json version number matches its .skill package filename
[ ] Every superseded .skill build has been moved to skills/archives/
[ ] No stray folders exist: no mpr-project/skills/, no skills/instrument-inventory/ (unnumbered)
[ ] /updates/ has been archived or cleared
[ ] Session docs (summaries, audits, handoffs) archived to landing-zone/archive/, not left in project-files/
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
