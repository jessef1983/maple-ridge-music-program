---
name: coupa-expense-reconciliation
description: Reconcile instrument, repair, and sheet-music expenses against Coupa expense reports — searching Coupa for what was actually paid, matching receipt line items to inventory or repertoire records, allocating shared shipping/tax across multi-item purchases, flagging cost variances, and recording the Coupa link for audit trail. Use this skill whenever the user mentions a Coupa expense report or invoice, asks to reconcile a receipt, asks what the program already spent or already purchased in Coupa, mentions a multi-item order that needs splitting, or asks whether a repair invoice has been logged. Do not use it to decide whether to buy or sell an instrument, to log a new instrument or repair record, or to choose repertoire — hand off to `instrument-purchase`, `instrument-inventory`, or `music-purchase` for those; this skill only ties money already spent to the record that already exists.
---

# Coupa Expense Reconciliation

Ties money that's already been spent — a Coupa expense report or invoice — to the instrument record it paid for: which MPR ID(s) a line item covers, how to split shared shipping/tax across multiple instruments bought in one order, and whether the amount matches what's recorded as landed cost.

Failure modes this exists to prevent: an instrument's landed cost silently drifting from what was actually paid; a multi-item order where shipping/tax never gets divided, leaving one instrument's cost overstated and another's understated; and an expense sitting in Coupa that never gets tied to the instrument it bought, so an audit can't trace it back.

## Core principle

**Never guess an allocation.** If a receipt doesn't itemize enough to split cost per instrument, ask for the itemization rather than assuming an even split. An allocation the user can't verify against the receipt is worse than no allocation at all — flag it and ask.

## Where this skill stops

| Concern | Owned by |
|---|---|
| Matching a Coupa line/receipt to inventory or repertoire records, allocating cost, flagging variance | **This skill** |
| Deciding to buy, evaluating a listing, calculating landed cost at acquisition time | `instrument-purchase` |
| Logging the instrument record itself, assigning an MPR ID | `instrument-inventory`, Workflow 1 |
| Logging a repair/service record | `instrument-inventory`, Workflow 4 |
| Choosing repertoire, evaluating a piece, deciding what music to buy | `music-purchase` |

## Files

| File | Role |
|---|---|
| `inventory.md` | Read: MPR ID, landed cost, purchase date, supplier, service records. Write: append the matched Coupa expense report ID and line item ID once reconciled |
| `repertoire.md` | Read: `REP-###`, title, vendor, purchase date, price. Write: append the matched Coupa expense report/line ID to a purchased title. Used in music mode — see "Three modes" |
| Coupa | Query expense reports, expense lines, invoices, and receipt artifacts via the Coupa MCP tools. **`coupa_graphql` is the primary tool** — see "Querying Coupa" below before writing any query |

## Recording changes during a Claude Enterprise session

A Claude Enterprise project chat reads `inventory.md`, but it cannot edit it in place — nothing written during a conversation is real until it's back in `mpr-project/project-files/` in the actual repo. Handing back an entire regenerated `inventory.md` every time one reconciliation completes is heavy, hard for a human to review, and risks silently clobbering someone else's edit made in a different session.

**So: wherever this skill says to record or append a reconciliation, do this instead —** append a dated entry to `session-updates-<chat-name-slug>.md` describing the change, rather than rewriting `inventory.md` itself. Keep one running artifact for the whole conversation (present via `present_files`, append in place). **Filename must include the chat name** (kebab-case). At session end, always present that file for download into `/updates/`.

**Entry format:**
```
## <ISO timestamp> — coupa-expense-reconciliation, Phase <n> (<phase name>)
**Target file:** inventory.md
**Change:** append reconciliation to <MPR ID> row / service record
coupa_reconciliation: { expense_report_id: ..., line_item_id: ..., allocated_total: ..., variance: ..., reconciliation_date: ... }
```

In music mode the same format applies with **Target file:** `repertoire.md` and the change appended to the `REP-###` row.

