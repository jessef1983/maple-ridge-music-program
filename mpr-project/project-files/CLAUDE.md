# Maple Ridge Music Program — Claude Enterprise Guide

## Project Overview

The **Maple Ridge Music Program** is a complete management system for Maple Ridge School's music program (Ulster Park, NY). It tracks 83 students across grades 2–12, manages a fleet of 49 program-owned + 2 borrowed instruments, logs assignments and service records, and handles the disposal pipeline for surplus instruments.

Instead of juggling files, users work through **skills** — guided workflows that update the right files and keep everything consistent.

---

## Folder Structure (this upload)

This is a flat folder — everything here is uploaded together to Claude Enterprise, with no subfolders:

```
project-files/
├── assignment.md              # Who has what: active & historical assignments
├── inventory.md                # Fleet instruments: MPR-###, serials, costs, service history
├── sale-inventory.md          # Disposal pipeline: LOT-### items for sale
├── students.md                 # Roster of all 83 students
├── repertoire.md                # Concert band music library: REP-### owned, programmed, rejected
├── watchlist.md                 # Purchase candidates under evaluation (WATCH-### IDs)
├── tag-log.md                   # Log of every permanent/student tag print event
├── model-reference.md          # Instrument brands/models reference
├── onboarding-photo-index.md   # Onboarding photo folder index
├── mpr-tags.html                # Tag printer (generated; served to users, never hand-edited)
├── README.md                    # Quick start
├── GETTING_STARTED.md           # User guide & workflow descriptions
├── PROJECT_DESCRIPTION.md       # High-level overview
├── ROUTING.md                   # Which skill to use when
└── CLAUDE.md                    # This file
```

The five skills that drive the workflows below (`Instrument Inventory Management`, `Instrument Sales`, `Instrument Purchase`, `Coupa Expense Reconciliation`, `Music Purchase`) are uploaded **separately** as `.skill` packages — they are not part of this folder. Their source lives in the repo under `skills/SKILL-00N-*/`.

`generate-tags.js` and `tags-template.html` are **not** part of this upload — they're local dev tools (see below).

---

## Key Files

### Data Files

All data lives in nine files. Skills read and write to these automatically, but they're also human-readable:

**Core Program Data:**
- **`students.md`** — 83 students, grades 2–12, status, birthday
- **`inventory.md`** — Fleet assets: 49 MPR-### + 2 MNT-### instruments, serials, costs, service history
- **`assignment.md`** — Active & historical: who has what, dates, condition
- **`sale-inventory.md`** — Disposal pipeline: LOT-### items held for sale (separate from fleet)

