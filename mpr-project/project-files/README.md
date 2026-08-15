# Instrument Inventory Management

## Overview

Core workflows for managing the music program's instrument fleet.

## Workflows

- Assign an instrument to a student
- Print permanent and student tags
- Log a new instrument at intake
- Record repairs and maintenance
- Annual grade progression and graduation
- Mark instruments sold, retired, or external


## Files

- **SKILL.md** — The full skill prompt and instructions
- **manifest.json** — Metadata for Claude Enterprise
- **README.md** — This file

## How to Use

1. Share the skill with Claude Enterprise
2. Users can ask Claude to help with any of the workflows above
3. Claude records changes via `session-updates.md` (see `CLAUDE.md`) rather than rewriting project files directly — Claude Enterprise can't edit them in place

## Data Files

This skill reads and writes to (all flat in this project, no `data/` subfolder):
- **students.md** — Student roster
- **inventory.md** — Instrument fleet
- **assignment.md** — Assignments and history
- **sale-inventory.md** — Disposal pipeline
- **watchlist.md** — Purchase candidates
- **tag-log.md** — Tag print log
- **repertoire.md** — Concert band music library (`REP-###`)

## Integration

All five skills work together:
1. **Instrument Purchase** — Brings instruments into the pipeline
2. **Instrument Inventory Management** — Assigns and tracks them
3. **Instrument Sales** — Removes them when the time comes
4. **Music Purchase** — Builds the repertoire library the ensemble plays
5. **Coupa Expense Reconciliation** — Ties money already spent on 1–4 back to Coupa