At the natural end of a reconciliation ("Done") or an audit sweep, present the session-updates file and remind once: "Download this and drop it in `/updates/` — Claude Code merges these into the real file."

---

# Querying Coupa

**Read this before writing any query.** Every pattern here was run live against the connected Coupa instance; the full evidence, real responses, and exact error messages are in [`references/coupa-api-expense-search-guide.md`](references/coupa-api-expense-search-guide.md). Improvising query syntax is how this skill fails — several plausible-looking forms don't return empty results, they throw internal server errors.

## Which tool

| Tool | Use for | Field style |
|---|---|---|
| `coupa_graphql` | **Everything involving lines, receipts, or filtering.** Full query control | camelCase (`expenseDate`, `expenseLines`) |
| `get_record_by_id` | Header-level lookup only | hyphenated (`created-at`) |
| `coupa_schema` | Introspection when a field name is uncertain — check rather than guess | — |

`get_record_by_id` **does not return line items**, even when `expense-line-items` is requested explicitly. Anything involving a receipt or an allocation needs `coupa_graphql`.

## The four working patterns

**1. Expense report by ID, with its lines:**
```graphql
{ expenseReport(id: 188753) {
    id title status total currency { code } createdAt updatedAt
    expenseLines { id description merchant expenseDate amount currency { code } } } }
```

**2. Filtered report list** — `expenseReports` accepts `query`, `orderBy`, `dir`, `limit`, `offset`:
```graphql
{ expenseReports(query: "status=draft", orderBy: "id", dir: DESC, limit: 10) { id title status total } }
```

**3. Line search by merchant or description** — query `expenseLines` as a root field:
```graphql
{ expenseLines(query: "merchant=EBAY O*19-14954-30196") { id description merchant amount expenseDate } }
```

**4. A line's receipt artifact:**
```graphql
{ expenseLine(id: 2331565) { id description merchant amount expenseDate
    expenseArtifacts { id sourceFileName url digitizationStatus } } }
```

## What fails, and how

| Don't write | What actually happens |
|---|---|
| `first:`, `filters:`, `edges` | Hard rejection — these are not Relay connection fields |
| `query: "expense_lines.description=…"` | Internal server error, not a clean rejection. Query `expenseLines` directly instead |
| `query: "description~MPR"` or `"description[c]=MPR"` | Same internal server error. There is no wildcard/contains operator |
| `attachments` on `ExpenseLine` | Field doesn't exist — it's `expenseArtifacts` |
| A partial string as a filter value | Returns zero rows, silently. See below |

**The `query` filter is exact-match and case-insensitive — never substring.** `description=MPR Music Program` returns nothing when the real description is `Trumpets for MPR Music Program`. When the exact string isn't known, fetch a scoped batch with `orderBy`/`limit`/`offset` and match client-side. Don't retry with an operator; the operators throw.

**Never send an unfiltered `expenseReports` query.** With no arguments it returns roughly 50 records from across the entire Coupa instance — other employees' expenses, unrelated cost centers, partially-masked card numbers, none of it program data. Always pass a `query`. Never log that output, never paste it into chat wholesale, and never let it reach `session-updates.md`.

**No-argument queries also mislead.** The default is ascending by `id` with a ~50-record cut, so recent high-id reports look like they don't exist. If a report seems missing, it usually isn't — re-query with `orderBy: "id", dir: DESC` and explicit paging before telling the user anything is absent.

## Reading the values back

Small format mismatches here produce silent reconciliation errors:

- **`total`** is a comma-formatted string (`"2,664.75"`) — strip commas before parsing. Line **`amount`** is not zero-padded (`"858.6"`, not `"858.60"`)
- **`id`** is an integer on both report and line, not a string
- **`expenseDate`** is a full ISO timestamp — compare the date portion only against `inventory.md`'s `YYYY-MM-DD` values
- **`digitizationStatus`** can be `null` on a perfectly good artifact — don't treat that as a failure
- Artifact **`url`** is signed and expiring — fetch and parse it promptly, don't cache it, and don't paste a full signed URL anywhere; while valid it is a live access credential

