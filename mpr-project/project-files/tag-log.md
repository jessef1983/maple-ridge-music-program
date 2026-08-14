# Tag Log

**Maple Ridge School** · Ulster Park, NY

Records every tag print event, both kinds:

- **Permanent** — the laminated exterior tag, printed once and sealed. An MPR ID with no `Permanent` row here has never had its sealed tag made.
- **Student** — the interior tag, reprinted for each assignment. An MPR ID with an active assignment (see `assignment.md`) whose latest `Student` row predates that assignment's Date Out has a stale interior tag — the instrument changed hands but the tag wasn't reprinted.

`generate-tags.js` reads this file (cross-referenced against `assignment.md`) to flag outstanding tags directly in `mpr-tags.html`'s instrument picker, so a stale or missing tag is visible without cross-checking by hand.

**This file started empty on 2026-08-14** and got its first backfill rows the same day, from a manual walkthrough confirming which instruments already had tags in hand. It still has no history of tags printed before 2026-08-14 — an MPR ID with no row here just means "not logged," not necessarily "never tagged." Keep backfilling as more instruments are confirmed.

---

## Log

| MPR ID | Tag Type | Date Printed | Notes |
|---|---|---|---|
| MPR-006 | Student | 2026-08-14 | Janice Meier |
| MPR-003 | Student | 2026-08-14 | Christel Mow — superseded same day, MPR-003 reassigned to Anita Bazeley (ASGN-035), see below |
| MPR-007 | Student | 2026-08-14 | Kevin Hofer |
| MPR-016 | Student | 2026-08-14 | Julian Alexander |
| MPR-019 | Permanent | 2026-08-14 | Tyler Frase |
| MPR-019 | Student | 2026-08-14 | Tyler Frase |
| MPR-013 | Permanent | 2026-08-14 | Joseph Wipf — reassigned same day from Tyler Frase (ASGN-008 closed, ASGN-034 opened) |
| MPR-013 | Student | 2026-08-14 | Joseph Wipf — reassigned same day from Tyler Frase (ASGN-008 closed, ASGN-034 opened) |
| MPR-011 | Permanent | 2026-08-14 | Connor Bazeley |
| MPR-011 | Student | 2026-08-14 | Connor Bazeley |
| MPR-001 | Permanent | 2026-08-14 | Anita Bazeley |
| MPR-001 | Student | 2026-08-14 | Anita Bazeley |
| MPR-003 | Permanent | 2026-08-14 | Anita Bazeley — reassigned same day from Christel Mow (ASGN-002 closed, ASGN-035 opened) |
| MPR-003 | Student | 2026-08-14 | Anita Bazeley — reassigned same day from Christel Mow (ASGN-002 closed, ASGN-035 opened) |

<!-- Append new rows above this line. One row per print event — don't overwrite or delete prior rows; the log keeps every printing, and generate-tags.js uses only the LATEST row per MPR ID + Tag Type (ties broken by file order — later row wins). -->
