# Photo Index Audit — August 18, 2026

Mechanical diff of `intrument-pics/` against every photo filename referenced in **all 111
markdown docs in the repo** — project files, archived session summaries, and every version of
every `.md` ever committed.

Reproduce with `node landing-zone/photo-audit.js`. Full orphan list in `landing-zone/photo-orphans.txt`.

---

## Headline

| Metric | Count | |
|---|---:|---|
| Files on disk | 695 | |
| Unique photos (ignoring duplicate variants) | 656 | 39 files are pure duplicates |
| Referenced somewhere in the repo | 257 | **37%** |
| — of those, in `onboarding-photo-index.md` | 188 | the index alone covered 27% |
| Orphans — on disk, referenced nowhere | 438 | **63%** |
| Referenced but missing from disk | 27 | |

**The problem is indexing, not missing photographs.** Every "no photos for this LOT"
conclusion drawn from the index should be treated as unproven until checked against disk.

### What the archives recovered

Searching the archived session summaries rather than the index alone moved 69 files from
"orphan" to "identified", and overturned two conclusions reached earlier the same day:

- **LOT-016 has 8 photos and LOT-017 has 11**, shot Aug 6, all verified present on disk.
  Listed in `landing-zone/archive/updates-2026-08-17/session-summary-2026-08-13-sale-inventory.md`
  and never carried into the index. Both had been reported as having "only a notes page."
- **LOT-018's frames are described** ("vintage case photos + detail shots") but never named.

### What the archives could not recover

`session-summary-2026-08-13-playtesting-photo-indexing.md` states that LOT-014 and LOT-015 got
"full list of original Google Drive filenames indexed against what each photo shows." **That
list does not exist anywhere in this repo** — not in the working tree, not in any archived
copy of `sale-inventory.md`, and not in any commit. A `git rev-list --all` sweep finds only 3
unique Aug 6 filenames in the entire history. The work was done in a CE session that was
never merged.

That is the single clearest argument for the `/updates/` merge discipline in
`UPDATE-PROCESS.md`: unmerged CE work is simply lost.

---

## The Aug 6 Drive batch — a documented, half-finished review

`session-summary-lots-011-013.md` records that the Aug 6 photos (timestamps `145515`–`152057`)
were worked through **one at a time via the Google Drive connector**, and that the session
**ended partway**. It names exactly where to resume:

> Resume Google Drive review starting at timestamp `151006121` … Continue through to `152057270`.

So the Aug 6 orphans are not unknown material — they are a review that was interrupted seven
sessions ago and never picked back up. Established from those docs:

| Item | State |
|---|---|
| LOT-011, 012, 013 | Identified from this batch; **filenames never logged** |
| LOT-014, 015 | Fully indexed in a CE session; **list never committed** |
| LOT-UNKNOWN-A | 4 frames, `145811167`–`145847697`, no visible serial. Candidates: Artley 175/249004 or Bundy 225852 |
| `151006121` → `152057270` | **Never reviewed at all** |

---

## The 27 missing files

19 of the 27 are `PXL_20260817_*` referenced only by the two **unmerged artifacts still sitting
in `/updates/`** — a second un-exported batch. They will resolve when those photos are pulled
off the phone; they are not lost.

The other 8:

Seven of the eight are one export that never happened — a non-Pixel device whose files are
named `1000######.jpg`. **Not seven separate oversights.**

| File | Indexed against | What it was |
|---|---|---|
| `1000033786.jpg` | LOT-019 | Bundy trombone |
| `1000033787.jpg` | LOT-019 | Bundy trombone |
| `1000034337.jpg` | LOT-017 | Play-test notes page |
| `1000034338.jpg` | LOT-016 | Play-test notes page |
| `1000034339.jpg` | LOT-018 | Play-test notes page |
| `1000034352.jpg` | **MPR-036** | Olds trombone serial **798865** |
| `1000034353.jpg` | **MPR-036** | Olds trombone serial, 2nd angle |

Note it hits the **fleet** (MPR-036), not only the sale pipeline. Finding that device or
folder resolves all seven at once — highest-value single action on this list.

### The eighth is an index error, not a lost file

`PXL_20260816_200648503.jpg` (MPR-084 timpani, "full drum overview") is absent. But its
neighbours `PXL_20260816_200640613.jpg` (indexed) and `PXL_20260816_200653734.jpg`
(**on disk, unindexed**) both exist. The index almost certainly recorded the wrong
timestamp. **Fix: verify `200653734` is the overview shot and correct the filename.**

---

## Where the 507 orphans are

Sampled one frame per major cluster to identify each session.

