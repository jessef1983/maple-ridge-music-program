# Assignment Log
 
**Maple Ridge School** · Ulster Park, NY  
**Last updated:** August 10, 2026
 
---
 
## Legend
 
**Status:** `Active` · `Storage` · `In service` · `Incoming` · `Returned`  
**Condition grades:** `Excellent` · `Good` · `Fair` · `Project` · `Unknown`
 
---
 
## Active assignments (students with instruments)
 
| Assignment | MPR | Instrument | Student | Date Out | Condition Out | Notes |
|---|---|---|---|---|---|---|
| ASGN-001 | MPR-001 | Flute | Anita Bazeley | 2024-09-?? | Unknown | — |
| ASGN-002 | MPR-003 | Flute | Christel Mow | 2026-03-20 | Very Good | Cork replaced; SVC-FLT-001 pending bill |
| ASGN-003 | MPR-006 | Trumpet | Janice Meier | 2026-01-12 | Good | — |
| ASGN-004 | MPR-007 | Trumpet | Kevin Hofer | 2025-10-21 | Fair | Sticky valves; heavier oil trial in progress |
| ASGN-005 | MPR-009 | Glockenspiel | Sean Bazeley | 2025-08-14 | Unknown | — |
| ASGN-006 | MPR-010 | Trumpet | Matt | 2025-04-29 | Unknown | **Not in student roster** — verify status |
| ASGN-007 | MPR-011 | Trumpet | Connor Bazeley | 2025-01-28 | Unknown | — |
| ASGN-008 | MPR-013 | Euphonium | Tyler Frase | 2021-09-04 | Unknown | Serial: 103212 ✅ |
| ASGN-009 | MPR-014 | Euphonium | Kevin Robertshaw (Instructor) | 2021-08-16 | Good | — |
| ASGN-010 | MPR-016 | Euphonium | Julian Alexander | ⚠️ date pending | Good | — |
| ASGN-011 | MPR-017 | French Horn | Steph | TBD | Unknown | **Not in student roster** — verify status |
| ASGN-012 | MPR-018 | French Horn | Greg | TBD | Unknown | **Not in student roster** — verify status |
| ASGN-013 | MPR-020 | Euphonium | Joseph Wipf | 2026-08 | Unknown | ⚠️ **RETURN DEADLINE: Sep 4, 2026** |
| ASGN-014 | MPR-023 | French Horn | Micah | TBD | Unknown | **Not in student roster** — verify status; SVC-HRN-001 completed |
 
**14 active assignments.** Four students (Matt, Steph, Greg, Micah) not in the student roster — clarify whether they're continuing or need to be added/removed.
 
---
 
## Storage (instruments in closet, unassigned)
 
| MPR | Instrument | Status | Notes | Condition |
|---|---|---|---|---|
| MPR-015 | Euphonium | Storage | Besson 767 Compensating; program-owned spare | Good |
| MPR-019 | Euphonium | Incoming inspection | Yamaha YEP-321S; arrived week of Aug 10, final sale | Unknown |
| MPR-021 | Trumpet | Incoming | Yamaha YTR-3325S; unassigned to student | Unknown |
| MPR-022 | Trumpet | Incoming | Nikkan YTR-334S; unassigned to student | Unknown |
| MPR-026 | Flute | Storage | Yamaha YFL-225; retire or sell — repad cost ~$300 against low value | Unknown |
 
**5 instruments in storage or incoming.** MPR-019 and 020 need assessment before Sep 4 (only 020 is returnable).
 
---
 
## Incoming (awaiting assignment)
 
When new students are placed or returning students swap instruments, use this section to stage assignments before they go active.
 
| MPR | Instrument | Student | Expected Date | Status | Notes |
|---|---|---|---|---|---|
| MPR-021 | Trumpet | ⏳ Eli Marchant? | Sep 2026 | Hold | 5th grade, instrument TBD |
| MPR-022 | Trumpet | ⏳ Simon Martini-Eiler? | Sep 2026 | Hold | 7th grade, instrument TBD |
 
---
 
## Assignment history (closed assignments)
 
*Instruments returned, reassigned, or removed from program.*
 
| Assignment | MPR | Instrument | Student | Date Out | Date In | Condition Out | Condition In | Reason |
|---|---|---|---|---|---|---|---|---|
| — | — | — | — | — | — | — | — | *No closed assignments yet* |
 
---
 
## Assignment workflow
 
**When a student gets an instrument:**
 
1. Select the MPR ID from `inventory.md`
2. Confirm condition grade from the instrument's last assessment
3. Create a new ASGN row with:
   - Next sequential ASGN number (ASGN-001, ASGN-002, etc.)
   - MPR ID
   - Student name (from `students.md`)
   - Date Out (today's date)
   - Condition Out (the instrument's current grade)
   - Any relevant notes (e.g., "sticky valves, oil trial", "return by Sep 4")
4. Set Status to `Active`
5. Print a student tag for the case (see `instrument-inventory` skill, Tag printing section)
**When a student returns an instrument:**
 
1. Find the assignment row (ASGN-###)
2. Fill in Date In (today's date)
3. Assess Condition In and update the row
4. Set Status to `Returned`
5. Update the instrument's condition grade in `inventory.md` based on the technician's or your assessment
6. If the instrument needs service, create a new SVC row in `inventory.md`
7. Peel the student tag from the case and file it with this assignment record
**When an instrument is stored or removed:**
 
1. Leave the assignment row unchanged (it's historical)
2. Update the instrument's Status in `inventory.md` to `Storage`, `Sold`, `Retired`, or `External`
3. If applicable, add a note in the Storage section above
---
 
## Quick reference: who has what
 
*This is a denormalized view for at-a-glance checking. Update it whenever an assignment changes.*
 
**Flute:** Anita (MPR-001), Christel (MPR-003)  
**Trumpet:** Janice (MPR-006), Kevin H. (MPR-007), Matt (MPR-010), Connor (MPR-011)  
**Percussion:** Sean (MPR-009)  
**Euphonium:** Tyler (MPR-013), Kevin R. (Instructor, MPR-014), Julian (MPR-016), Joseph (MPR-020)  
**French Horn:** Steph (MPR-017), Greg (MPR-018), Micah (MPR-023)
 
**In storage:** MPR-015, MPR-026  
**Incoming:** MPR-019, MPR-021, MPR-022
 
---
 
## Notes
 
- **Condition Out should always be filled** — it's the only record of what the student received and is the baseline for "did something happen during the assignment?"
- **Reason field in history** is for notes like "Graduated", "Stepped back", "Upgraded to MPR-012", "Returned for service"
- **The four mystery students** (Matt, Steph, Greg, Micah) need clarification: are they continuing, or should their assignments be closed and marked `Returned`?
- **MPR-019 and MPR-020** are awaiting inspection before Sep 4; once assessed, they move to Active assignments
- **Historical assignments stay** — don't delete them. They're proof of who had what and for how long, which matters for tracking wear patterns and student history
 