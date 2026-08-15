# MPR Music Program
 
Track students, instruments, and assignments for Maple Ridge School's music program. Type `get started` to begin.
 
---
 
## Getting Started
 
Or jump straight to a task:
- Assigning an instrument to a student
- Printing tags for a new horn  
- Logging an incoming instrument
- Recording a repair
- Running grade progression (bump grades, manage graduates)
- Selling, listing, or pricing an instrument
- Marking an instrument Sold, Retired, or External
- Choosing concert band music for the ensemble
- Reconciling a Coupa expense against the record
**Browsing files:** You can always read `students.md`, `inventory.md`, `assignment.md`, `sale-inventory.md`, or `repertoire.md` directly without using a skill.
 
---
 
## Quick links
 
- 📋 **Roster** — `students.md` (all 83 students by grade)
- 🎺 **Inventory** — `inventory.md` (fleet instruments, serials, costs)
- 📝 **Assignments** — `assignment.md` (who has what, condition history)
- 💰 **Sale Inventory** — `sale-inventory.md` (`LOT-###` items held for disposal — separate from the fleet)
- 🎼 **Repertoire** — `repertoire.md` (`REP-###` concert band music owned, programmed, or rejected)
- 🏷️ **Tag Printer** — `mpr-tags.html` (print MPR-IDs on Avery 5874 cardstock)
- 📖 **Skills Guide** — `GETTING_STARTED.md` (workflow descriptions and routing)
---
 
## Skills available now
 
1. **Student Assignment** — Assign an instrument to a student
2. **Instrument Tagging** — Print tags for a new or reassigned horn
3. **Instrument Onboarding** — Log a new instrument at intake
4. **Instrument Maintenance** — Record a repair or service appointment
5. **Grade Progression** — Bump grades, flag 9th graders for HS, manage graduates
6. **Instrument Removal** — Mark a fleet instrument Sold, Retired, or External and retire its MPR ID
7. **Instrument Sale** — Decide what should go, identify and price it against sold comps, write eBay/Facebook listings, ship it, record proceeds
8. **Instrument Purchase** — Decide whether to buy at all, read a listing for what it proves, cost it landed, bid with discipline
9. **Music Purchase** — Choose concert band repertoire from the actual ensemble, not the published grade; maintain `repertoire.md`
10. **Expense Reconciliation** — Tie Coupa expenses back to the instrument or title they paid for (requires a Coupa connection)

Skills 1–6 live in the `instrument-inventory` skill. Skill 7, `instrument-sale`, is a separate skill that hands off to Skill 6 once a sale closes, so the fleet record and the disposal pipeline stay in one place each. Skills 8–10 are separate skills as well.

Instruments and sheet music stay in separate lanes: `music-purchase` never evaluates an instrument listing, and the instrument skills never recommend repertoire.
 
---
 
## Skills coming soon
 
- **NYSSMA Solo Night** — Assign solos, build concert program
- **Music Library** — Catalog and search the wider sheet music collection
---
 
**Project files sync with `jessef1983/maple-ridge-music-program` on GitHub.**