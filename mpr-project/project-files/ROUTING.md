# Concierge Routing Logic
 
**MPR Music Program — Workflow Router**
 
When a user selects a workflow or mentions a task, route them using this logic. **Minimal preamble. Max efficiency.**
 
---
 
## Entry point: `get started`
 
Present the workflow picker as a **tappable dropdown**, not rendered HTML and not a prose list. Project files cannot be rendered in chat, so there is no visual menu to load — the dropdown is the menu.
 
**Options to offer** — labeled as "Get Started with ___" rather than a bare noun, so the phrase the user actually sends (by tapping, or by typing it directly to skip the picker) gives each conversation a distinct, readable name instead of every chat opening on the same generic "get started":
- Get Started with Student Assignment
- Get Started with Instrument Tagging
- Get Started with Instrument Onboarding
- Get Started with Instrument Maintenance
- Get Started with Instrument Sale
- Get Started with Instrument Removal
- Get Started with Music Purchase
- Get Started with Review

Nothing else in the response. No preamble, no priority list, no summary of what each option does — the descriptions live in `GETTING_STARTED.md` and the user already knows their workflows. Surfacing time-sensitive items belongs to **Get Started with Review**, not to the picker.
 
Grade Progression is deliberately not in this picker — it runs once a year (August 1) and is triggered by the user naming it directly rather than by browsing a dropdown they'll see the other eleven months for no reason. It follows the same naming pattern if typed directly: "Get Started with Grade Progression".
 
End the turn after presenting the picker. The user's selection arrives as their next message — since that message is now the distinct "Get Started with ___" phrase rather than a single word, it also reads well as the conversation's name in chat history.
 
**Skipping the picker:** a user who already knows what they want can type the full phrase directly (e.g. "Get Started with Instrument Tagging") instead of typing `get started` first — same route, one less turn, and the phrase becomes the conversation's first message.
 
---
 
## Tier 1: Primary Workflows
 
### 🎓 Student Assignment
**When:** User clicks "Get Started with Student Assignment", or says "assign [instrument] to [student]"
 
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
**When:** User clicks "Get Started with Instrument Tagging", or says "print tags", "tag [MPR-ID]"
 
**Route to:** `mpr-tags.html` — surface the project copy with `present_files` so the user gets a file card with a download button. Do not simply tell them to open it locally; hand them the file.
 
**What happens:**
1. Call `present_files` on `/mnt/project/mpr-tags.html`
2. User downloads and opens it in their browser — print, Clear, and Reset only work at `file://` origin, not in the chat preview
3. Picks instrument from dropdown (fleet pre-loaded)
4. Tool warns about photo-read serials (📷) vs. confirmed (✅)
5. User picks MPR ID and position on sheet
6. User prints at 100%, Cardstock/Heavy
7. User clicks **Clear sheet** and confirms the print succeeded — the page downloads `session-updates-tag-print-YYYY-MM-DD.md` with `tag-log.md` rows
8. Remind once: drop that file in `/updates/` for Claude Code merge (then local `node generate-tags.js` clears the outstanding-tag flags)
**Preamble:** "Here's the tag printer. Download it and open it in your browser — the buttons don't work in the chat preview. After you print, use Clear sheet to save the tag-log session-updates file."
 
---
 
### 📦 Instrument Onboarding
**When:** User clicks "Get Started with Instrument Onboarding", or says "I received [instrument]", "new horn arrived"
 
**Route to:** `instrument-inventory` skill, Workflow 1  
**What happens:**
1. Skill asks: "What arrived?" (model, serial if visible)
2. Skill asks: "Who sold it?" (eBay, Reverb, etc.)
3. Skill asks: "Date and price?"
4. Skill asks: "Return deadline?" (if any)
5. Skill asks: "Condition assessment" (leadpipe, valves, slides, cosmetics)
6. Skill records the instrument as **`MPR-TBD`** (never invents a next MPR ID — merge assigns it) and writes inventory + photo-index deltas into `session-updates-<chat-name>.md`
7. Done — present the session-updates file for download
**Preamble:** "Let's log the new instrument. First, what arrived?"
 
---
 
### 🔧 Instrument Maintenance
**When:** User clicks "Get Started with Instrument Maintenance", or says "[student]'s horn needs repair", "sticky valves"
 
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
**When:** User clicks "Get Started with Instrument Sale", or says "I want to sell [instrument]", "list this on eBay/Facebook", "what's this worth", "help me price this clarinet"
 
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
**When:** User clicks "Get Started with Instrument Removal", or says "[instrument] sold", "retire [MPR-ID]", "we never owned that, take it off the roster"
 
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
**When:** User clicks "Get Started with Review", or says "what needs attention?", "open items"
 
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
 
