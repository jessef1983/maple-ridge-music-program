---
name: instrument-inventory
description: Maintain a school/studio musical instrument inventory — logging acquisitions, assigning asset IDs, recording serials and condition grades, tracking which student has which instrument, and logging repairs. Use this skill whenever the user mentions receiving an instrument, assigning one to a student, adding a new student, tagging a case, servicing an instrument, or removing one from inventory. Also use it when the user asks who has what, what needs service, what a horn cost, or shows you a serial number photo.
---

# Instrument Inventory

Keeps a music program's instrument records accurate enough to act on. The failure mode this exists to prevent: making a purchasing or repair decision from a stale record — recommending against a horn that's already assigned and loved, or re-buying something already on the shelf.

## Core principle

**The record is only as good as its last update.** When new information appears in conversation — a delivery, a repair, an assignment, a correction — write it down in the same turn. Don't defer. A file updated three months late caused a bad recommendation once already.

## Three-file architecture

This skill works with three separate files, each with a distinct purpose:

| File | Contains | Stays static when |
|---|---|---|
| **`students.md`** | Roster: name, grade, status, birth date | A student moves to a different instrument |
| **`inventory.md`** | Assets: MPR ID, model, serial, cost, service history | An instrument is assigned or returned to a student |
| **`assignment.md`** | Active & historical: who has what, dates, condition out/in | (nothing — this is the log of all changes) |

**Why this split:** An instrument's facts (serial, cost, service) don't change when it gets passed to a different student. A student's record doesn't change when they swap horns. Only the junction table (`assignment.md`) captures the dynamic pairings and their history.

**A fourth file, `tag-log.md`, is also a log, not a fact table** — every permanent- and student-tag print event, one row per printing. It exists so a stale or missing tag is visible without checking cases by hand.

**A fifth file is derived, not authoritative.** `mpr-tags.html` carries a hardcoded copy of the fleet in its `FLEET` array, because a local file cannot read `inventory.md` at runtime — browsers block it. It is a snapshot that goes stale silently. Regenerate it whenever the fleet changes: a new instrument, a departed one, a serial promoted from 📷 to ✅, or a tag getting printed (logged in `tag-log.md`). When rebuilding, `inventory.md`/`assignment.md`/`tag-log.md` are the source of truth and the tag file is rewritten to match — never the reverse.

**File references in this skill:**
- Workflows 1 & 2 (onboarding, assignment) reference all three core files
- Workflow 3 (tagging) reads from `students.md`, `inventory.md`, and `assignment.md`; writes to `tag-log.md` every time a tag is printed
- Workflow 4 (maintenance) updates `inventory.md` and `assignment.md`
- Workflow 5 (removal) updates `inventory.md` and closes rows in `assignment.md`
- Workflow 6 (transitions) updates `students.md` and manages `assignment.md` for graduating students

## Recording changes during a Claude Enterprise session

A Claude Enterprise project chat reads the files above, but it cannot edit them in place — nothing written during a conversation is real until it's back in `mpr-project/project-files/` in the actual repo. Handing back an entire regenerated file (all of `inventory.md`, say) every time one row changes is heavy, hard for a human to review, and risks silently clobbering someone else's edit made in a different session.

**So: wherever a workflow below says to write, update, or create a row in a file, do this instead —** append a dated entry to the session-updates artifact describing the change, rather than rewriting the target file itself.

### Session-updates hard rules

1. **Filename includes the chat name:** `session-updates-<chat-name-slug>.md` (kebab-case from the conversation title / "Get Started with ___" phrase). Do not leave it as bare `session-updates.md` when a chat name is known. Keep one running artifact for the whole conversation (`present_files`, append in place).

2. **Always present it at end of session.** When a workflow ends ("Done") or the user wraps: finalize and `present_files` the session-updates file; remind once to download and drop it in `/updates/` for Claude Code merge. Never end a session that changed records without that downloadable file.

3. **Photos → photo index inside session-updates.** Whenever intake/assessment photos are added or reviewed, write a complete section for `onboarding-photo-index.md` (folder, filename table, what each shot shows, status) as a session-updates entry targeting that file. Filenames must not live only in chat prose.

4. **Never invent a new `MPR-###` for a brand-new instrument.** Project uploads go stale across parallel CE chats; guessing the next ID caused repeated `MPR-064` collisions. Use **`MPR-TBD`** (or omit ID) and identify by brand / model / serial / photos; write *Assign next free MPR ID at merge time*. Exception: updates to an instrument **already** in the uploaded `inventory.md` may use that known MPR ID.