| Cluster | Orphans | Identified as | Verified how |
|---|---:|---|---|
| Aug 6, 13–16h | 241 | **Staged white-backdrop shoot.** Sample showed an A. Fontaine (Paris) clarinet laid out with case — listing-quality framing | `PXL_20260806_141116736.jpg` |
| Aug 15, 12–14h | 105 | **Staged white-backdrop shoot.** Sample showed a silver 3-valve tuba/euphonium with mouthpiece | `PXL_20260815_134452237.jpg` |
| Aug 13, 17–18h | 52 | Clarinet session. Sample was a **Signet Selmer USA** — a model *not* in `sale-inventory.md`, so likely fleet | `PXL_20260813_171224929.jpg` |
| Aug 12, 16h | 24 | Purchase arrival — new Yamaha case in shipping box with bubble wrap | `PXL_20260812_162017907.jpg` |
| Aug 10–11 | 42 | Not sampled | — |
| Everything else | 43 | Not sampled | — |

**The two staged shoots are the find.** 346 photos taken on a white backdrop with cases laid
out is exactly the material SKILL-002 wants for listings, and none of it is catalogued. The
LOTs currently marked unphotographed are very likely in there.

⚠️ **Only 4 of 507 orphans were visually identified.** Cluster labels above are inferred from
one sample each and are a starting hypothesis, not a catalogue.

---

## Index errors found, beyond the missing files

1. **The coverage table (lines 12–18) understates reality.** It calls sale clarinets
   LOT-005–015 "❌ stubs only." But `PXL_20260813_132015924.MP.jpg` is on disk and clearly
   shows serial **C02823-7212** — that is LOT-009's Vito. Found by accident. There are
   probably more.
2. **Fleet→LOT items are filed under the old MPR ID.** LOT-021's six photos live under
   `MPR-075`; LOT-020 would be under `MPR-062`. A search on the LOT number returns nothing
   and reads as "no photos exist." `sale-inventory.md` line 77 documents this convention —
   the index just doesn't cross-reference it. **LOT-020 was reported unphotographed on this
   basis and has not actually been ruled out.**

---

## Naming hygiene

These break exact-filename matching and inflate counts.

| Issue | Count | Example |
|---|---:|---|
| Duplicate time-token variants | 32 | `162416979` exists as `.jpg`, `~2`, `~3`, `~4` |
| `" - Copy"` / `"-dup"` cruft | 31 | `PXL_20260815_122527247 - Copy - Copy.jpg` |
| `_MP.jpg` instead of `.MP.jpg` | 8 | `PXL_20260816_195829011_MP.jpg` |
| Non-PXL files | 2 | `20260813_171017-COLLAGE.jpg`, `Screenshot_20260813-062610.png` |

Deduplicating by time token would drop 695 files to 656 before anyone starts cataloguing.

---

## Applied to `onboarding-photo-index.md` on Aug 18

- ✅ LOT-016 — 8 Aug 6 filenames backfilled, all disk-verified
- ✅ LOT-017 — 11 Aug 6 filenames backfilled, all disk-verified
- ✅ LOT-018 — Aug 6 cluster documented; flagged that frames need identifying, not reshooting
- ✅ LOT-009 — new entry for the serial photo found during this audit
- ✅ LOT-UNKNOWN-A — recorded from the archived summary
- ✅ Coverage table rewritten; header warning added about the four failure modes
- ✅ MPR-084 timpani filename flagged as a probable typo for `200653734`
- ✅ LOT-020 moved from "no photos" to "not ruled out — check under MPR-062"
- ✅ Missing-export section added, naming all seven `1000######` files and what they belong to

## Still outstanding

1. **Find the `1000######.jpg` device/folder.** Closes LOT-019 and MPR-036 outright and
   restores the flute play-test notes. Nothing else has that leverage.
2. **Export the Aug 17 photos** referenced by the two unmerged `/updates/` artifacts (19 files).
3. **Resume the Aug 6 Drive review at `151006121`**, exactly where `session-summary-lots-011-013.md`
   left off. This is a documented restart point, not an open-ended hunt.
4. **LOT-020 euphonium** — confirmed Aug 18 to have no index entry under `LOT-020` *or*
   `MPR-062`. But its serial **330366** is marked ✅ verified, which normally means someone
   photographed it. Search the orphans before reshooting.
5. **Dedupe** the 39 duplicate files by time token.
6. **Catalogue the Aug 15 staged shoot** (105 orphans) — a second white-backdrop session with
   no session summary found describing it.

---

## Privacy issue found separately

`PXL_20260813_164216425.jpg` (LOT-003 Camelot, the main case shot) has a green tag in frame,
bottom right, hand-labeled with **a person's name** and "NMR 6", legible at full resolution.
Must be cropped or reshot before publishing. **Worth checking the staged-shoot frames for the
same kind of tag before any of them go to Marketplace** — those sessions photographed cases
open, which is exactly where such tags sit.
