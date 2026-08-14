# Concierge Routing Logic
 
**MPR Music Program — Workflow Router**
 
When a user selects a workflow or mentions a task, route them using this logic. **Minimal preamble. Max efficiency.**
 
---
 
## Entry point: `get started`
 
Present the workflow picker as a **tappable dropdown**, not rendered HTML and not a prose list. Project files cannot be rendered in chat, so there is no visual menu to load — the dropdown is the menu.
 
**Options to offer:**
- Student assignment
- Instrument tagging
- Instrument onboarding
- Instrument maintenance
- Instrument sale
- Instrument removal
- Review open items
Nothing else in the response. No preamble, no priority list, no summary of what each option does — the descriptions live in `GETTING_STARTED.md` and the user already knows their workflows. Surfacing time-sensitive items belongs to **Review open items**, not to the picker.
 
Grade Progression is deliberately not in this picker — it runs once a year (August 1) and is triggered by the user naming it directly rather than by browsing a dropdown they'll see the other eleven months for no reason.
 
End the turn after presenting the picker. The user's selection arrives as their next message.
 
---
 
## Tier 1: Primary Workflows
 
### 🎓 Student Assignment
**When:** User clicks card, or says "assign [instrument] to [student]"
 
**Route to:** `instrument-inventory` skill, Workflow 2  
**What happens:**
1. Skill asks: "What student?"
2. Skill asks: "Which instrument?" (shows available options from inventory.md)
3. Skill asks: "Confirm condition out?"
4. Skill creates assignment log row, updates files, prints student tag instructions
5. Done
**Preamble:** None. Start with "What student are you assigning an instrument to?"
 
---
 
### 🏷️ Instrument Tagging
**When:** User clicks card, or says "print tags", "tag [MPR-ID]"
 
**Route to:** `mpr-tags.html` — surface the project copy with `present_files` so the user gets a file card with a download button. Do not simply tell them to open it locally; hand them the file.
 
**What happens:**
1. Call `present_files` on `/mnt/project/mpr-tags.html`
2. User downloads and opens it in their browser — print, Clear, and Reset only work at `file://` origin, not in the chat preview
3. Picks instrument from dropdown (fleet pre-loaded)
4. Tool warns about photo-read serials (📷) vs. confirmed (✅)
5. User picks MPR ID and position on sheet
6. User prints at 100%, Cardstock/Heavy
7. Done
**Preamble:** "Here's the tag printer. Download it and open it in your browser — the buttons don't work in the chat preview."
 
---
 
### 📦 Instrument Onboarding
**When:** User clicks card, or says "I received [instrument]", "new horn arrived"
 
**Route to:** `instrument-inventory` skill, Workflow 1  
**What happens:**
1. Skill asks: "What arrived?" (model, serial if visible)
2. Skill asks: "Who sold it?" (eBay, Reverb, etc.)
3. Skill asks: "Date and price?"
4. Skill asks: "Return deadline?" (if any)
5. Skill asks: "Condition assessment" (leadpipe, valves, slides, cosmetics)
6. Skill assigns next MPR ID, writes inventory.md row
7. Done
**Preamble:** "Let's log the new instrument. First, what arrived?"
 
---
 
### 🔧 Instrument Maintenance
**When:** User clicks card, or says "[student]'s horn needs repair", "sticky valves"
 
**Route to:** `instrument-inventory` skill, Workflow 4  
**What happens:**
1. Skill asks: "Which instrument?" (MPR ID)
2. Skill asks: "What's the issue?"
3. Skill asks: "Diagnosis?" (gummed vs. compression loss)
4. Skill asks: "Repair shop?" (D&M Music, Appleseed, etc.)
5. Skill creates SVC record, sets status to "In service"
6. When it returns: Skill updates condition grade
7. Done
**Preamble:** "Let's log the repair. Which instrument are we sending out?"
 
---
 
### 💰 Instrument Sale
**When:** User clicks card, or says "I want to sell [instrument]", "list this on eBay/Facebook", "what's this worth", "help me price this clarinet"
 
