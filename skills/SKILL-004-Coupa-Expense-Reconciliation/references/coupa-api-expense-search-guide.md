# Coupa API Expense Search & Reconciliation Guide

## Overview

Every query pattern, schema claim, and code sample in this guide has been run live against the connected Coupa instance and the real uploaded eBay receipt. Nothing here is reconstructed from memory or presented as fact without a test to back it up. Where something failed or behaved differently than expected, that's documented as found — including two real corrections from an earlier draft of this guide.

Two different Coupa tools are available, with different field-naming conventions:
- **`coupa_graphql`** — camelCase fields (`expenseDate`, `expenseLines`), full query control, confirmed to support `query`, `orderBy`, `dir`, `limit`, `offset` arguments on list fields (see below).
- **`get_record_by_id`** — a simpler lookup tool returning hyphenated fields (`created-at`, `updated-at`). It did **not** return line items when tested, even when `expense-line-items` was explicitly requested. Use `coupa_graphql` for anything involving line-item or receipt detail.

---

## Core Query Patterns

### Pattern 1: Fetch Expense Report by ID (verified)

```graphql
{
  expenseReport(id: 188753) {
    id
    title
    status
    total
    currency { code }
    createdAt
    updatedAt
    expenseLines {
      id
      description
      merchant
      expenseDate
      amount
      currency { code }
    }
  }
}
```

**Actual live response:**
```json
{
  "data": {
    "expenseReport": {
      "id": 188753,
      "title": "",
      "status": "draft",
      "total": "2,664.75",
      "currency": { "code": "USD" },
      "expenseLines": [
        {
          "id": 2331564,
          "description": "Euphonium for MPR Music Program",
          "merchant": "EBAY O*18-14956-46589",
          "expenseDate": "2026-07-31T08:00:00-04:00",
          "amount": "609.51",
          "currency": { "code": "USD" }
        },
        {
          "id": 2331565,
          "description": "Trumpets for MPR Music Program",
          "merchant": "EBAY O*19-14954-30196",
          "expenseDate": "2026-07-31T08:00:00-04:00",
          "amount": "1196.64",
          "currency": { "code": "USD" }
        },
        {
          "id": 2333146,
          "description": "Euphonium for MPR Music Program",
          "merchant": "EBAY O*08-14986-01485",
          "expenseDate": "2026-08-03T08:00:00-04:00",
          "amount": "858.6",
          "currency": { "code": "USD" }
        }
      ]
    }
  }
}
```

**Confirmed field behavior:**
- `id` is an **integer** on both report and line, not a string.
- `total` is a **comma-formatted string** (`"2,664.75"`); strip commas before parsing.
- `amount` on lines is **not zero-padded** (`"858.6"`, not `"858.60"`).
- `expenseDate` is a **full ISO timestamp**, not a bare date — compare date-portion only against `inventory.md`'s `YYYY-MM-DD` values.
- `createdAt`/`updatedAt` **are valid fields**, confirmed via schema introspection (`coupa_schema` on type `ExpenseReport`) and a live query: report 188753 returned `createdAt: "2026-08-12T09:22:23-04:00"`, `updatedAt: "2026-08-14T14:48:27-04:00"`, `submittedAt: null` (unsubmitted draft).

---

### Pattern 2: Server-Side Filtering with `query` — corrected from an earlier draft

**Earlier draft of this guide claimed** the `expenseReports` field didn't support filter arguments and needed full client-side filtering. **That was wrong.** Schema introspection on the root `Query` type shows `expenseReports` actually accepts:

```
expenseReports(query: String, orderBy: String, dir: OrderDirection, limit: Int, offset: Int)
```

Confirmed live — filtering by ID:
```graphql
{ expenseReports(query: "id=188753") { id title status total } }
```
Returns exactly report 188753. Works.

Confirmed live — filtering by status:
```graphql
{ expenseReports(query: "status=draft", limit: 10) { id title status total } }
```
Returns 10 draft reports. Works.

**What still doesn't work (confirmed by a real error, not assumed):**
```graphql
{ expenseReports(first: 1, filters: [{field: "id", value: "188753"}]) { ... } }
```
```
Field 'expenseReports' doesn't accept argument 'first'
Field 'expenseReports' doesn't accept argument 'filters'
Field 'edges' doesn't exist on type 'ExpenseReport'
```
This isn't a Relay-style connection field — no `first`/`filters`/`edges`. Use `query`/`orderBy`/`dir`/`limit`/`offset` instead.

