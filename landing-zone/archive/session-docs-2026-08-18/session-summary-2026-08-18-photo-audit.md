# Session Summary — August 18, 2026
## Playwright MCP fixed · FBM listing copy started · photo index audited

**Focus:** Resolve the Playwright MCP scope bug, then start Marketplace listing copy — which
turned into auditing the photo index after it proved unreliable.

**Files changed in `project-files\`:** `onboarding-photo-index.md`. **Re-upload required.**

---

## 1. Playwright MCP — fixed

Re-added at `--scope user`; verified it resolves from an unrelated directory, which is what
proves it is no longer keyed to a cwd string. User restarted; 23 `browser_*` tools now load.

The stale entry under `C:/jf-devops/…` (uppercase drive letter) was left in place deliberately —
`claude mcp remove` also keys off cwd, so from the lowercase cwd it cannot see that entry, and a
duplicate under the same name is inert.

## 2. Facebook Marketplace automation — still not built

User asked for browser-driven posting, paced to look human, in small batches with manual save.
Declined the pacing element specifically: throttling to stay under Meta's automated-use
detection is designing around the control. The rest of the decision stands as SKILL-002 wrote
it — **eBay by CSV, Facebook by hand.**

Practical blocker regardless: Playwright MCP launches an isolated Chromium profile that is not
logged into Facebook. Reaching a real session needs the Playwright Chrome extension bridge,
still not installed.

**Delivered instead:** listing copy in the same review-and-save cadence, via paste. See
`landing-zone/fbm-listings-draft.md` — LOT-019, LOT-021, LOT-017, LOT-003 written.

## 3. Photo index audit — the substantive work

Triggered by the user asking "which photo file are you looking at?" The honest answer was
none; claims about photos were being repeated from text notes. Looking at the actual images
immediately falsified them.

### Corrections forced by looking at the pictures

| Claim | Reality |
|---|---|
| LOT-021 "normal wear, no dents" | Heavy lacquer loss, raw brass on the slide crooks, long scratch down the bell taper |
| LOT-021 includes a Bach 2C | Mouthpiece is in frame but its marking is **never photographed** — claim rests on `inventory.md` only |
| LOT-021 has no photo index entry | **6 photos**, filed under fleet ID MPR-075 |
| LOT-016/017 have "only a notes page" | **8 and 11 photos** respectively, on disk since Aug 6 |

### The audit

Mechanical diff of `intrument-pics/` against all 111 markdown docs plus every version of every
`.md` ever committed. Script: `landing-zone/photo-audit.js`. Report:
`landing-zone/photo-index-audit.md`.

- **695 files on disk, 656 unique.** 257 referenced anywhere (37%); the index alone covered 27%.
- **438 orphans** — on disk, referenced nowhere.
- **27 referenced files missing**, of which 19 are Aug 17 photos awaiting export and 7 are one
  `1000######.jpg` device batch that was never exported. Only 1 is a genuine index typo.

### Root causes, all four now documented in the index header

1. The index covered a fraction of the folder, so absence never meant absence.
2. Fleet→LOT items file under the old `MPR-###`; LOT-number searches return nothing.
3. Session summaries write `154330926_MP`; disk has `154330926.MP.jpg`. Exact matching fails.
4. 39 duplicate files (`~2`, `~3`, `" - Copy"`) inflate every count.

### Work that was done and then lost

`session-summary-2026-08-13-playtesting-photo-indexing.md` records LOT-014/015 receiving a
"full list of original Google Drive filenames indexed against what each photo shows." **That
list is nowhere in this repo** — not the working tree, not any archived `sale-inventory.md`,
not any commit (`git rev-list --all` finds 3 unique Aug 6 filenames total). Done in a CE
session that was never merged.

The strongest available argument for the `/updates/` merge discipline in `UPDATE-PROCESS.md`.

### The Aug 6 orphans are an interrupted job, not unknown material

`session-summary-lots-011-013.md` names the resume point exactly:

> Resume Google Drive review starting at timestamp `151006121` … continue through to `152057270`.

Seven sessions ago. Everything from `151006121` onward was never reviewed.

## 4. Privacy issue — blocks publishing

`PXL_20260813_164216425.jpg`, LOT-003's main case shot, has a green tag in frame with **a
person's name** and "NMR 6", legible at full resolution. Must be cropped or reshot. The staged
shoots photographed cases open, so the same check is owed across those frames before anything
goes public.

---

## Carry-forward

1. **Find the `1000######.jpg` device/folder** — closes LOT-019 and MPR-036, restores the three
   flute play-test note pages. Highest leverage item outstanding.
2. **Export the 19 `PXL_20260817_*` photos** referenced by the unmerged `/updates/` artifacts.
3. **Resolve the MPR-026 collision and merge both `/updates/` artifacts** (carried from Aug 17,
   still outstanding), archive to `updates-2026-08-18/`, then run `node generate-tags.js`.
4. **Re-upload `project-files/` to Claude Enterprise** — `onboarding-photo-index.md` changed.
5. **Crop the named tag** from `PXL_20260813_164216425.jpg`.
6. **Resume the Aug 6 Drive review at `151006121`** — unblocks clarinets LOT-011–015, 11 of the
   20 LOTs.
7. **Write LOT-016 copy** — 8 photos confirmed ready, not yet reviewed.
8. **LOT-021** — check the bell taper by hand (scratch or dent?) and photograph the mouthpiece
   stamp before claiming a Bach 2C.
9. **Search orphans for LOT-020** — serial 330366 is ✅ verified, so a photo probably exists.
10. **Dedupe** the 39 duplicate files; **confirm** `200653734` is the MPR-084 timpani overview.

**Untracked in git and left alone:** `_crops/`, `intrument-pics/`, `scratch-crops/`, `crop.ps1`,
`scratch-crop.ps1`, `updates/`.
