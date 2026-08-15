# Music Purchase

## Overview

Choose concert band music for the band that actually exists: current instrumentation, real student capability, exposed parts, and practical percussion — not the publisher's grade number on its own.

## Workflows

Eight phases, run in order:

1. Establish who is actually in the band
2. Identify the repertoire problem before searching
3. Write the target specification (ensemble, capability range, musical target, hard requirements, preferences, budget)
4. Search current publisher and vendor catalogs
5. Evaluate the piece against this ensemble (instrumentation, range, rhythm, independence, maturity, percussion, solos)
6. Score candidates on the 100-point rubric
7. Compare price, edition, and licensing
8. Deliver a ranked shortlist with a direct BUY / CONSIDER / STRETCH / PASS

## Files

- **SKILL.md** — The full skill prompt and instructions
- **manifest.json** — Metadata for Claude Enterprise
- **README.md** — This file

## How to Use

1. Share the skill with Claude Enterprise
2. Ask for repertoire recommendations, a concert program, or an evaluation of a specific piece
3. Claude records changes via `session-updates.md` (see `CLAUDE.md`) rather than rewriting project files directly — Claude Enterprise can't edit them in place

## Data Files

This skill reads and writes to (all flat in the project, no `data/` subfolder):

- **students.md** — Student roster and capability evidence
- **assignment.md** — Who is actually playing what
- **inventory.md** — Instruments available to cover parts
- **repertoire.md** — Music owned, performed, or deliberately rejected (`REP-###`)
- **sale-inventory.md** — Checked when a purchase overlaps something being disposed of

## Integration

Five skills work together:

1. **Instrument Purchase** — Brings instruments into the pipeline
2. **Instrument Inventory Management** — Assigns and tracks them
3. **Instrument Sales** — Removes them when the time comes
4. **Coupa Expense Reconciliation** — Ties money already spent back to the record
5. **Music Purchase** — Builds the repertoire library the ensemble plays

Sheet music and instruments stay in separate lanes: this skill never evaluates an instrument listing, and the instrument skills never recommend repertoire.

For what the program actually *paid* — Coupa expense history, or attaching a Coupa line to a purchased title — this skill hands off to **Coupa Expense Reconciliation**. It does not call Coupa MCP tools itself.