**Entry format:**
```
## <ISO timestamp> — instrument-inventory, Workflow <n> (<workflow name>)
**Target file:** <file.md>
**Change:** <one line: append row / update field, etc.>
<the literal row or field value, in the target file's own table format, ready to paste in>
```

## Identity model

Three separate identifiers, often confused:

| Identifier | What it is | Changes? |
|---|---|---|
| **MPR-###** | Acquisition/asset ID. The permanent record key. | Never |
| **Serial number** | The manufacturer's mark on the instrument | Never |
| **Assignee** | Which student currently holds it | Often |

Assign MPR IDs sequentially in acquisition order **at merge time in the repo** — never reuse a retired ID. In a Claude Enterprise session, **do not suggest or assign a new `MPR-###`** for a brand-new instrument (use `MPR-TBD`); parallel chats and stale uploads make "next ID" guesses collide. Physical tags carry the MPR ID; the serial is what proves the tag matches the horn.

## Condition rubric

Grades prevent inconsistent records:

| Grade | Meaning |
|---|---|
| `Excellent` | Plays correctly, no service needed, cosmetics near-new |
| `Good` | Plays correctly, routine maintenance only, normal cosmetic wear |
| `Fair` | Playable but needs work — sticky action, minor dents, worn plating |
| `Poor` | Not playable without repair; repair cost is a fraction of value |
| `Project` | Needs significant work and/or parts; may not be economically repairable |
| `Unknown` | Not yet assessed |

`Unknown` is only acceptable between purchase and intake. If a row has sat at `Unknown` after the instrument arrived, flag it — it means nobody ever looked.

## Status vocabulary

| Status | Meaning |
|---|---|
| `Owned` | In hand, in the program's possession |
| `In transit` | Purchased, not yet arrived |
| `In service` | At a repair shop or luthier |
| `External` | Not owned; borrowed, reference, or belongs to someone else |
| `Sold` | No longer owned; row retained for history |
| `Retired` | No longer in active use; kept for reference or storage |

## Ownership vocabulary

Not every instrument in the building is program property. Before assigning any ID, confirm ownership:

| Ownership | ID prefix | Meaning |
|---|---|---|
| **Program-owned** | `MPR-###` | Maple Ridge bought, was donated, or otherwise holds title to it |
| **Borrowed** | e.g. `MNT-###` for MNT Academy | Another organization owns it; the program has custody but not title. Track it (assignment, condition, service) exactly like an MPR instrument, in a clearly separated section — but never sell, retire, or dispose of it without the owner's involvement, and don't count it in the MPR fleet total |
| **Not program property** | none — logged in the "Not program property" table only | Personally owned by a student/staff member or a friend's loaner; the program has no custody claim at all |

If it's unclear which bucket an instrument belongs in, ask before assigning an ID. Assigning an `MPR-###` to something the program doesn't own is a mistake that's expensive to unwind later (it pollutes fleet counts, sale eligibility, and disposal decisions).

## Research governance

This applies to **every workflow that involves identifying, dating, or pricing an instrument** — onboarding, maintenance diagnosis, sale, and purchase alike. It matters most here because model identification, market value, and provenance are exactly the kind of claims a language model can produce fluently and confidently *without them being true*. A wrong serial gets corrected the next time someone looks at the horn; a wrong "this is a rare pre-war model worth $3,000" claim can drive a bad sale or purchase decision before anyone checks.

**Rules, in order of priority:**

1. **Never state a brand, model, model year, or dollar value from memory alone if it can be looked up.** "I recall that Conn made bassoons in the 1950s" is not the same as having checked. If a claim is checkable — via web search, `model-reference.md`, a photo, or an engraving — check it before writing it down.
2. **If you can't find it, say so — don't fill the gap with something plausible.** "Serial not located" or "Tier could not be confirmed from available sources" is a correct, useful answer. A confident-sounding guess dressed up as a fact is not. Mark the field ⚠️ or write "not confirmed" rather than asserting.
3. **Prefer multiple independent sources for anything that will inform a decision** (a sale price, a purchase judgment, a provenance claim). One eBay listing's description is not a source; a pattern across several sold listings, a manufacturer serial list, and/or a specialist forum thread is. Cross-reference photos and engravings against what a source claims — don't take a listing's title at face value (this program has already caught mislabeled finishes and misattributed brands this way).
4. **When uncertain, say so to the user and show your sources** rather than silently picking the most confident-sounding answer. "Based on X and Y, this looks like a Schreiber-made intermediate bassoon, likely 1950s–60s — I couldn't find a source that pins down the exact factory or year" is honest and useful. Don't round that up to a firm claim to sound more finished.
5. **Distinguish a researched fact from an estimate from a guess, explicitly, in the record.** Use `Confirmed`, `Estimated`, or `Unconfirmed` labels rather than letting everything read the same regardless of how well-supported it is.