## When a query errors

Stop and report the actual error text. Try the documented alternative above once. Do not invent a new filter syntax and do not loop — an unrecognized error means the reference guide needs updating, which is worth saying out loud.

---

# Three modes

**Purchase mode** (default) — reconciling an instrument acquisition. Matching is loose (flex on exact serial wording, condition notes); shipping and tax get prorated across every matched item.

**Maintenance mode** — reconciling a repair invoice against a service record in `inventory.md`. Matching is strict: the vendor name and date must line up within ±3 days, and tax allocates to the repair cost only (no proration across instruments).

**Music mode** — reconciling a sheet-music purchase against `repertoire.md` instead of `inventory.md`. Match on title and vendor, write the Coupa reference onto the `REP-###` row, and hand anything about whether the music was a good choice back to `music-purchase`. If a music expense has no matching `REP-###` yet, don't invent one from the merchant string — report what Coupa shows and let `music-purchase` confirm the actual title and edition.

Ask which mode applies if it isn't obvious from context — a repair invoice from a shop reads differently from an eBay purchase receipt, and a JW Pepper order differently again.

---

# Four phases

## 1. Pull the expense and the candidate record(s)

Get the Coupa expense report (or invoice) and, from `inventory.md`, `repertoire.md`, or the current conversation, the record(s) it should cover — MPR ID or REP ID, purchase/service date, landed cost, supplier.

**How to find it, in order of preference:**

1. The user names a report or line ID → `expenseReport(id:)` or `expenseLine(id:)` directly
2. The user names a merchant string exactly → `expenseLines(query: "merchant=…")`
3. Neither → a scoped `expenseReports(query: "status=…", orderBy: "id", dir: DESC, limit: …)` and narrow from there

Never start with an unfiltered fetch (see "Querying Coupa"). If the first query returns nothing, check the exact-match rule before concluding the expense doesn't exist — a partial merchant string returns zero rows silently.

Prefer the receipt artifact over asking the user for itemization: `expenseLine(id:) { expenseArtifacts { … } }` often already has the receipt attached. If the artifact is missing or unparseable and the expense covers 2+ items, ask for the receipt (HTML email, PDF, screenshot, or a plain list of item/price pairs) before doing anything else. Don't proceed on a single lump sum when multiple items are in play — allocation without itemization is a guess.

## 2. Match receipt items to the record

Match against `inventory.md` in purchase/maintenance mode, or `repertoire.md` in music mode. Work in this priority order, and stop at the first level that produces a confident match:

1. **Exact title match** (case-insensitive, normalized spacing) between the receipt line and the instrument's model in `inventory.md`, or the title in `repertoire.md`.
2. **Model number + fuzzy name match** — pull the model number off the receipt and find the inventory record with the same model, tolerating "used" tags, reseller renaming, and spacing differences. In music mode, match composer/arranger and publisher alongside the title.
3. **Date window + supplier match**, as a fallback only — receipt date within ±3 days of the recorded purchase date, and a recognizable supplier name (see the vendor table below). Mark this level of match `⚠️ conditional` and confirm it with the user before recording it.

If a receipt item matches two or more candidates, stop and ask which one — never pick the closer date or lower variance silently.

**Parsing a receipt artifact.** A worked, verified parser for the eBay HTML email template lives in [`references/coupa-api-expense-search-guide.md`](references/coupa-api-expense-search-guide.md) — it reconciled to the recorded line amount exactly. It is tuned to that one template (nested tables, `/itm/{id}` links, `Item ID:`/`Price:` labels). **Appleseed, D&M, Reverb, PayPal, and sheet-music vendor formats are unverified.** Treat a new merchant's receipt as needing its own check: parse it, then confirm the extracted items and totals tie back to the Coupa line amount before trusting any allocation built on them. If they don't tie out, say so rather than recording a plausible-looking split.

