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
| MPR-036 | Permanent | 2026-08-15 | Olds trombone — Emmanuel Martinie-Eiler (ASGN-032); Aug 15 recall backfill |
| MPR-036 | Student | 2026-08-15 | Emmanuel Martinie-Eiler (ASGN-032); Aug 15 recall backfill |
| MPR-022 | Permanent | 2026-08-15 | Yamaha YTR-334S, storage; Aug 15 recall backfill |
| MPR-021 | Permanent | 2026-08-15 | Yamaha YTR-3325S, storage; Aug 15 recall backfill |
| MPR-018 | Permanent | 2026-08-15 | Yamaha YHR-668N, storage; Aug 15 recall backfill |
| MPR-009 | Permanent | 2026-08-16 | Yamaha YG-50D glockenspiel, band room (photo-confirmed) |
| MPR-041 | Permanent | 2026-08-16 | Alexander descant horn, storage (photo-confirmed) |
| MPR-042 | Permanent | 2026-08-16 | Elkhart/Couesnon alto horn, storage (photo-confirmed) |
| MPR-045 | Permanent | 2026-08-16 | Conn Eb tuba (For Sale), storage (photo-confirmed; CE note misread brand as “Con Limited Bb”) |
| MPR-046 | Permanent | 2026-08-16 | Conn BBb tuba, storage — tag 1 of 2 (two-piece unit; photo-confirmed) |
| MPR-046 | Permanent | 2026-08-16 | Conn BBb tuba, storage — tag 2 of 2 (two-piece unit; photo-confirmed) |
| MPR-047 | Permanent | 2026-08-16 | Conn 906 trombone, storage (photo-confirmed) |
| MPR-048 | Permanent | 2026-08-16 | Dynasty U.S.A. BBb tuba — Davis Loewenthal (photo-confirmed) |
| MPR-048 | Student | 2026-08-16 | Davis Loewenthal (ASGN-021) |
| MPR-058 | Permanent | 2026-08-16 | Spencer tenor sax, storage (photo-confirmed) |
| MPR-080 | Permanent | 2026-08-16 | American Standard (H.N. White) cornet, assigned Sarah Frase (photo-confirmed) |
| MPR-080 | Student | 2026-08-16 | Sarah Frase (ASGN-036) |
| MPR-077 | Permanent | 2026-08-16 | Vincent Bach Model 42 trombone (F attachment), storage (photo-confirmed) |
| MPR-076 | Permanent | 2026-08-16 | Signature 2000 Custom Series trombone (F attachment), storage (photo-confirmed) |
| MPR-073 | Permanent | 2026-08-16 | Vincent Bach Stradivarius 236 (D) trumpet, storage (photo-confirmed) |
| MPR-070 | Permanent | 2026-08-16 | Bach Stradivarius Model 43 trumpet, storage (photo-confirmed) |
| MPR-075 | Permanent | 2026-08-16 | Bach 1530 trumpet, storage (photo-confirmed) |
| MPR-078 | Permanent | 2026-08-16 | Model 11B2 C-valve trombone (maker unknown), storage (photo-confirmed) |
| MPR-044 | Permanent | 2026-08-16 | Mack Brass euphonium, storage (photo-confirmed) |
| MPR-038 | Permanent | 2026-08-16 | Boosey & Hawkes clarinet, storage (photo-confirmed) |
| MPR-023 | Permanent | Pending | Holton H378 double F/Bb, serial 596484 ✅; print after oil check |
| MPR-082 | Permanent | Pending | Yamaha YCL-250; storage, awaiting assignment or storage-location confirmation |

<!-- Append new rows above this line. One row per print event — don't overwrite or delete prior rows; the log keeps every printing, and generate-tags.js uses only the LATEST row per MPR ID + Tag Type (ties broken by file order — later row wins). -->