**This is a hard requirement, not a style preference — it applies regardless of which model is running this skill.** A faster/lighter model is more likely to pattern-match to a plausible-sounding answer instead of actually checking; that's exactly the failure mode these rules exist to block. If you're a lighter model and you're not sure whether you actually searched or just recalled something that sounds right, search — the cost of one extra search is trivial next to the cost of a wrong provenance or price claim landing in the record uncorrected.

---

# Six core workflows

## 1. Instrument onboarding

**Files involved:** `inventory.md` (write)

Run this whenever an instrument arrives or is discovered (e.g. during a walkthrough). Work through it in order — later steps depend on earlier ones.

1. **Check for an existing record first.** Before assigning a new ID, look through `inventory.md` for an instrument that might already be this one under a different entry — same family, similar description, unconfirmed serial. A placeholder logged from a quick glance and the "real" instrument logged later from a closer look are easy to double-register (this has happened in this program's own records — see the Retired IDs section for an example). If there's any doubt, ask the user before creating a second ID for what might be the same horn.

2. **Determine ownership.** Program-owned (`MPR-###`), borrowed from another organization (a separate `###-###` prefix — see Ownership vocabulary above), or not program property at all? Don't default to assuming program ownership just because it's sitting in the building. Ask if it's unclear.

3. **Do not invent the next MPR ID in CE.** For a **new** program-owned instrument, use placeholder **`MPR-TBD`** and identify by brand/model/serial/photos. Write *Assign next free MPR ID at merge time*. Only use a real `MPR-###` when updating an instrument already present in the uploaded `inventory.md`. For borrowed instruments, use the correct prefix with `TBD` the same way (e.g. `MNT-TBD`) unless the ID already exists in the uploaded file.

4. **Photograph the serial** and any bell/brand engraving, before the instrument goes into rotation. This never gets easier than the day the case opens. Photograph *every* accessory compartment too, not just the main case bay — a missing bocal, mouthpiece, or crutch is much easier to prove absent from two angles than one. **Immediately index those photos** into a session-updates entry targeting `onboarding-photo-index.md` (folder name provisional as `MPR-TBD_Brand-Model/` until merge assigns the ID).

5. **Record acquisition data**: date, source (seller/donor/on-hand), landed cost (item + shipping + tax, or `$0.00` for a donation/transfer), order number if applicable.

6. **Note the return deadline** if one exists. This is time-critical and easily lost — surface it to the user explicitly.

7. **Identify brand, model, and tier — from evidence, following Research governance above.** Read engravings and stamps from the photos; don't infer a model from the instrument family alone. Then research what that brand/model actually is: manufacturer (including whether it's a rebrand/stencil — e.g. a "Conn" bassoon actually made by Schreiber), country and approximate era, and where it sits (entry-level student / intermediate / professional). Use `model-reference.md` first if the brand is already covered there; web search to fill gaps. Cite what you found and flag anything you couldn't confirm — don't guess a tier from the price alone.

8. **Research current market value for the record** (not a resale listing — just so the file has a documented estimate). Look for multiple sold-listing data points where possible (eBay sold, Reverb price guide) rather than one asking price. Label it clearly as an estimate with a date, e.g. "$800–1,500 (estimated Aug 2026, based on comparable sold listings)" — this is different from, and shouldn't be confused with, a firm appraisal.

9. **Assess condition** using the rubric above. Check in this order, because the expensive problems are the ones you can't see:
   - Leadpipe/wing-joint/mouthpiece receiver — dents, corrosion, or cracks here affect response and intonation
   - Valve compression or key action — free movement is not the same as good seal
   - Every slide or joint pulls/fits freely
   - Plating/lacquer/finish wear, dents, solder joints, cracks
   - **Every accessory the instrument should have** (mouthpiece, bocal, crutch, water key, reeds, grease) — confirm present or explicitly flag missing; don't assume complete because the case looks full

10. **Play-test if possible**, or flag clearly that it hasn't been done yet and why (e.g. a missing bocal blocks it). "Not yet play-tested" is a legitimate, honest status — don't write "playable" or "good condition" without having actually confirmed it.

