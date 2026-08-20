# Session Summary + Governance Review — August 19, 2026

**Pickup / goal:** Merge CE `/updates/` intake carefully, close the Aug 19 gaps review, and write governance so these drift patterns don’t repeat. **Do not change skills or rebuild packages in this wrap** — roll that into a later project/session.

**Date:** 2026-08-19 (evening wrap)

---

## Completed this session

- Merged Aug 19 wind/oboe intake (MPR-088–092), photo indexes, tag-print log for the 10-card sheet, and the CE gaps-review drop.
- Remapped colliding CE IDs (never trust CE next-ID). Fleet stays **78** owned + 2 MNT.
- Logged Aug 19 tag prints (010, 023×2, 026, 027×2, 029, 037, 082, 083). Regenerated `mpr-tags.html` (47 still flagged).
- Gaps review applied after verification: fleet category counts, vintage instruments into `assignment.md` storage tracking, WATCH-002 closed / 003–004 Landed, duplicate 9th-grade table removed (roster **74**), assignment IDs backfilled.
- Nigel King assigned **ASGN-038 / MPR-030** Dillon. Keith Woolston’s horn left **no MPR** until onboarded.
- Archived processed `/updates/` into `landing-zone/archive/updates-2026-08-19/`. Inbox empty at wrap.

---

## Still open / next

- **Keith Woolston’s French horn** — inventory/onboard before assigning an MPR ID.
- SVC-HRN-002 (MPR-030 3rd slide) stays flagged, not scheduled. SVC-HRN-003 (MPR-023 oil) still open.
- Play-tests: 088 corks, 089 Excellent bench, 091/092 Unknown, 087 Good confirm.
- Serials still pending on older fleet; MPR-016 purchase date; sales listings; SVC-TRB-002.
- **Deferred (another session):** fold the governance rules below into the next project-files reseed **and** into skill/concierge wording. Not implemented tonight.

---

## Key paths

- `mpr-project/project-files/` — inventory, assignment, students, watchlist, tag-log, onboarding-photo-index, mpr-tags.html, CLAUDE.md
- `mpr-project/generate-tags.js` — FAMILY_MAP + regenerate
- `landing-zone/archive/updates-2026-08-19/` — CE session-updates + photo dumps after merge
- This file — wrap + governance backlog

---

## What went wrong (patterns, not blame)

These gaps were not one bad merge. They were **cross-file invariants** that CE and Cursor both failed to keep, plus **inbox hygiene** that let stale artifacts look like new work.

| Gap | What happened | Why it survived |
|---|---|---|
| Fleet category counts | Table had 10 trumpets / 4 horns / 7 euphs / 12 perc; summary still said 8 / 3 / 8 / 10+ | Summary line is hand-written; nothing recomputes it from the table |
| Storage tracking vs inventory | Vintage MPR-064–079 lived in `inventory.md` only | Onboarding wrote inventory and skipped `assignment.md` Storage |
| Watchlist stages | MPR-020 returned; 021/022 landed; WATCH still “in transit” / live | Purchase close-out never required a WATCH row update |
| Duplicate 9th-grade roster | Same 9 students in MS 9th and HS 9th; total 83 | Grade-bump copy left both tables; CLAUDE.md still said 83 |
| Stale student MPR cells | Franklin/Evan/Baxter/Davis blank; Sean still on MPR-009; Tyler still on MPR-013 | Assignment is SoT; roster is denormalized and not backfilled on assign/return |
| Holder missing | MPR-030 “unassigned” while Nigel had the Dillon | Roster said French Horn with no MPR; no “who holds this” check |
| Stale tag-print cache | Clear-sheet dump of Aug 14 student tags dated Aug 19, including Christel on MPR-003 | HTML Clear sheet caches last export; CE wrote it as a new print |
| Duplicate session-updates | Three files for one 10-card print (cache, JSON log, prose write-up) | Same physical event, three CE chats |
| Inbox not archived | Merge finished, files sat in `/updates/` | Easy to re-ingest or mix with the next drop |
| Derived docs lag | `students.md` 74 vs CLAUDE/GETTING_STARTED/PROJECT_DESCRIPTION 83 | Counts copied into narrative files |

---

## Governance to avoid this next time

Use these as merge and CE operating rules. **Skills/concierge should eventually encode them; park that for a dedicated session.**

### 1. One source of truth per fact

| Fact | Source of truth | Copies that must be updated in the same merge |
|---|---|---|
| Who holds an instrument | `assignment.md` Active (or History if returned) | `students.md` MPR cell; `inventory.md` Location `Assigned`/`Storage`/`Band Room`/`For Sale`; tag-log student rows; quick-reference in assignment |
| Instrument exists / serial / condition | `inventory.md` table | Acquisition notes; onboarding-photo-index section; `assignment.md` Storage or Band Room if unassigned |
| Tag actually printed | `tag-log.md` (latest row per ID + type) | Regenerated `mpr-tags.html` only — never hand-edit HTML |
| Purchase still open | `watchlist.md` Live | Close or Landed the same day the box is opened or the return ships |
| Headcount / fleet totals | Count the tables | CLAUDE.md, GETTING_STARTED.md, PROJECT_DESCRIPTION.md, inventory summary line |

If a session-updates file says “tag-log only” or “inventory only,” still **scan** assignment, students, and watchlist for the same IDs.