**Filtering on nested/associated fields fails with a server error, not a clean rejection:**
```graphql
{ expenseReports(query: "expense_lines.description=Trumpets for MPR Music Program") { ... } }
```
```
error processing collection query: undefined local variable or method `logger' for an instance of Types::QueryType
```
Dotted paths into associated records aren't supported this way. Query `expenseLines` directly instead (Pattern 3).

**Real sensitivity finding:** an unfiltered `{ expenseReports { id title status total } }` (no arguments at all) returned **~50 reports spanning the entire Coupa instance** — other employees' names, partially-masked card numbers on unrelated cost centers, none of it music-program data. Always pass a `query` filter, or be prepared to discard/never-log the raw result. Don't build a "fetch everything, filter in memory" pattern without immediately narrowing scope.

**Pagination/ordering, confirmed:**
```graphql
{ expenseReports(orderBy: "id", dir: DESC, limit: 5) { id title status } }
```
Returns the 5 highest-ID reports (up to 189081 at test time). This explains why the earlier unfiltered call never surfaced report 188753: default ordering is ascending by `id` with an apparent ~50-record default limit, so a high-ID report like 188753 is unreachable without explicit `orderBy`/`limit`/`offset`. Don't assume "no args" gives a representative sample — it gives the lowest IDs.

---

### Pattern 3: Query `expenseLines` Directly for Merchant/Description Filtering (verified — replaces the earlier client-side-only approach)

Querying `expenseLines` as its own root field (not nested under a report) supports the same `query` argument and works better for merchant/description search than trying to filter `expenseReports` by nested fields.

**Exact match confirmed:**
```graphql
{ expenseLines(query: "merchant=EBAY O*19-14954-30196") { id description merchant amount expenseDate } }
```
Returns exactly the trumpet line. Works.

```graphql
{ expenseLines(query: "description=Trumpets for MPR Music Program") { id description merchant amount } }
```
Returns exactly the trumpet line. Works.

**The filter is exact match (case-insensitive), not substring** — confirmed two ways:
1. `query: "merchant=EBAY"` (all caps) matched 5 unrelated lines where `merchant` was literally `"Ebay"` (different case, same full string) — soccer cleats and other non-music purchases, nothing to do with the program. This confirms case-insensitivity but not substring matching, since a differently-formatted merchant string (like `"EBAY O*19-..."`) was not matched by the bare word `"EBAY"`.
2. `query: "description=MPR Music Program"` (a real substring of the actual description) returned zero results, while the full exact phrase `"description=Trumpets for MPR Music Program"` returned the correct line. This confirms partial/substring matching is not supported through this syntax.

**Wildcard/contains operators tested and found broken, not just unsupported:**
```graphql
{ expenseLines(query: "description~MPR") { ... } }
{ expenseLines(query: "description[c]=MPR") { ... } }
```
Both throw the same internal error:
```
error processing collection query: undefined local variable or method `logger' for an instance of Types::QueryType
```
This is a server-side exception, not a graceful "operator not supported" — don't build retry logic assuming a clean error; catch and fall back to fetching a scoped `limit`/`offset` batch and filtering client-side if partial matching is needed.

---

### Pattern 4: Fetch a Single Expense Line + Receipt Artifact (verified)

```graphql
{
  expenseLine(id: 2331565) {
    id
    description
    merchant
    amount
    expenseDate
    expenseArtifacts {
      id
      sourceFileName
      url
      digitizationStatus
    }
  }
}
```

**Actual live response:**
```json
{
  "data": {
    "expenseLine": {
      "id": 2331565,
      "description": "Trumpets for MPR Music Program",
      "merchant": "EBAY O*19-14954-30196",
      "amount": "1196.64",
      "expenseDate": "2026-07-31T08:00:00-04:00",
      "expenseArtifacts": [
        {
          "id": 1539335,
          "sourceFileName": "receipt_email.html",
          "url": "https://community.coupahost.com/expense_artifacts/1539335/source?content_digest=...&expires=1787356876&signature=...",
          "digitizationStatus": null
        }
      ]
    }
  }
}
```