11. **Decide**: ready for a student, or needs service/parts first.

12. **Tag the case** (see Workflow 3, Tag printing) — but only with a ✅ confirmed serial. If the serial is still ⚠️ or 📷, note that a permanent tag has to wait.

13. **Write the inventory row** (via session-updates) in `inventory.md` with all fields including the confirmed serial. Use **`MPR-TBD`** for new instruments. Do **not** write a holder/assignee into `inventory.md` — that belongs only in `assignment.md` (see Three-file architecture above). If an assignment is being made in the same session, create the `assignment.md` row too (also `MPR-TBD` until merge), but keep the two writes separate so `inventory.md` never duplicates who-has-what.

14. **Do not regenerate `mpr-tags.html` inside CE.** Tags regenerate locally after merge. Note in session-updates that tags need a local `node generate-tags.js` pass once the real MPR ID is assigned.

**Before calling an onboarding done, confirm you have:**
- [ ] Placeholder **`MPR-TBD`** (or known existing MPR if this is an update) — **not** a guessed next sequential ID
- [ ] Ownership determined and correctly bucketed
- [ ] Serial photographed, and marked ✅/📷/⚠️ accurately — not upgraded to ✅ without actually seeing it clearly
- [ ] Photo-index section written into session-updates (filenames + what each shows)
- [ ] Brand/model/tier researched with sources, or explicitly marked unconfirmed
- [ ] A market-value estimate with a date and source basis, or explicitly marked "not researched"
- [ ] Every accessory checked and confirmed present or flagged missing
- [ ] Condition assessed (not left at `Unknown`) or a clear reason it's still pending (e.g. blocked on a missing part)
- [ ] No holder/assignee written into `inventory.md` — only into `assignment.md`
- [ ] Session-updates file named with chat slug and presented for download

If any box can't be checked, say so to the user rather than marking the onboarding complete.

---

## 2. Student assignment (and onboarding)

**Files involved:** `students.md` (read/write), `inventory.md` (read), `assignment.md` (write)

Handles both adding a new student to the program and assigning (or reassigning) an instrument to a student.

**For a new student joining the program:**
1. Add the student to `students.md` with their name, grade, status `Active`, and instrument family (TBD if not yet assigned).
2. Select an appropriate instrument from `inventory.md` with status `Available` or `Storage`.
3. Follow the assignment sequence below.

**For an existing student getting an instrument:**
1. Find the student in `students.md` to confirm their name and grade.
2. Select an appropriate instrument from `inventory.md` with status `Available`.
3. Follow the assignment sequence below.

**Assignment sequence:**
1. **Create an assignment log entry** in `assignment.md` with:
   - Next sequential ASGN number
   - Instrument MPR ID from `inventory.md`
   - Student name from `students.md`
   - Date Out (today)
   - Condition Out (the instrument's current grade from `inventory.md`)
   - Any notes (e.g., "Sticky valves; oil to be tried before service")
2. **Print a student tag** for the interior of the case with the student's name, dates, and condition out/in fields. This tag stays with the case and gets updated at each handoff; it's not permanent.
3. Hand off the instrument and case to the student.

**On return:**
1. Update the assignment log entry in `assignment.md` with Date In and Condition In.
2. Assess the instrument and update its condition grade in `inventory.md` based on your inspection.
3. Peel the student tag off the case and print a new one for the next student, or file it if the instrument is going into storage.
4. Update the student's record in `students.md` if their status changes (e.g., `Stepped back` if they're returning the horn for good).

---

## 3. Tag printing

**Files involved:** `inventory.md` (read serial & MPR), `students.md` (read student name), `assignment.md` (reference for dates), `tag-log.md` (write — one entry per print)

**Log every print, both kinds.** Preferred path: after printing, click **Clear sheet** in `mpr-tags.html` and confirm the sheet printed successfully. The page downloads `session-updates-tag-print-YYYY-MM-DD.md` with one `tag-log.md` row per placed card (instrument → `Permanent`, student → `Student`, ISO date). Drop that file in `/updates/` for Claude Code merge — same as any other session-updates artifact.

