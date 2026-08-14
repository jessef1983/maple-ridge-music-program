# Coupa Expense Reconciliation

## Overview

Ties Coupa expense reports and invoices to the instrument records they paid for — matching receipt line items to inventory rows, allocating shared shipping/tax across multi-item purchases, and flagging cost variances.

## Workflows

- Match a Coupa expense line to one or more instruments in `inventory.md`
- Split shared shipping/tax across a multi-item purchase
- Flag cost or vendor variance between the receipt and the recorded landed cost
- Record the Coupa expense report ID and line item ID against the instrument
- Run a periodic reconciliation sweep over a date range


## Files

- **SKILL.md** — The full skill prompt and instructions
- **manifest.json** — Metadata for Claude Enterprise
- **README.md** — This file

## How to Use

1. Share the skill with Claude Enterprise, alongside a connection to Coupa
2. Users can ask Claude to reconcile a Coupa expense report, invoice, or receipt against inventory
3. Claude reads from Coupa and `inventory.md`, and writes the reconciliation result back to `inventory.md`

## Data Files

This skill reads and writes to:
- **inventory.md** — Instrument fleet: landed cost, purchase date, supplier, service records

## Integration

Works alongside the other three skills:
1. **Instrument Purchase** — Brings instruments into the pipeline
2. **Instrument Inventory Management** — Assigns and tracks them; logs repairs
3. **Instrument Sales** — Removes them when the time comes
4. **Coupa Expense Reconciliation** — Ties the money already spent on 2 and 3 back to Coupa
