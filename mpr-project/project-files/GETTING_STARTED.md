# MPR Music Program — Getting Started
 
**Type `get started` to begin.**
 
---
 
## What is this project?
 
This is a management system for Maple Ridge School's music program. It tracks students, instruments, assignments, and service records across an 83-student cohort spanning grades 2–12 — and, separately, the disposal pipeline for instruments the program is selling rather than keeping.
 
Instead of juggling files, you use **skills** — guided workflows that ask the right questions, update the right files, and keep everything consistent.
 
---
 
## Skills & Workflows
 
### Tier 1: Instrument Management (Most Common)
 
**Use these skills 90% of the time.**
 
#### 1. **Student Assignment** 🎓
*Assign an instrument to a student or add a new student to the program*
 
**When:** Student starts lessons, gets a different instrument, or returns one  
**What it does:**
- Looks up the student in `students.md`
- Assigns them a horn from `inventory.md`
- Creates an assignment log entry in `assignment.md`
- Prints a student tag for the case
- Updates condition baseline
**Typical time:** 5–10 minutes
 
---
 
#### 2. **Instrument Tagging** 🏷️
*Print permanent and student tags for an instrument*
 
**When:** New instrument arrives, tag is damaged, or reassigning between students  
**What it does:**
- Confirms serial from the instrument itself
- Generates permanent tag (laminated, exterior)
- Generates student tag (swappable, interior)
- Calibrates to your printer (HP M479fdw)
- After print, Clear sheet can download a `session-updates-tag-print-*.md` for the tag log (drop in `/updates/`)
- Instructions for sealing
**Typical time:** 3–5 minutes per instrument
 
---
 
#### 3. **Instrument Onboarding** 📦
*Log a new instrument when it arrives*
 
**When:** You receive an instrument from eBay, Reverb, or a retailer  
**What it does:**
- Records the instrument as **`MPR-TBD`** in session-updates (merge assigns the real MPR ID — CE must not invent one)
- Indexes intake photos into the same session-updates file (`onboarding-photo-index.md` section)
- Photographs and records the serial
- Captures landed cost, seller info, return deadline
- Assesses condition (leadpipe, valves, slides, cosmetics)
- Writes the inventory row in `inventory.md`
**Typical time:** 15–20 minutes
 
---
 
#### 4. **Instrument Maintenance** 🔧
*Log a repair or service appointment*
 
**When:** A horn needs work (sticky valves, dent repair, chem clean, etc.)  
**What it does:**
- Diagnoses the issue (gummed vs. compression loss)
- Gets a repair quote
- Creates a service record in `inventory.md`
- Sets instrument status to `In service`
- Updates condition grade when it returns from the shop
**Typical time:** 10 minutes (plus waiting for repair)
 
---
 
#### 5. **Grade Progression** 📅
*Bump all students up a grade, flag 9th graders for HS decisions*
 
**When:** August 1, before the new school year  
**What it does:**
- Increments all grades in `students.md` by 1
- Adds new incoming students
- Flags 9th graders (🚩) for high school continuation conversation
- Closes assignments for graduating students
- Returns their instruments to `Available` status
**Typical time:** 30–45 minutes (once per year)
 
---
 
#### 6. **Instrument Removal** 🚪
*Mark a fleet instrument Sold, Retired, or External and close its record*
 
**When:** An instrument is leaving the program permanently — sold, retired from service, or corrected off the roster because it was never program property  
**What it does:**
- Closes the active assignment row in `assignment.md`, if any
- Sets the instrument's status in `inventory.md` (`Sold` / `Retired` / `External`)
- Retires the MPR ID permanently — never reused
- Regenerates `mpr-tags.html` with the entry removed from the tag picker
- Leaves both historical rows in place; only the instrument leaves
**Typical time:** 5 minutes
 
This is the workflow `instrument-sale` (below) hands off to once a fleet instrument's sale actually closes — it's what keeps the record from drifting once money changes hands.
 
---
 
#### 7. **Instrument Sale** 💰
*Decide what should go, identify it, price it, list it, ship it*
 
**When:** You're clearing surplus instruments — either fleet horns past their usefulness, or items in `sale-inventory.md` acquired specifically for resale  
**What it does:**
- Works through whether an instrument should actually leave (still assigned? return window open? only one of its kind? a student needs it?)
- Identifies brand, model, material and dates it from evidence only — never guesses
- Prices it against **sold** comps, not asking prices
- Writes eBay and Facebook Marketplace listing copy
- Covers packing and shipping for what does ship
- Records gross/fees/net proceeds
- Hands off to **Instrument Removal** (above) once a fleet instrument's sale closes
**Typical time:** 20–40 minutes per item, most of it identification and pricing
 