If Clear-sheet export was skipped, record the prints the usual way — append a dated entry to the session-updates artifact describing each new `tag-log.md` row:
```
| MPR ID | Tag Type | Date Printed | Notes |
| MPR-021 | Permanent | 2026-08-14 | |
```
Use `Permanent` or `Student` exactly (case-sensitive match expected by `generate-tags.js`) and an ISO `YYYY-MM-DD` date — the outstanding-tag flag in `mpr-tags.html` depends on chronological comparison against `assignment.md`'s Date Out, which breaks silently on a non-ISO date. Skipping this step is why the picker would keep flagging an instrument as needing a tag after it's already been printed.

**The tool lives on disk, not in chat.** It is synced from the SharePoint Music Resources library to:

```
C:\Users\jessefrase.P36721\CCI General\Music Resources - Work in Process\mpr-tags.html
```

Open it from there. Do not hand over a download or open it in a preview pane — a sandboxed frame blocks `window.print()`, `confirm()`, and storage, which disables Print, Clear sheet, Reset calibration, and part-used sheet memory. At `file://` origin all of these work. Bookmarkable as:

```
file:///C:/Users/jessefrase.P36721/CCI%20General/Music%20Resources%20-%20Work%20in%20Process/mpr-tags.html
```

The path is specific to this user's sync. Anyone else running this workflow needs their own synced copy and their own path.

**When the fleet changes, regenerate and replace the library copy** — never a local Downloads copy, or two versions diverge with no clear winner. See Workflows 1 and 5.

Two tags per instrument; only one is laminated.

**The permanent instrument tag** (laminated):
- Location: exterior of the case, visible but not in the way
- Contents: MPR ID from `inventory.md`, model, serial (✅ confirmed only — never a photo-read), program name, phone
- Lifecycle: Sealed and never replaced. Serial must be verified against the instrument before printing — do not print if the serial is marked 📷 (photo-read, unconfirmed) in `inventory.md`.

**The student tag** (not laminated):
- Location: interior of the case, filed or kept loose
- Contents: MPR ID, student name (from `students.md`), date out (from `assignment.md`), date in, condition out (from `assignment.md`), condition in
- Lifecycle: Printed fresh for each assignment. Peeled off and kept as a record when the instrument is returned.

**Only ✅ confirmed serials go on sealed tags.** A serial read from a listing photograph is marked 📷 in `inventory.md` and must be verified against the actual instrument before printing. A laminated tag with a wrong serial is worse than one with no serial.

**Technical notes:**
- Hand the user the file rather than referring to it — surface `mpr-tags.html` from the project with `present_files` so they get a download button
- The buttons only work at `file://` origin. In a chat preview the frame is sandboxed: print, Clear, and Reset are all blocked, and only Place card responds. Tell the user to download and open it in their browser
- After print, remind them to use **Clear sheet** → confirm success → drop `session-updates-tag-print-*.md` in `/updates/`
- Use Avery 5874 laser business cards (2" × 3.5") on an HP M479fdw or equivalent
- Print calibration is printer-and-stock specific; if you change hardware, recalibrate
- Media type: Cardstock/Heavy; rub-test a card before laminating
- Let toner set for 1–2 minutes before sealing with self-laminating film

---

## 4. Instrument maintenance

**Files involved:** `assignment.md` (read holder), `inventory.md` (read/write status, write service record)

**Service workflow:**

1. **Diagnose before spending.** Many "broken" instruments are dirty, dry, or gummed rather than worn. Cheap fixes first: correct-viscosity oil, a warm soak, fresh grease. Sticky valves on an instrument that sat unused are usually evaporated oil and dried residue, not wear.

2. **Distinguish symptom from cause.**
   - Slow valves that improve after oiling = gummed
   - Free-moving valves with a stuffy horn = compression loss (expensive, sometimes terminal)

3. **Get a quote before committing** on anything above routine. Compare repair cost against replacement cost at current market.

4. **Open a service record** in `inventory.md` when the instrument goes out, not when the invoice arrives — otherwise instruments at the shop look like they're missing. Link it to the MPR ID; don't add a holder/name field to the service record — `assignment.md` is the only place that tracks who has an instrument, and a service record duplicating it is one more place for that fact to go stale.

5. **Set the inventory row to `In service`** in `inventory.md` so it isn't offered to a student.

6. **Update the condition grade** in `inventory.md` using the technician's assessment when it returns. A bench opinion is the best condition data available.

**Service record format (in `inventory.md`):**
```
| Service ID | MPR ID | Issue | Provider | Date | Cost | Status |
```

Use prefixes by family: `SVC-TPT-###`, `SVC-EUP-###`, `SVC-HRN-###`, `SVC-FLT-###`. Always link back to the MPR ID so the inventory row can drill through to its repair history — the MPR ID is enough to look up the current holder in `assignment.md` if needed; don't duplicate it here.

