---
name: coupa-expense-reconciliation
description: Reconcile instrument purchase and repair expenses against Coupa expense reports — matching receipt line items to inventory records, allocating shared shipping/tax across multi-item purchases, flagging cost variances, and recording the Coupa link for audit trail. Use this skill whenever the user mentions a Coupa expense report or invoice, asks to reconcile a receipt against inventory, mentions a multi-item order that needs splitting across instruments, or asks whether a repair invoice has been logged in Coupa. Do not use it to decide whether to buy or sell an instrument, or to log a new instrument or repair record — hand off to `instrument-purchase` or `instrument-inventory` for those; this skill only ties money already spent to the record that already exists.
---

# Coupa Expense Reconciliation

Ties money that's already been spent — a Coupa expense report or invoice — to the instrument record it paid for: which MPR ID(s) a line item covers, how to split shared shipping/tax across multiple instruments bought in one order, and whether the amount matches what's recorded as landed cost.

Failure modes this exists to prevent: an instrument's landed cost silently drifting from what was actually paid; a multi-item order where shipping/tax never gets divided, leaving one instrument's cost overstated and another's understated; and an expense sitting in Coupa that never gets tied to the instrument it bought, so an audit can't trace it back.

## Core principle

**Never guess an allocation.** If a receipt doesn't itemize enough to split cost per instrument, ask for the itemization rather than assuming an even split. An allocation the user can't verify against the receipt is worse than no allocation at all — flag it and ask.

## Where this skill stops

| Concern | Owned by |
|---|---|
| Matching a Coupa line/receipt to inventory records, allocating cost, flagging variance | **This skill** |
| Deciding to buy, evaluating a listing, calculating landed cost at acquisition time | `instrument-purchase` |
| Logging the instrument record itself, assigning an MPR ID | `instrument-inventory`, Workflow 1 |
| Logging a repair/service record | `instrument-inventory`, Workflow 4 |

## Files

| File | Role |
|---|---|
| `inventory.md` | Read: MPR ID, landed cost, purchase date, supplier, service records. Write: append the matched Coupa expense report ID and line item ID once reconciled |
| Coupa | Read expense reports, invoices, and line items via the Coupa MCP tools (`get_expense_reports`, `get_invoices`, `get_record_by_id`, `search_suppliers`) |

## Recording changes during a Claude Enterprise session

A Claude Enterprise project chat reads `inventory.md`, but it cannot edit it in place — nothing written during a conversation is real until it's back in `mpr-project/project-files/` in the actual repo. Handing back an entire regenerated `inventory.md` every time one reconciliation completes is heavy, hard for a human to review, and risks silently clobbering someone else's edit made in a different session.

**So: wherever this skill says to record or append a reconciliation, do this instead —** append a dated entry to `session-updates.md` describing the change, rather than rewriting `inventory.md` itself. Keep `session-updates.md` open as one running artifact for the whole conversation (present it via `present_files`, and append to the same artifact — don't start a new one per change).

**Entry format:**
```
## <ISO timestamp> — coupa-expense-reconciliation, Phase <n> (<phase name>)
**Target file:** inventory.md
**Change:** append reconciliation to <MPR ID> row / service record
coupa_reconciliation: { expense_report_id: ..., line_item_id: ..., allocated_total: ..., variance: ..., reconciliation_date: ... }
```

At the natural end of a reconciliation ("Done") or an audit sweep, remind the user once: "Download `session-updates.md` and bring it back to Claude Code — it merges these into the real file." Don't repeat the reminder after every entry within the same session.

---

# Two modes

**Purchase mode** (default) — reconciling an acquisition. Matching is loose (flex on exact serial wording, condition notes); shipping and tax get prorated across every matched item.

**Maintenance mode** — reconciling a repair invoice against a service record in `inventory.md`. Matching is strict: the vendor name and date must line up within ±3 days, and tax allocates to the repair cost only (no proration across instruments).

Ask which mode applies if it isn't obvious from context — a repair invoice from a shop reads differently from an eBay/Reverb purchase receipt.

---

# Four phases

## 1. Pull the expense and the candidate instrument(s)

Get the Coupa expense report (or invoice) and, from `inventory.md` or the current conversation, the instrument(s) it should cover — MPR ID, purchase/service date, landed cost, supplier. If the user names a report without the underlying receipt itemization and the expense covers 2+ items, ask for the receipt (HTML email, PDF, screenshot, or a plain list of item/price pairs) before doing anything else. Don't proceed on a single lump sum when multiple instruments are in play — allocation without itemization is a guess.

## 2. Match receipt items to inventory records

Work in this priority order, and stop at the first level that produces a confident match:

1. **Exact title match** (case-insensitive, normalized spacing) between the receipt line and the instrument's model in `inventory.md`.
2. **Model number + fuzzy name match** — pull the model number off the receipt and find the inventory record with the same model, tolerating "used" tags, reseller renaming, and spacing differences.
3. **Date window + supplier match**, as a fallback only — receipt date within ±3 days of the inventory purchase date, and a recognizable supplier name (see the vendor table below). Mark this level of match `⚠️ conditional` and confirm it with the user before recording it.

If a receipt item matches two or more inventory candidates, stop and ask which one — never pick the closer date or lower variance silently.

**Vendor name normalization** — Coupa merchant strings rarely match the plain supplier name recorded in `inventory.md`. Recognize these patterns (extend as new suppliers show up):

| Program supplier | Coupa pattern |
|---|---|
| eBay | `EBAY O*` prefix |
| Reverb | `Reverb`, case-insensitive |
| Appleseed Music | contains `Appleseed` |
| D&M Music | `D&M`, exact or fuzzy |
| Leaf Japan | fuzzy match on both words |

## 3. Allocate shared cost and check variance

For a single-item expense, no proration is needed — just compare the receipt total to the recorded landed cost and report the variance.

For a multi-item expense, prorate shipping and tax by each item's share of the item subtotal:

```
item's share of subtotal = item_price ÷ sum(all item_prices)
allocated_shipping = share × total_shipping
allocated_tax = share × total_tax
total_allocated = item_price + allocated_shipping + allocated_tax
```

Compare `total_allocated` against the instrument's recorded landed cost. Flag the variance if it exceeds **±$10 or ±2%, whichever is larger** (maintenance mode: ±$10 or ±5%, since repair invoices vary more). Also flag if the vendor on the receipt doesn't match the recorded supplier, or if the date gap exceeds 7 days — these usually mean a mismatch, not a rounding difference.

If the allocated total across all matched items doesn't add up to the full expense amount, say so explicitly and don't mark the reconciliation complete — either an item is missing from `inventory.md`, or an item on the receipt wasn't accounted for.

## 4. Record the result

Once matched (fully or partially), append the reconciliation to the instrument's row or service record in `inventory.md`: the Coupa expense report ID, line item ID, allocated total, variance amount and reason, and the reconciliation date. Leave unmatched items and open variance flags visible rather than silently dropping them — a partial reconciliation should look like one, not like a finished one.

If nothing in `inventory.md` matches at all, don't record anything — tell the user reconciliation failed and ask whether the instrument is logged yet (hand off to `instrument-inventory` Workflow 1 if not).

---

## Standalone use: periodic audit

The user can also ask for a reconciliation sweep over a date range (e.g. "reconcile everything from July") instead of one instrument at a time. Pull all Coupa expense reports/invoices in the window, run phases 2–4 against each, and summarize: what matched cleanly, what's still unmatched, and every open variance flag. Don't silently skip an item because it's ambiguous — list it as needing a decision.
