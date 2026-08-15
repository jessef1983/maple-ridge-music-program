# Coupa Expense Reconciliation

## Overview

Ties Coupa expense reports and invoices to the records they paid for — searching Coupa for what was actually spent, matching receipt line items to inventory or repertoire rows, allocating shared shipping/tax across multi-item purchases, and flagging cost variances.

## Workflows

- Find an expense in Coupa by report ID, line ID, or exact merchant string
- Match a Coupa expense line to one or more instruments in `inventory.md`
- Match a sheet-music expense to a `REP-###` title in `repertoire.md` (music mode)
- Split shared shipping/tax across a multi-item purchase
- Flag cost or vendor variance between the receipt and the recorded cost
- Record the Coupa expense report ID and line item ID against the record
- Run a periodic reconciliation sweep over a date range

## Files

- **SKILL.md** — The full skill prompt and instructions
- **manifest.json** — Metadata for Claude Enterprise
- **references/coupa-api-expense-search-guide.md** — Live-verified query patterns, real responses, confirmed failures, and a tested eBay receipt parser
- **README.md** — This file

## Querying Coupa

The connector rejects several plausible-looking query forms with internal server errors rather than empty results, so **read the Querying Coupa section of SKILL.md before writing any query.** The short version:

- Use `coupa_graphql` for anything involving line items or receipts; `get_record_by_id` returns no lines
- `expenseReports` and `expenseLines` accept `query`, `orderBy`, `dir`, `limit`, `offset` — not `first`, `filters`, or `edges`
- The `query` filter is exact-match and case-insensitive; there is no substring or wildcard operator
- Never send an unfiltered query — it returns expense data from across the whole organization

## How to Use

1. Share the skill with Claude Enterprise, alongside a connection to Coupa
2. Ask Claude to reconcile a Coupa expense report, invoice, or receipt, or to find what was already paid for something
3. Claude reads from Coupa and the relevant project file, and records the result via `session-updates.md`

## Data Files

This skill reads and writes to:

- **inventory.md** — Instrument fleet: landed cost, purchase date, supplier, service records
- **repertoire.md** — Sheet music library: `REP-###`, title, vendor, purchase date, price

## Integration

Works alongside the other four skills, which together cover the full lifecycle:

1. **Instrument Purchase** — Brings instruments into the pipeline
2. **Instrument Inventory Management** — Assigns and tracks them; logs repairs
3. **Instrument Sales** — Removes them when the time comes
4. **Music Purchase** — Chooses repertoire and owns `repertoire.md`; hands off here for spending history
5. **Coupa Expense Reconciliation** — Ties the money already spent on the above back to Coupa