---

## 5. Instrument removal

**Files involved:** `inventory.md` (write status), `assignment.md` (close row if active)

**When an instrument leaves the program:**

1. **Decide the reason**: Sold, Retired (out of service but kept), or External (never was owned, remove from roster).
2. **Update the assignment row** in `assignment.md` (if currently active):
   - Set Status to `Returned` and mark Date In (today's date)
   - Add a note explaining why it's leaving (e.g., "Graduated the program", "Sold to fund upgrade")
3. **Update the inventory row** in `inventory.md`:
   - Set Status to `Sold`, `Retired`, or `External`
   - If `Sold`, record the sale price and date if available
   - Add a note explaining why it's leaving
4. **Keep both rows for history** — they prove who had what, what it cost, and how long it served
5. **Retire the MPR ID** — never reuse it
6. **Remove the student tag** from the case if one is present
7. **Retain the permanent instrument tag** if it's still legible, or carefully remove it if not
8. **Regenerate `mpr-tags.html`** with the entry removed from the `FLEET` array. A departed instrument left in the picker invites printing a tag for something the program no longer owns.

The physical records (rows in both files) stay; the instrument leaves.

---

## 6. Grade progression (annual review)

**Files involved:** `students.md` (read/write), `assignment.md` (read/write), `inventory.md` (write status)

**Run this workflow each August 1** before the school year starts. This is where grade progression happens and high school transitions get flagged.

**Workflow:**

1. **Add incoming students** to `students.md` with their name, grade 2 (or appropriate grade), instrument TBD, and status Incoming.

2. **Increment all other grades by 1** in `students.md` (6→7, 7→8, 8→9, etc.).

3. **Scan for 9th graders** in `students.md` — any student now in 9th grade is flagged with 🚩 because they're at the high school transition point.

4. **Transition conversation** — for each 9th grader, meet and decide:
   - Does the student want to continue with their instrument into high school?
   - If yes: Will they keep the program's instrument or buy/upgrade their own?
   - If no: When should they return the instrument? (end of year, immediately?)
   - What's the plan if they want to continue but the current horn isn't suitable for HS level?

5. **Update status** in `students.md`:
   - Status changes to `Active (HS)`, `Graduated`, `Stepped back`, or `Moving`
   - Notes capture the decision (e.g., "Continuing with MPR-011; will upgrade sophomore year")

6. **Update assignments and inventory** — if a student is graduating or stepping back:
   - Find the active assignment in `assignment.md` and mark it `Returned` with Date In (today)
   - Update the instrument status to `Available` in `inventory.md`
   - Peel the student tag and file it with the assignment record

**Why this matters:** The transition happens at 9th grade because that's when students physically move to high school, friend groups shift, and the program (middle-school focused) stops being their main musical outlet. Checking in explicitly prevents instruments from sitting idle with "graduated" students and ensures continuity for those who want to keep playing.

---

## Appendix: Reconciling corrections

When the user contradicts a record, the user is right and the file is stale. Correct it, and check whether anything else depends on the same fact. Say what changed, briefly, and move on — no extended audit of the error.

## Appendix: No duplication, single source of truth per fact

Each fact about the fleet lives in exactly one file. When the same fact appears in two places, they will eventually disagree — this has already happened in this program's records (an inventory note claiming a holder that `assignment.md` didn't show; two separate rows for the same physical instrument).

- **Who holds an instrument** → `assignment.md` only. Never write a student/instructor name into `inventory.md`, a service record, or a photo index. If `inventory.md` needs to say something is currently out, use a status flag (`Assigned`, `Storage`, `Band Room`, `For Sale`) — never a name.
- **What the instrument is** (brand, model, serial, cost) → `inventory.md` only. Don't re-describe it in `assignment.md` beyond what's needed for context, and don't let a photo index carry a holder's name in a folder path — holders change, filenames shouldn't need to.
- **Applying a schema fix retroactively:** when a documentation or format convention changes (e.g. adopting the Brand/Model/Serial/Outstanding note structure, or removing a duplicated column), apply it to existing rows, not just new ones going forward. A convention that only applies after the date it was adopted makes the file internally inconsistent and harder to trust at a glance.
- **Before creating a new ID, check whether the instrument might already be logged.** A duplicate registration (same physical instrument under two IDs) is worse than a missing record, because it silently inflates counts and creates two places for the same facts to drift apart.

