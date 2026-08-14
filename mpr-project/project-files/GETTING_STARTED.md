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
- Instructions for sealing
**Typical time:** 3–5 minutes per instrument
 
---
 
#### 3. **Instrument Onboarding** 📦
*Log a new instrument when it arrives*
 
**When:** You receive an instrument from eBay, Reverb, or a retailer  
**What it does:**
- Assigns the next MPR ID
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
 
### Tier 2: Secondary Workflows (Future)
 
*Coming soon:*
 
#### **Music Purchasing** 💰
Find and evaluate eBay/Reverb listings, calculate landed costs, track proxy bids, compare sellers
 
#### **NYSSMA Solo Night** 🎼
Assign solo pieces to students, build the program, manage rehearsal schedules
 
#### **Music Library** 📚
Search or add sheet music to the program collection
 
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
| I want to sell the YFL-225, or price/list any LOT item | **Instrument Sale** | 1 |
| I found a good Besson online | Music Purchasing | 2 |
| I need to add a Bach 1.5C mouthpiece to inventory | Music Library | 2 |
 
---
 
## File structure
 
Four files hold the program's records. **Skills read and write to these automatically.** You can browse them anytime:
 
- **`students.md`** — Roster of all 83 students (grades 2–12), their status, birthday
- **`inventory.md`** — Fleet assets: MPR-### instruments, serials, costs, service history
- **`assignment.md`** — Active & historical: who has what, dates, condition
- **`sale-inventory.md`** — Disposal pipeline: LOT-### items held for sale, separate from the fleet, with identification evidence, condition, and pricing per item
- **`mpr-tags.html`** — Tag printer template (open locally to print)
---
 
## Getting started
 
**Type `get started` in this conversation** to get a dropdown of the workflows.
 
Or skip the dropdown and **type "Get Started with ___" directly** (e.g., "Get Started with Student Assignment", "Get Started with Instrument Tagging", "Get Started with Instrument Maintenance") — this also gives the chat a readable name in your history instead of a generic one.
 
Or **just describe what you need** ("Connor's trumpet is being serviced, and it should be back next week" or "I want to sell these three clarinets") and I'll route you to the right skill.
 