**Files:** reads/writes `sale-inventory.md` for `LOT-###` disposal items; for fleet `MPR-###` instruments, reads `inventory.md`/`assignment.md` and hands off the actual status change to Instrument Removal
 
---
 
### Tier 2: Repertoire & Money

#### **Music Purchase** 🎼
*Choose concert band music for the band you actually have*

**When:** Planning a concert, filling a gap in the library, or judging whether a specific piece will work  
**What it does:**
- Builds a picture of the current ensemble — who plays what, and how well
- Pins down the musical need before opening a catalog
- Searches publisher and vendor catalogs against a written specification
- Evaluates each piece against this band: instrumentation, ranges, exposed parts, percussion practicality
- Scores candidates and returns a ranked shortlist with a direct BUY / CONSIDER / STRETCH / PASS
- Records purchased titles as `REP-###` in `repertoire.md`
**Typical time:** 20–45 minutes for a concert's worth of repertoire

**Files:** reads/writes `repertoire.md`; reads `students.md`, `assignment.md`, `inventory.md`

The published grade is a filter, not a verdict — a Grade 2 piece with an exposed horn part can be harder for this band than a Grade 2.5 whose difficulty sits in the strong sections.

---

#### **Expense Reconciliation** 💵
*Tie money already spent back to the record*

**When:** A Coupa expense report or invoice needs matching, or you want to know what was already paid  
**What it does:**
- Finds the expense in Coupa by report ID, line ID, or exact merchant string
- Matches receipt lines to instruments in `inventory.md` or titles in `repertoire.md`
- Splits shared shipping and tax across a multi-item order
- Flags variance against the recorded cost
**Typical time:** 5–15 minutes per expense

**Requires an active Coupa connection.** Without one, it will say so rather than guess.

---

### Tier 3: Future Workflows
 
*Coming soon:*
 
#### **NYSSMA Solo Night** 🎼
Assign solo pieces to students, build the program, manage rehearsal schedules
 
#### **Music Library** 📚
Catalog and search the wider sheet music collection beyond concert band repertoire
 
---
 
## How to use a skill
 
1. **Say what you want to do.** ("I'm assigning a trumpet to Connor") or **choose from the visual picker**
2. **Answer the skill's questions.** It asks for names, dates, condition grades, etc.
3. **Review the changes** before they're written to the files
4. **Done.** The skill updates the relevant files automatically
**You can always browse the files** (`students.md`, `inventory.md`, `assignment.md`, `sale-inventory.md`) anytime without using a skill. But skills are faster and prevent mistakes.
 
---
 
## Quick reference: Which skill do I need?
 
| Situation | Skill | Tier |
|---|---|---|
| Christel got a new flute | **Student Assignment** | 1 |
| The flutes need tags printed | **Instrument Tagging** | 1 |
| A trumpet arrived from eBay | **Instrument Onboarding** | 1 |
| Kevin's horn has sticky valves | **Instrument Maintenance** | 1 |
| It's August 1 and students are advancing | **Grade Progression** | 1 |
| An instrument sold, or is being retired | **Instrument Removal** | 1 |
| I want to price or list a LOT clarinet | **Instrument Sale** | 1 |
| I found a good Besson online | **Instrument Purchase** | 1 |
| What music should we buy for the fall concert? | **Music Purchase** | 2 |
| Will this Grade 2.5 piece work for our band? | **Music Purchase** | 2 |
| Did we already buy this march? | **Music Purchase** (then Expense Reconciliation if the library record is thin) | 2 |
| Split the shipping on that three-horn eBay order | **Expense Reconciliation** | 2 |
| I need to add a Bach 1.5C mouthpiece to inventory | Music Library | 3 |
 
---
 
## File structure
 
These files hold the program's records. **Skills read and write to these automatically.** You can browse them anytime:
 
- **`students.md`** — Roster of all 83 students (grades 2–12), their status, birthday
- **`inventory.md`** — Fleet assets: MPR-### instruments, serials, costs, service history
- **`assignment.md`** — Active & historical: who has what, dates, condition
- **`sale-inventory.md`** — Disposal pipeline: LOT-### items held for sale, separate from the fleet, with identification evidence, condition, and pricing per item
- **`repertoire.md`** — Concert band music library: REP-### titles owned, programming history, and titles deliberately rejected
- **`mpr-tags.html`** — Tag printer template (open locally to print)
---
 
## Getting started
 
**Type `get started` in this conversation** to get a dropdown of the workflows.
 
Or skip the dropdown and **type "Get Started with ___" directly** (e.g., "Get Started with Student Assignment", "Get Started with Instrument Tagging", "Get Started with Instrument Maintenance") — this also gives the chat a readable name in your history instead of a generic one.
 
Or **just describe what you need** ("Connor's trumpet is being serviced, and it should be back next week" or "I want to sell these three clarinets") and I'll route you to the right skill.
 