### 2. Derived numbers are never trusted

After any inventory or roster edit, **recount from the table**, do not patch the previous sentence:

- Fleet categories must sum to the owned total (78 today).
- Storage count in `assignment.md` = MPR-owned rows in Storage + Incoming + For Sale-without-LOT (match current convention).
- Student total = unique people in the surviving grade tables (no double 9th-grade).

CE must not invent a category total. Cursor merge must recompute or refuse the CE number.

### 3. Assignment and roster are a two-file transaction

Any new/closed ASGN row in the same merge:

1. Set `inventory.md` Location.
2. Set `students.md` Instrument + MPR (or `—` on return).
3. Update assignment quick-reference.
4. Never leave “Instrument: French Horn” with a blank MPR if the horn is already in inventory — that is a **holder gap**, not a TBD.

Conversely: a roster MPR that has no Active ASGN is stale (Sean/MPR-009).

### 4. Onboarding checklist (instruments already in the building)

A new or newly found MPR is not done until:

- [ ] Inventory table row
- [ ] Acquisition notes (or explicit “TBD”)
- [ ] Assignment: Active **or** Storage **or** Band Room **or** sale LOT
- [ ] Photo-index section if photos exist
- [ ] Serial pending vs ✅ is honest
- [ ] No second MPR for the same physical horn (Pixel `(1)` duplicates are not companions)

Vintage closet finds (064–079 class) failed the Storage bullet. That is the gap to encode in SKILL-001 onboarding later.

### 5. Watchlist close-out is part of intake

When an instrument gets an MPR:

- Stage → `Landed` the same merge.
- Correct listing-name errors (Nikkan → Yamaha) in watchlist, not only inventory.
- If returned/retired: **move the WATCH row to Closed** the same day as the Retired IDs note. Live + “Landed” + retired ID is still a gap.

### 6. Tag-print artifacts: newest physical sheet wins; caches are suspect

- Prefer the **photographed sheet / prose write-up** over a Clear-sheet JSON dump when they disagree.
- A Clear-sheet file whose IDs are last week’s student tags (Janice, Christel, …) is a **cache**, even if dated today. Do not append.
- Duplicate files for the same 10 cards: merge once, archive all.
- Keep historical Pending rows; latest row per ID + type wins (`generate-tags.js`).
- Printing a permanent tag does **not** close a service ticket (MPR-023 / SVC-HRN-003).

### 7. CE merge rules (Cursor)

Already in UPDATE-PROCESS Step 1b; tighten in practice:

1. List `/updates/` top-level **before** merging. Identify md vs photo dumps vs stale copies.
2. Never trust CE `MPR-TBD` or “next ID.”
3. If CE says “delete open item #N,” **read the current numbered list** — numbers drift.
4. If CE says no inventory/assignment change, still verify Location and holders for IDs it touched.
5. **Archive as you ingest** (session-updates + photo dumps). Empty inbox is the done signal. Do not leave merged files sitting for the next CE drop to mix with.
6. Photo hunts: lead with **calendar date** (and device if known). Do not nag accessories or “please print tags.”
7. One gap at a time when asking Jesse; don’t invent MPR IDs for uninventoried horns (Keith).

### 8. CE session-updates quality (teach later, not tonight)

When skills are next edited, CE should:

- Emit **one** `session-updates-<chat-slug>.md` per chat, not a tag-log plus a duplicate essay plus a Clear-sheet cache.
- Name the **physical event** (date + sheet contents) so Cursor can dedupe.
- Include a **cross-file checklist** tick: inventory / assignment / students / watchlist / tag-log / photo-index / derived counts.
- Never date a Clear-sheet export as a new print unless the user confirmed those cards left the printer **today**.
- Never suggest a next MPR ID.

### 9. After merge, regenerate and recount

```
node generate-tags.js   # from mpr-project/
```

Then spot-check: fleet total, needsTag count, holders on newly assigned IDs. Derived narrative counts (CLAUDE.md) in the same commit.

---

## Flag for another session (do not build now)

Park as a future project slice — skills + concierge + maybe a tiny recount helper:

1. SKILL-001 onboarding: force Storage/Band Room/Active row in `assignment.md`.
2. SKILL-001 assignment/return: two-file transaction with `students.md`.
3. SKILL-003 / purchase close: watchlist Landed/Closed in the same workflow.
4. Tag-print workflow: reject Clear-sheet caches; one artifact per print event.
5. Concierge/CLAUDE/ROUTING: archive-as-you-ingest; cross-file checklist; no invented MPR IDs (already partly written — tighten with the table above).
6. Optional: a `node` recount that prints category totals and student unique-count so summary lines can’t drift.
7. Sweep GETTING_STARTED.md / PROJECT_DESCRIPTION.md student “83” leftovers when those files are next opened.

**Not this wrap.** No skill version bumps, no `.skill` rebuilds tonight.

---

## CE deploy (until Enterprise reseed)

Personal Claude is in use until ~Sep 2026 usage reset. After this commit, CE is stale until:

- Re-seed `mpr-project/project-files/` (inventory, assignment, students, watchlist, tag-log, onboarding-photo-index, mpr-tags.html, CLAUDE.md).
- Full CE reseed of all project-files when Enterprise tokens reset — not just the latest cherry-pick.
- Skill reinstall only after the deferred governance session actually edits SKILL-00N.
