# Instrument Sales

## Overview

Manage the disposal pipeline: identify instruments, price against comps, create listings, ship, and record proceeds.

## Workflows

- Decide if an instrument should leave the program
- Identify brand, model, materials, condition from photographs
- Price against sold comparables (not asking prices)
- Write eBay and Facebook Marketplace listings
- Manage shipping and packing costs
- Record sales proceeds and hand off to Instrument Removal


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