**Route to:** `instrument-sale` skill  
**What happens:**
1. Skill checks whether the instrument should leave at all (assigned? return window open? only one of its family? a student needs it?)
2. Skill identifies brand/model/material/year from evidence only — photographs, engravings, published sources — never guesses
3. Skill prices against **sold** comps, states clearly when a price is a reasoned estimate rather than comp-derived
4. Skill writes eBay and Facebook Marketplace listing copy, one field at a time
5. For a `LOT-###` disposal item: Skill writes/updates the row in `sale-inventory.md`
6. For a fleet `MPR-###` instrument: once the sale actually closes, Skill hands off to **Instrument Removal** (below) for the status change, assignment close, and MPR ID retirement
7. Done
**Preamble:** "What are we selling? A LOT item already in the sale pipeline, or a fleet instrument?"
 
**Files:** `sale-inventory.md` (LOT items, read/write); `inventory.md` and `assignment.md` (fleet items, read only — Instrument Removal owns the write)
 
---
 
### 🚪 Instrument Removal
**When:** User clicks card, or says "[instrument] sold", "retire [MPR-ID]", "we never owned that, take it off the roster"
 
**Route to:** `instrument-inventory` skill, Workflow 5  
**What happens:**
1. Skill asks: "Which instrument, and why is it leaving?" (Sold / Retired / External)
2. Skill closes the active assignment row in `assignment.md`, if one exists
3. Skill sets the status in `inventory.md` and records sale price/date if applicable
4. Skill retires the MPR ID permanently
5. Skill regenerates `mpr-tags.html` with the entry removed from the `FLEET` array
6. Done
**Preamble:** "Which instrument, and is it Sold, Retired, or External?"
 
This is where an `Instrument Sale` conversation ends up once a fleet instrument's sale is actually complete — the two skills aren't interchangeable. `Instrument Sale` handles the decision, pricing and listing; `Instrument Removal` handles closing the fleet record once money has changed hands.
 
---
 
### 📋 Review Open Items
**When:** User clicks card, or says "what needs attention?", "open items"
 
**Route to:** Inline response  
**What happens:**
1. Check `inventory.md` for:
   - Instruments with Status "In transit" or "Incoming inspection"
   - Serials marked 📷 (photo-read, unconfirmed)
   - Serials missing entirely (—)
   - Condition grades marked "Unknown"
2. Check `assignment.md` for:
   - Missing assignment log rows (newly arrived instruments)
   - Students with no instrument yet (Eli, Simon, etc.)
3. Check `sale-inventory.md` for:
   - Rows still at stage `Logged` or `Assessed` with no price
   - Items marked `Ready` that haven't moved to `Listed`
4. Check `students.md` for:
   - Students without a grade (rare, but flag if found)
5. List each with link to remedial workflow
6. Done
**Preamble:** "Here's what needs attention right now:"
 
---
 
## Tier 2: Secondary Workflows (Future)
 
*Music Purchasing, NYSSMA Solo Night, Music Library*
 
**Route:** Not implemented yet. When mentioned, say: "That's coming soon — not wired yet."
 
---
 
## Exception Handling
 
**If user describes something that doesn't match a workflow:**
- Ask clarifying questions to understand intent
- Route to the closest matching workflow once clear
- Example: "Tyler's trumpet came back from the shop" → Instrument Maintenance feedback → redirect to "mark MPR-007 as Available, update condition"
- Example: "I got $80 for the Bundy clarinet on Facebook" → Instrument Sale (record proceeds) → hands off to Instrument Removal (close the fleet record)
**If user wants to browse files without a skill:**
- Encourage it: "You can always read `students.md`, `inventory.md`, `assignment.md`, or `sale-inventory.md` directly anytime."
- Don't force them through a workflow
---
 
## Response Templates
 
### Minimal Preamble (Student Assignment)
```
What student are you assigning an instrument to?
```
 
### Tool Handoff (Instrument Tagging)
```
[present_files on /mnt/project/mpr-tags.html]
 
Here's the tag printer. Download it and open it in your browser —
the buttons don't work in the chat preview.
```
 
### Workflow Kickoff (Instrument Onboarding)
```
Let's log the new instrument. First, what arrived?
```
 
### Diagnostic (Instrument Maintenance)
```
Let's log the repair. Which instrument needs service?
```
 
### Kickoff (Instrument Sale)
```
What are we selling — a LOT item already in the sale pipeline,
or a fleet instrument?
```
 
### Kickoff (Instrument Removal)
```
Which instrument, and is it Sold, Retired, or External?
```
 
### Scan (Review Open Items)
```
Here's what needs attention right now:
- [list with links to fix workflows]
```
 