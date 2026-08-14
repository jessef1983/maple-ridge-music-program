# Instrument Purchase

## Overview

Evaluate and acquire instruments: verify specs, calculate landed cost, bid strategically, track return windows.

## Workflows

- Confirm the program actually needs the instrument
- Define the target specification
- Read listings for verifiable facts (not marketing)
- Research comparable prices and models
- Place bids with discipline
- Track in-transit status and return deadlines
- Hand off to Instrument Onboarding when the box arrives


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