### 🎼 Music Purchase
**When:** User clicks "Get Started with Music Purchase", or says "what music should we buy", "find repertoire for the fall concert", "will this piece work for our band", "build a concert program"

**Route to:** `music-purchase` skill  
**What happens:**
1. Skill establishes the current ensemble from `students.md`, `assignment.md`, and `inventory.md` — and asks whether the roster is current rather than assuming
2. Skill pins down the actual repertoire need (concert, count, level, educational goal, budget) before opening any catalog
3. Skill writes a target specification, then searches publisher and vendor catalogs against it
4. Skill evaluates each candidate against this ensemble — instrumentation, ranges, exposed parts, percussion practicality — not the published grade alone
5. Skill returns a ranked shortlist with a direct BUY / CONSIDER / STRETCH / PASS on each
6. On "let's buy these", Skill writes the purchase list and the `REP-###` rows via `session-updates.md`
7. Done
**Preamble:** "What are we buying music for — a specific concert, or filling a gap in the library?"

**Files:** `repertoire.md` (read/write), `students.md`, `assignment.md`, `inventory.md` (read)

This skill decides *what music to buy*. What the program actually **paid** — Coupa expense history, or attaching a Coupa line to a purchased title — belongs to `coupa-expense-reconciliation`.

---

### 💵 Expense Reconciliation
**When:** User mentions a Coupa expense report or invoice, asks "what did we already spend on this", "has this been reconciled", "split the shipping across these three", or asks what was already purchased in Coupa

**Route to:** `coupa-expense-reconciliation` skill  
**What happens:**
1. Skill finds the expense in Coupa by report ID, line ID, or exact merchant string
2. Skill matches receipt lines to `inventory.md` (instruments) or `repertoire.md` (sheet music)
3. Skill prorates shared shipping/tax and flags variance against the recorded cost
4. Skill records the Coupa reference via `session-updates.md`
5. Done
**Preamble:** "Which expense — do you have a report ID, or should I search by merchant?"

**Requires an active Coupa MCP connection.** Without it, say so plainly rather than guessing at spending history.

---

## Tier 2: Secondary Workflows (Future)
 
*NYSSMA Solo Night, Music Library*
 
**Route:** Not implemented yet. When mentioned, say: "That's coming soon — not wired yet."
 
---
 
## Exception Handling
 
**If user describes something that doesn't match a workflow:**
- Ask clarifying questions to understand intent
- Route to the closest matching workflow once clear
- Example: "Tyler's trumpet came back from the shop" → Instrument Maintenance feedback → redirect to "mark MPR-007 as Available, update condition"
- Example: "I got $80 for the Bundy clarinet on Facebook" → Instrument Sale (record proceeds) → hands off to Instrument Removal (close the fleet record)
- Example: "Did we already buy this march?" → Music Purchase reads `repertoire.md`; if the library record is thin, hands off to Expense Reconciliation for what Coupa shows
**If user wants to browse files without a skill:**
- Encourage it: "You can always read `students.md`, `inventory.md`, `assignment.md`, `sale-inventory.md`, or `repertoire.md` directly anytime."
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
the buttons don't work in the chat preview. After a successful print,
use Clear sheet to download the tag-log session-updates file, then drop
it in /updates/ for merge.
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
 
### Kickoff (Music Purchase)
```
What are we buying music for — a specific concert, or filling a gap
in the library?
```
 
### Kickoff (Expense Reconciliation)
```
Which expense — do you have a report ID, or should I search by merchant?
```
 
### Scan (Review Open Items)
```
Here's what needs attention right now:
- [list with links to fix workflows]
```

---

## End of every session (all workflows)

Before leaving the conversation that changed any record:

1. Ensure a single **`session-updates-<chat-name-slug>.md`** artifact exists (chat name from the "Get Started with ___" phrase or conversation title; kebab-case).
2. If photos were added this session, it must include an **`onboarding-photo-index.md`** section (filenames + what each shows) — not chat-only lists.
3. **`present_files`** that session-updates file and remind once: download → drop in `/updates/` for Claude Code merge.
4. Never invent a new `MPR-###` for a brand-new instrument — use `MPR-TBD` and brand/serial/photos; merge assigns the real ID.
 