**Purchase & Acquisition:**
- **`watchlist.md`** — Candidate listings under evaluation (WATCH-### IDs); closed auctions kept for comp data
- **`model-reference.md`** — Instrument model bands, price ranges, brand families, sticky-valve traps, finish gotchas

**Repertoire:**
- **`repertoire.md`** — Concert band music library: REP-### titles owned, programming history, deliberately rejected titles, and standing library gaps. Started empty on 2026-08-14 — an absent title is not proof the program never owned it

**Onboarding:**
- **`onboarding-photo-index.md`** — Index of intake photos per instrument, no student names in paths

**Tagging:**
- **`tag-log.md`** — Log of every permanent and student tag print event; drives the outstanding-tag flag in `mpr-tags.html`

**Why markdown?**
- Human-readable and searchable
- Version control–friendly (clean diffs, no binary formats)
- Bulk-uploadable to Claude Enterprise
- Easy to audit (no hidden state)

### Skills

Five separate skill packages, uploaded alongside this project:

- **Instrument Inventory Management** — 6 core workflows:
  1. **Student Assignment** — Assign instrument to student
  2. **Instrument Tagging** — Print tags for new/reassigned instruments
  3. **Instrument Onboarding** — Log new instrument at intake
  4. **Instrument Maintenance** — Record repairs or service
  5. **Grade Progression** — Annual grade bump & manage graduates
  6. **Instrument Removal** — Mark sold/retired/external and retire MPR ID

- **Instrument Sales** — Sales workflow:
  - Decide what should go, identify it, price it, list it, ship it
  - Hands off to Instrument Removal once a fleet instrument's sale closes

- **Instrument Purchase** — Purchase evaluation & acquisition:
  - Decides whether the program actually needs an instrument
  - Reads listings for verifiable facts (not marketing claims)
  - Calculates landed cost (price + shipping + tax)
  - Tracks bidding, auctions, return windows
  - Hands off to Instrument Onboarding (Workflow 1) when the box arrives

- **Coupa Expense Reconciliation** — Ties money already spent back to the record:
  - Searches Coupa with verified `coupa_graphql` query patterns (see the skill's `references/coupa-api-expense-search-guide.md` — improvised query syntax fails against this connector)
  - Matches a Coupa expense report/invoice line to instruments in `inventory.md` or titles in `repertoire.md`
  - Splits shared shipping/tax across multi-item purchases
  - Flags cost or vendor variance against the recorded landed cost
  - Never logs unfiltered query results — they span the whole organization, not just this program
  - Requires an active Coupa MCP connection

- **Music Purchase** — Concert band repertoire selection:
  - Establishes the current ensemble before opening any catalog
  - Evaluates a piece against this band's instrumentation, ranges, exposed parts, and percussion — not the published grade alone
  - Scores candidates and returns a ranked shortlist with BUY / CONSIDER / STRETCH / PASS
  - Records purchased titles as `REP-###` in `repertoire.md`
  - Hands off to Coupa Expense Reconciliation for what was actually paid

### Tag Printer (`mpr-tags.html`)

An interactive tag builder for Avery 5874 (3.5" × 2", 2 across, 5 down).

**Features:**
- Pick instruments from the dropdown (auto-populated from `inventory.md`)
- Choose instrument or student tags
- Print calibration controls (for HP M479fdw)
- Print at 100% actual size (not "fit to page")
- **Outstanding-tag flag** — an instrument with no permanent tag logged, or an active assignment whose student tag predates it, shows "⚠️ NEEDS TAG" right in the dropdown, with the reason in the on-screen warning once selected (see `tag-log.md`)

**How to use:**
1. Claude serves this file directly via `present_files` when a user asks to print tags
2. User downloads and opens it in a browser (buttons don't work in the chat preview)
3. Select an instrument, place it on the sheet, print at actual size

**This file is generated, not hand-edited.** It's regenerated locally before each upload — see below.

### Regenerating tags (local tool, not part of this upload)

`generate-tags.js` and `tags-template.html` live in `mpr-project/`, one level up from this folder — they are **not** uploaded to Claude Enterprise, which reads files but doesn't execute code.

**Usage (run locally from `mpr-project/`):**
```bash
node generate-tags.js
```
This reads `project-files/inventory.md`, `tag-log.md`, and `assignment.md`, merges the fleet into `tags-template.html`, and writes the result to `project-files/mpr-tags.html` — including the outstanding-tag flag on each instrument. Run it any time the fleet, tag log, or assignments change, before the next upload or print run.

---

## Recording changes made during a Claude Enterprise session

Claude Enterprise reads this project's files during a chat but can't edit them in place — nothing a skill "writes" during a conversation is real until it's back in this folder in the repo. As of 2026-08-14, every skill records changes as dated entries in `session-updates.md` (a running artifact for the whole conversation) instead of handing back an entire regenerated file. The user downloads that one file, drops it in `/updates/`, and Claude Code merges each entry into the correct file here — see `UPDATE-PROCESS.md` Step 1b for the exact merge process. `session-updates.md` is never itself one of this folder's 15 files; it's an inbox artifact, archived once merged.

---

## Data Schema & Conventions

### Instruments (inventory.md)

Each instrument is tracked with:
- **MPR ID** — Maple Ridge Program ID, never reused (MPR-001, MPR-002, etc.). `MNT-###` denotes an instrument borrowed from MNT Academy — tracked, not disposable.
- **Type** — Trumpet, Flute, Euphonium, French Horn, Percussion, Strings
- **Model** — Brand and model (e.g., Yamaha YEP-201M)
- **Serial** — Verified from instrument (✅), from listing photo (📷), or partial (⚠️)
- **Landed Cost** — Total acquisition cost (shipping, tax, fees included)
- **Status** — Owned, In transit, In service, External, Sold, Retired
- **Condition** — Excellent, Good, Fair, Project, Unknown

Holder/location is tracked in `assignment.md`, not duplicated in `inventory.md`.

### Assignments (assignment.md)

Each assignment row is:
- **ASGN ID** — Assignment number (ASGN-001, ASGN-002, etc.)
- **MPR ID** — Which instrument
- **Student** — Who has it (from `students.md`)
- **Date Out** — When the student received it
- **Condition Out** — Instrument's condition when handed to student (baseline for wear assessment)
- **Notes** — Relevant info (e.g., "sticky valves, oil trial", "return by Sep 4")

**Active assignments** stay in the "Active" section. When a student returns an instrument, the row is closed with:
- **Date In** — When it was returned
- **Condition In** — What condition it came back in
- **Reason** — Why (Graduated, Stepped back, Returned for service, etc.)

The row then moves to "Assignment history" (closed assignments).

### Serial Markers

- **✅** Verified directly from the instrument
- **📷** Read from a listing photo, not yet verified on the physical instrument
- **⚠️** Partial or unconfirmed (e.g., missing one digit)

### Tag Log (tag-log.md)

One row per tag print event — never overwritten, so the log accumulates every printing over time:

| MPR ID | Tag Type | Date Printed | Notes |
|---|---|---|---|

- **Tag Type** is `Permanent` (sealed exterior tag, printed once) or `Student` (interior tag, reprinted per assignment) — exact casing matters, `generate-tags.js` matches on it literally.
- **Date Printed** must be ISO `YYYY-MM-DD` — the outstanding-tag flag compares it against `assignment.md`'s Date Out chronologically, which silently fails to flag staleness on a non-ISO date.
- `generate-tags.js` uses only the **latest** row per MPR ID + Tag Type when computing the flag.
- This file started empty on 2026-08-14 — it has no history of tags printed before that date, so every instrument shows as needing a permanent tag until logged or manually backfilled.

---

## Workflow: Adding a New Instrument

1. **Acquire instrument** (eBay, Reverb, retailer, etc.)
2. **Run Instrument Onboarding skill**
   - Assign next MPR ID
   - Record serial, model, landed cost, acquisition source
   - Assess condition
   - Creates row in `inventory.md`
3. **Regenerate tags locally:** `node generate-tags.js` (from `mpr-project/`)
4. **Print tags**
   - Open `mpr-tags.html` in browser
   - New instrument appears in dropdown
   - Pick it, place on sheet, print

---

## Workflow: Assigning to a Student

1. **Run Student Assignment skill**
   - Pick student from `students.md`
   - Select instrument from `inventory.md`
   - Enter condition baseline
   - Creates assignment row in `assignment.md`
2. **Print student tag** (same tag printer)
3. **Done** — Instrument is now active with that student

---

## Workflow: Updating This Upload

Full process lives in `UPDATE-PROCESS.md` at the repo root. Summary:

1. Merge anything in `/updates/` into the matching file here — manual full-file replacements by mtime, AND any `session-updates.md` from a CE session, applied entry by entry
2. Merge skill file updates into the matching `skills/SKILL-00N-*/` folder, rebuild the `.skill` package
3. Regenerate `mpr-tags.html` locally (`node generate-tags.js`), after Step 1 so tag-log.md merges are reflected
4. Archive session clutter (summaries, handoffs, audits, merged `session-updates.md`) to `landing-zone/archive/`
5. Verify this folder holds exactly the 15 files listed above, nothing else
6. Delete this folder entirely and re-upload it fresh — anything sitting here at upload time goes to Enterprise
7. **Reminder:** re-upload project-files/ and/or reinstall any updated `.skill` package in Claude Enterprise — nothing here takes effect there until it does

---

## File Ownership & Maintenance

- **Data files** — Updated by skills automatically. Can be edited directly, but skills are safer.
- **Skill files** — Prompts for Claude. Update with new workflows as needed; live in `skills/SKILL-00N-*/`, not here.
- **`mpr-tags.html`** — Generated; regenerate with `generate-tags.js` (in `mpr-project/`) whenever `inventory.md` changes. Never hand-edited, never carried over from a prior session.
- **Docs** — Reference material, updated as needed.

---

## Common Tasks

### Regenerate tags after adding instruments
```bash
node generate-tags.js
```
(run from `mpr-project/`)

### Find all instruments assigned to a student
Open `assignment.md`, search for student name.

### Check instrument service history
Open `inventory.md`, find MPR ID, scroll to "Service records" section.

### List all instruments in storage
Open `inventory.md`, find "Storage" section.

---

## Contact & Support

**Program Administrator:** Maple Ridge School, Ulster Park, NY
**Phone:** (845) 339-6681

---

## Revision History

- **2026-08-14** (4th update) — Added the fifth skill, **Music Purchase** (`SKILL-005`), and `repertoire.md` as the 15th project file: concert band repertoire chosen from the actual ensemble rather than the published grade, with `REP-###` titles, programming history, and reusable rejection reasons. Rewired the concierge — "Music Purchasing" was a Tier-2 stub still describing eBay/Reverb *instrument* buying, which is `instrument-purchase`'s job. Bumped **Coupa Expense Reconciliation to 1.1.0** with live-verified `coupa_graphql` query patterns after the skill kept failing against the connector: it named the MCP tools but taught no query syntax, so Relay-style `first:`/`filters:`, dotted nested-field filters, and `~`/`[c]=` wildcards were being improvised — all of which throw internal server errors rather than returning empty. Also documented that the `query` filter is exact-match only, that no-argument queries default to ascending `id` (making recent reports look missing), and a new data-boundary rule: an unfiltered `expenseReports` query returns cross-organization expense data and must never be logged or written to `session-updates.md`.
- **2026-08-14** (3rd update) — Added `tag-log.md` (14th project file) and the outstanding-tag flag in `mpr-tags.html`; fixed an off-by-one bug in `generate-tags.js` that silently dropped the first row of the fleet table (MPR-001) from every generated tag file. Documented the `session-updates.md` protocol: all four skills now record CE-session changes as dated deltas instead of regenerating whole files, since Claude Enterprise can't edit project files in place. Reworded the concierge picker options as "Get Started with ___" in `ROUTING.md`/`GETTING_STARTED.md` so CE chats get a readable name instead of a generic one.
- **2026-08-14** (2nd update) — Added the fourth skill, Coupa Expense Reconciliation (converted from a technical integration spec into the conversational workflow format used by the other three).
- **2026-08-14** (1st update) — Rewrote to match the current flat `project-files/` upload structure and all 3 skills (previously documented a nested `data/`/`skills/`/`tools/`/`docs/` layout that no longer existed). Moved `generate-tags.js`/`tags-template.html` out of the upload into `mpr-project/` as local-only tooling; fixed a stale off-by-one column bug in `generate-tags.js` that was silently producing 0 tagged instruments.
- **2026-08-13** (2nd update) — Added Music Purchasing skill, watchlist tracking, NYSSMA event data & sheet music inventory. Updated CLAUDE.md with new skills & data files.
- **2026-08-13** (1st update) — Restructured for Claude Enterprise: folder organization, tag generation automation, CLAUDE.md documentation.
- **2026-08-10** — Initial landing-zone commit with all core skills and data files.