**Vendor name normalization** — Coupa merchant strings rarely match the plain supplier name recorded in `inventory.md`. Recognize these patterns (extend as new suppliers show up):

| Program supplier | Coupa pattern |
|---|---|
| eBay | `EBAY O*<order number>` — the order number is part of the string, so each order is a **different** merchant value. A bare `merchant=EBAY` matches only lines literally stored as `Ebay`, which are usually unrelated non-program purchases |
| Reverb | `Reverb`, case-insensitive |
| Appleseed Music | contains `Appleseed` |
| D&M Music | `D&M`, exact or fuzzy |
| Leaf Japan | fuzzy match on both words |
| Sheet-music vendors (JW Pepper, Sheet Music Plus, Hal Leonard, …) | Not yet confirmed against real Coupa strings — record the exact merchant value the first time one appears, and add it here |

Remember that the server-side filter can't do any of this fuzziness. Use it only with a full exact string; everything above is client-side matching over a scoped result set.

## 3. Allocate shared cost and check variance

For a single-item expense, no proration is needed — just compare the receipt total to the recorded landed cost and report the variance.

For a multi-item expense, prorate shipping and tax by each item's share of the item subtotal:

```
item's share of subtotal = item_price ÷ sum(all item_prices)
allocated_shipping = share × total_shipping
allocated_tax = share × total_tax
total_allocated = item_price + allocated_shipping + allocated_tax
```

This pro-rata split is the same math verified against a real multi-item eBay receipt in the reference guide, where the allocated totals summed back to the Coupa line amount exactly. Sum your allocations and check them against the line `amount` the same way — remembering that `amount` isn't zero-padded and `total` carries commas.

Compare `total_allocated` against the recorded landed cost (or the recorded price in `repertoire.md`). Flag the variance if it exceeds **±$10 or ±2%, whichever is larger** (maintenance mode: ±$10 or ±5%, since repair invoices vary more). Also flag if the vendor on the receipt doesn't match the recorded supplier, or if the date gap exceeds 7 days — these usually mean a mismatch, not a rounding difference. Compare dates by date-portion only; `expenseDate` is a full timestamp.

If the allocated total across all matched items doesn't add up to the full expense amount, say so explicitly and don't mark the reconciliation complete — either an item is missing from the record, or an item on the receipt wasn't accounted for.

## 4. Record the result

Once matched (fully or partially), append the reconciliation to the instrument's row or service record in `inventory.md` — or to the `REP-###` row in `repertoire.md` in music mode: the Coupa expense report ID, line item ID, allocated total, variance amount and reason, and the reconciliation date. Leave unmatched items and open variance flags visible rather than silently dropping them — a partial reconciliation should look like one, not like a finished one.

Record only the fields above. Raw query output stays in the conversation and never goes into `session-updates.md`, since a Coupa result set can carry unrelated people's expense data.

If nothing matches at all, don't record anything — tell the user reconciliation failed and ask whether the item is logged yet (hand off to `instrument-inventory` Workflow 1 for an instrument, or `music-purchase` for a title that belongs in `repertoire.md`).

---

## Standalone use: periodic audit

The user can also ask for a reconciliation sweep over a date range (e.g. "reconcile everything from July") instead of one item at a time.

**There is no server-side date-range filter** — range operators error, and dotted paths into associated records error. Build the sweep this way instead:

1. Scope with a filter that does work: `expenseReports(query: "status=…", orderBy: "id", dir: DESC, limit: 50, offset: …)`, paging until you've covered the period.
2. Pull `expenseLines` per report and filter to the date window **client-side**, on the date portion of `expenseDate`.
3. Run phases 2–4 against each line.

Summarize: what matched cleanly, what's still unmatched, and every open variance flag. Don't silently skip an item because it's ambiguous — list it as needing a decision. If paging was cut short, say where it stopped rather than presenting a partial sweep as complete.
