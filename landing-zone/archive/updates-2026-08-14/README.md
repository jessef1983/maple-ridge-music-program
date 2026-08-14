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
3. Claude reads/writes to the data/ files in the project

## Data Files

This skill reads and writes to:
- **data/students.md** — Student roster
- **data/inventory.md** — Instrument fleet
- **data/assignment.md** — Assignments and history
- **data/sale-inventory.md** — Disposal pipeline
- **data/watchlist.md** — Purchase candidates

## Integration

All three skills work together:
1. **Instrument Purchase** — Brings instruments into the pipeline
2. **Instrument Inventory Management** — Assigns and tracks them
3. **Instrument Sales** — Removes them when the time comes
