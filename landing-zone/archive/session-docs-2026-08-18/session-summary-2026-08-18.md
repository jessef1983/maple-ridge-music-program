# Session Summary: August 17–18, 2026
## Facebook Marketplace automation feasibility · Playwright MCP setup

**Date:** Aug 17 15:55 EDT → Aug 18 16:52 EDT
**Focus:** Tooling investigation only — can FBM listings be posted by browser automation?
**Files changed in `project-files/`:** **none.** No redeploy needed from this session.

---

## What was asked

Open a browser and test whether Marketplace listings (`facebook.com/marketplace/you/selling`)
could be created with Playwright, pacing the run to avoid rate limits and bot-detection flags.

## Outcome: not built

Two independent blockers, recorded so this isn't re-investigated cold.

### 1. No browser tool was available in the session

No Playwright MCP server was configured (`mcpServers: {}` at both global and project scope),
and no built-in browser tool exists in this harness. `npx playwright` resolves (1.62.1) but that
is only the CLI — nothing could drive a browser on request.

### 2. SKILL-002 had already ruled this out, in writing

`skills/SKILL-002-Instrument-Sales/SKILL.md`, Phase 6 ("What can actually be automated"),
researched Aug 2026:

> **Facebook Marketplace: no public listing API.** Marketplace Partner APIs are restricted to
> approved businesses (vehicles, rentals). Third-party "Marketplace APIs" are scrapers, and Meta
> has been enforcing against them.
> **Bulk-lister browser extensions** automate a human session rather than an API, which puts them
> against Meta's automation terms and puts the account at risk. **Not recommended for an account
> tied to a school program.**
> So: **eBay by CSV, Facebook by hand.**

A Playwright script driving the Marketplace create flow is the same mechanism as those extensions —
same terms exposure, same account risk. Pacing it to stay under detection thresholds is working
around the control rather than complying with it. The realistic downside is not a rate-limit but
the selling account being actioned, with 20 priced LOTs queued behind it.

**Decision: stands as SKILL-002 wrote it.** eBay by CSV, Facebook by hand. No change to the skill.

### The unblocked path (not yet started)

The bottleneck on FBM is writing copy, not clicking. Posting by hand is ~2–3 min/item once title,
price, condition mapping and description exist. Offered and not yet taken up:

- Generate the Phase 5 Facebook block per LOT for the 20 priced items in `sale-inventory.md`
  (title · price · `Used – Fair` mapping · three-paragraph description with faults first) as one
  paste-ready file
- Generate the matching eBay Seller Hub CSV for the cross-post

---

## Playwright MCP — installed, not yet working

Legitimate uses remain (verifying `mpr-tags.html` renders before a tag print run, public sold-comp
research), so setup was carried partway.

| Piece | Command / link | State |
|---|---|---|
| MCP server | `claude mcp add playwright -- npx -y @playwright/mcp@latest` | Added, **wrong scope** |
| Chrome extension (optional, `--extension` mode only) | "Playwright Extension" — `chromewebstore.google.com/detail/playwright-extension/mmlmfjhmonkocbjadbfplnigmagldckm` (source: `microsoft/playwright` → `packages/extension`) | Not installed |

**The bug:** `claude mcp add` defaults to `local` scope, which keys off the cwd string exactly as the
shell reports it. `.claude.json` now holds two project entries differing only in drive-letter case:

```
'C:/jf-devops/maple-ridge-music-program'  →  mcpServers: { playwright: ... }   ← where it landed
'c:/jf-devops/maple-ridge-music-program'  →  mcpServers: {}                     ← what sessions use
```

**Fix (not yet run):**

```bash
claude mcp add --scope user playwright -- npx -y @playwright/mcp@latest
claude mcp list          # playwright should appear from any directory
```

Then fully restart Claude Code — MCP servers are spawned once at session start, so no running
session will pick it up. Skip `claude mcp remove`; from the lowercase cwd it won't find the
entry filed under the other casing, and the stale entry is harmless.

Note: `~/.claude/settings.json` contains the string "playwright", but only as Bash permission
allowlist entries from this session's `--version` / `--help` calls. Not a server registration.

---

## ⚠️ Outstanding — two unmerged CE artifacts in `/updates/`

Both dropped Aug 17 ~14:15, **predating this session** and untouched by it. Neither was merged,
because both hit the UPDATE-PROCESS Step 1b "stop and ask" condition.

### `session-update-20260817.md` — MPR ID collision

Claims **"Instrument Added: MPR-026"** — Yamaha YFL-225S, serial 033480, Storage, condition **Great**,
Japan-stamped pre-2012.

**But MPR-026 already exists** in `inventory.md`:

```
line 39:  | MPR-026 | Flute | Yamaha YFL-225 | Storage | — | TBD | Owned | Unknown |
line 120: | MPR-026 | ... Serial: not on record. Outstanding: retire or sell —
                          repad cost ~$300 against low value |
```

Same model, same location, and the update fills in exactly the fields that are blank on the
existing row (serial, condition). That reads like the **same flute being properly assessed** — but
the update is worded as an *add*, and it grades **Great** an instrument the fleet record has flagged
for **retire-or-sell over a $300 repad**. Those cannot both be true.

**Resolve before merging:** is this the existing MPR-026 reassessed, or a second Yamaha flute that
CE mis-numbered? If the latter, assign the next free ID at merge — never the CE-suggested one.

### `session-summary-2026-08-17-trevor-james.md` — ID needs verification

Trevor James Privilege III, serial P54427 ✅, silver-plate, Good, Owned/Unassigned, proposed as
**MPR-059**. MPR-059 is not currently in `inventory.md`, but the highest live ID is **MPR-086** — so
059 is a *gap in the middle*, not the next free number. Per Step 1b, confirm whether that gap is a
retired ID before reusing it, or assign **MPR-087**.

---

## Carry-forward

1. **Resolve the MPR-026 collision**, then merge both `/updates/` artifacts per UPDATE-PROCESS
   Step 1b; archive to `landing-zone/archive/updates-2026-08-18/` and clear `/updates/`
2. Re-run `node generate-tags.js` after that merge (Step 3) — inventory will have changed
3. Re-add Playwright MCP at `--scope user`, restart, confirm via `/mcp`
4. Optional, unblocks the actual sale work: generate FBM listing copy + eBay CSV for the 20 LOTs

**Untracked in git and left alone this session:** `_crops/`, `intrument-pics/`, `scratch-crops/`,
`crop.ps1`, `scratch-crop.ps1`, `updates/`.