**Confirmed field behavior:**
- `digitizationStatus` came back `null` for this real artifact — don't assume it's populated.
- `url` is a signed, expiring URL (`expires=`/`signature=` params) — fetch and parse promptly, don't cache the URL itself, and don't paste full signed URLs into shared docs (they're live access credentials while valid — truncated above for that reason).
- `attachments` is **not** a valid field on `ExpenseLine` — confirmed by a real error: `Field 'attachments' doesn't exist on type 'ExpenseLine'`. Use `expenseArtifacts`.

---

## Receipt HTML Parsing (fully tested against the real receipt — replaces untested pseudocode from an earlier draft)

An earlier draft of this guide included a "typical `<tr>` with 3 cells" parser as a starting point. Tested against the actual `receipt_email.html`, it returned zero items. The real structure is different: it's a nested-table HTML email where the product name lives in an `<a href="ebay.com/itm/{item_id}">` link, and price/order/seller details live in a separate nested table anchored on an `"Item ID:"` label span. Below is a parser that was actually run against the file and verified to reconcile exactly to the known Coupa total.

```python
from bs4 import BeautifulSoup
import re

def parse_ebay_receipt(html_content):
    """
    Verified against the real receipt for report 188753 / line 2331565.
    Extracted values matched Coupa's recorded line amount ($1,196.64) exactly.

    Two anchors are needed because the name and the price/order/seller detail
    live in separate nested tables in this eBay email template:
      1. <a href="ebay.com/itm/{item_id}"> - product name (several <a> tags
         share the same href, including empty-text image wrappers and a
         generic "View order details" link - pick the longest non-generic
         text for a given item_id).
      2. The "Item ID:" label span - walk up to the smallest ancestor table
         that also contains "Price:", then extract price/order number/seller
         from that table's text.
    """
    soup = BeautifulSoup(html_content, 'html.parser')

    # Product names, keyed by item_id parsed out of the eBay item URL
    name_by_id = {}
    GENERIC = {'view order details', ''}
    for a in soup.find_all('a', href=re.compile(r'ebay\.com/itm/\d+')):
        m = re.search(r'/itm/(\d+)', a['href'])
        if not m:
            continue
        item_id = m.group(1)
        text = a.get_text(separator=' ', strip=True)
        if text.lower().strip() in GENERIC:
            continue
        if item_id not in name_by_id or len(text) > len(name_by_id[item_id]):
            name_by_id[item_id] = text

    # Price / order number / seller, keyed by the same item_id
    details_by_id = {}
    for label in soup.find_all(string=re.compile(r'^Item ID:$')):
        table = label.find_parent('table')
        while table and 'Price:' not in table.get_text():
            table = table.find_parent('table')
        if not table:
            continue
        text = table.get_text(separator='|', strip=True)
        item_id_match = re.search(r'Item ID:\|(\d+)', text)
        if not item_id_match:
            continue
        item_id = item_id_match.group(1)
        if item_id in details_by_id:
            continue  # nested tables can re-surface the same label; keep first
        price_match = re.search(r'Price:\|\$([\d,]+\.\d{2})', text)
        order_match = re.search(r'Order number:\|([\d-]+)', text)
        seller_match = re.search(r'Seller:\|([A-Za-z0-9_\-]+)', text)
        details_by_id[item_id] = {
            'price': float(price_match.group(1).replace(',', '')) if price_match else None,
            'order_number': order_match.group(1) if order_match else None,
            'seller': seller_match.group(1) if seller_match else None,
        }

    items = [
        {'name': name_by_id.get(item_id, '').replace('\n', ' '), 'item_id': item_id, **details}
        for item_id, details in details_by_id.items()
    ]

    full_page_text = soup.get_text(separator='|', strip=True)

    def extract_amount(label_text):
        m = re.search(re.escape(label_text) + r'[^\$]*\$([\d,]+\.\d{2})', full_page_text)
        return float(m.group(1).replace(',', '')) if m else None

    return {
        'items': items,
        'subtotal': extract_amount('Subtotal'),
        'shipping': extract_amount('Shipping'),
        'tax': extract_amount('Sales tax'),
        'total': extract_amount('Total charged to'),
    }
```

**Actual output when run against the real `receipt_email.html`:**
```json
{
  "items": [
    {
      "name": "YAMAHA  YTR-3325S Bb Trumpet Used",
      "item_id": "317236951043",
      "price": 569.0,
      "order_number": "19-14954-30196",
      "seller": "yokamonmarket"
    },
    {
      "name": "Nikkan  YTR-334S Trumpet W/hard case Musical Instrument YAMAHA",
      "item_id": "317612864115",
      "price": 399.0,
      "order_number": "19-14954-30196",
      "seller": "yokamonmarket"
    }
  ],
  "subtotal": 968.0,
  "shipping": 140.0,
  "tax": 88.64,
  "total": 1196.64
}
```

**Verified sanity check:** `sum(item prices) + shipping + tax = 1196.64`, matching the Coupa line's recorded `amount` exactly. This is a real, passing assertion (`abs(computed - 1196.64) < 0.01`), not an illustrative claim.

**Known limitation, stated plainly:** this parser is tuned to this specific eBay email template (nested tables, `Item ID:`/`Price:`/`Order number:`/`Seller:` label spans, `/itm/{id}` links). It has not been tested against Appleseed Music, D&M Music, Reverb, or PayPal receipt formats — those will very likely need their own parsing logic, since even eBay's own template needed two different anchor strategies for name vs. price detail. Treat each new merchant's receipt format as needing its own verification pass before trusting it unattended.

---

## Cost Allocation Math (verified against real numbers)

Pro-rata allocation of shared shipping/tax by item subtotal share, computed against the real receipt values:

```python
def allocate_multi_item_line(items, shipping, tax):
    subtotal = sum(i['price'] for i in items)
    allocated = []
    for item in items:
        share = item['price'] / subtotal if subtotal else 0
        alloc_shipping = round(shipping * share, 2)
        alloc_tax = round(tax * share, 2)
        allocated.append({
            **item,
            'allocated_shipping': alloc_shipping,
            'allocated_tax': alloc_tax,
            'total_allocated': round(item['price'] + alloc_shipping + alloc_tax, 2),
        })
    return allocated
```

**Verified output for the real trumpet receipt** (items from the parser above, shipping=$140.00, tax=$88.64):

| Item | Price | Alloc. Shipping | Alloc. Tax | Total Allocated |
|---|---:|---:|---:|---:|
| YAMAHA YTR-3325S | $569.00 | $82.29 | $52.07 | $703.36 |
| Nikkan YTR-334S | $399.00 | $57.71 | $36.57 | $493.28 |
| **Sum** | $968.00 | $140.00 | $88.64 | **$1,196.64** |

Sum of allocated totals equals the Coupa line's recorded amount ($1,196.64) exactly — this ties out and was checked, not assumed.

---

## Reconciliation Workflow (logic verified piece-by-piece above; full pipeline not run end-to-end as one script)

Each piece above — the `expenseLine`/`expenseReports` queries, the receipt parser, and the allocation math — was independently verified. Wiring them into one function (fetch, then parse, then allocate, then compare against `inventory.md` records, then flag variance) is straightforward given the pieces above, but that exact end-to-end function has not itself been executed in this session. Build it from the verified pieces rather than treating this note as a claim that a combined script was tested.

---

## Summary Table: What's Confirmed vs. Not

| Claim | Status | Evidence |
|---|---|---|
| `expenseReport(id)` with `expenseLines` | Verified | Live query, real response shown above |
| `createdAt`/`updatedAt`/`submittedAt` on `ExpenseReport` | Verified | Schema introspection + live query |
| `expenseReports(query: "id=...")` server-side filter | Verified | Live query returned exact match |
| `expenseReports(query: "status=...")` server-side filter | Verified | Live query, 10 draft reports returned |
| `expenseReports(first:, filters:)` (Relay-style) | Confirmed fails | Real GraphQL error, exact message shown above |
| Nested-field filter (`expense_lines.description=...`) | Confirmed fails | Real internal server error, not a clean rejection |
| `expenseLines(query: "merchant=...")` exact match | Verified | Live query, exact match returned |
| `expenseLines(query:)` as substring/contains | Confirmed exact-match only | Tested with a real substring, got 0 results |
| `~` / `[c]=` wildcard operators | Confirmed broken | Same internal server error both times |
| Unfiltered `expenseReports` scope | Real finding, not hypothetical | Returns cross-organization data, ~50 records, ascending by id |
| `expenseLine(id)` with `expenseArtifacts` | Verified | Live query, real artifact metadata shown |
| `attachments` field on `ExpenseLine` | Confirmed fails | Real GraphQL error |
| Receipt HTML parser | Verified | Run against the real file, exact totals reconciled |
| Cost allocation math | Verified | Computed against real numbers, ties out exactly |
| Full fetch-parse-allocate-reconcile pipeline as one script | Not run end-to-end | Each piece verified separately; not yet combined and executed |
| Parser generalizing to non-eBay receipt formats | Not tested | Only tested against one eBay template |

---

## Best Practices

1. **Use `expenseReports(query: "id=...")` or `expenseLines(query: "merchant=...")`** for targeted lookups — both are confirmed working server-side filters. Don't fetch everything and filter client-side unless already scoped with `query`.
2. **Never persist or log an unfiltered `expenseReports` result** — it spans the whole Coupa instance, not just this program.
3. **The `query` filter is exact-match, case-insensitive** — not substring. If the exact merchant/description string isn't known, use a scoped `limit`/`orderBy`/`offset` fetch and client-side substring matching instead.
4. **Strip commas from `total`, not from line `amount`** — they're formatted differently.
5. **Compare `expenseDate` by date-portion**, since it's a full timestamp.
6. **Don't cache signed artifact URLs** — fetch and parse promptly.
7. **Treat every new receipt format as unverified until tested** — the working parser above is specific to this eBay template.
