# Session Updates — YBS-52 Onboarding
**Session date:** 2026-08-19

---

## 2026-08-19T00:00:00 — instrument-inventory, Workflow 1 (onboarding)
**Target file:** inventory.md
**Change:** append row

| MPR | Instrument | Model | Location | Serial | Landed | Status | Condition |
|:---:|---|---|---|:---:|---:|:---:|:---:|
| MPR-TBD | Baritone Saxophone | Yamaha YBS-52 | Storage | 020945 ✅ | `$3,500.00` | Owned | Excellent |

*Assign next free MPR ID at merge time.*

**Notes for the row / record:**
- **Ownership:** Program-owned (Maple Ridge asset tag already on case — "purchase value: $3500").
- **Acquisition:** Reported acquired 2015. Existing asset tag reads "serviced 05/15  KB" — KB = Kim Boller, professional instrument technician. No accompanying invoice/cost in hand, so not written as a formal `SVC-###` record; flagging for the user to confirm whether a service record should be backfilled.
- **Brand/Model/Tier — Confirmed:** Yamaha YBS-52, intermediate-tier student/step-up baritone saxophone. Lacquer finish (clear lacquered brass body per Yamaha's own spec) — this is a **lacquer, not silver-plated**, horn; noting since silver-plate is the standing arbitrage preference, but that preference applies to sourcing decisions, not to fleet instruments already on hand.
- **Country/era:** Bell stamp confirms "YAMAHA — ESTABLISHED IN 1887 — JAPAN," so Japan manufacture is confirmed. Exact production year from serial 020945 — **not confirmed**; Yamaha saxophone serial-to-year tables weren't checked against this range this session, so era is left unconfirmed rather than guessed.
- **Market value — Estimated, August 2026: $2,000–$3,500** for a mint/excellent, playing example. Basis: Sax on the Web forum thread (2022) reporting 12 sold YBS-52s ranging $1,700 (poor) to $5,000 (excellent), averaging $3,302; cross-checked against current (unconfirmed-sale) asking prices around $2,000 and new retail of $5,500–$5,600. **Caveat: no fresh 2026 sold-comp data located this session** — the 2022 forum figures are the strongest data point available but are dated, and the $2,000 asking listing had 0 sales after several days on the market. This is a rough estimate, not a firm appraisal; a proper pricing pass (per the program's sold-comps-only discipline) should pull actual eBay/Reverb sold listings before this number goes into any listing or insurance value. The $3,500 tag figure remains the *historical purchase value*, separate from this estimate.
- **Condition:** User reports "mint condition" and confirms it **plays well** — play-test passed. Recorded as **Excellent** per the rubric (plays correctly, no service needed, cosmetics near-new). Visual read from photos (no obvious dents or lacquer loss) is consistent with this.
- **Accessories observed in case (Image 2):** neck/crook (in dedicated compartment), mouthpiece with cap, neck strap, reed case (Vandoren "22 ¢" or similar reed box), what appears to be a cork-grease or similar small accessory tube. **No visible cleaning swab.** Worth a hands-on check to confirm nothing's missing before this goes into rotation.
- **Location:** Set to `Storage` per "this lives in the closet" — not yet assigned to a student.
- **No holder written to inventory.md** — if/when this gets assigned, that's a separate `assignment.md` write.

---

## 2026-08-19T00:00:00 — instrument-inventory, Workflow 1 (onboarding) — photo index
**Target file:** onboarding-photo-index.md
**Change:** append new section

## MPR-TBD — Yamaha YBS-52 Baritone Saxophone

**Onboarded:** August 19, 2026
**Source:** On-hand (reported acquired 2015, previously untracked in the closet)
**Folder:** `MPR-TBD_Yamaha-YBS-52/`

| # | Filename | Shows | Notes |
|:-:|---|---|---|
| 1 | `PXL_20260819_222732819.jpg` | Body/upper stack, close-up, keywork and Yamaha tuning-fork logo medallion on the bell-to-body brace | Lacquer finish, no visible dents; screw and pivot detail clean |
| 2 | `PXL_20260819_222713935.jpg` | Full case, open, overhead | Body, neck, mouthpiece, neck strap, and small accessory compartment (reed case, small tube) all visible. Case has a handwritten label reading "Alto/Bari Sax" |
| 3 | `PXL_20260819_222650964.jpg` | Yellow permanent asset tag, close-up | Reads: **"Yamaha YBS-52 Baritone Saxophone / purchase value: $3500 / serviced 05/15  KB"** — this is the program's existing tag, source of the $3,500 and 05/15 service note |
| 4 | `PXL_20260819_222728025.jpg` | Bell engraving close-up | **"YAMAHA — ESTABLISHED IN 1887 — JAPAN"** — confirms brand and Japan manufacture |
| 5 | `PXL_20260819_222834941.jpg` | Bow/neck-brace area, lower bell curve, low-A mechanism | No dents, no solder repairs visible; consistent with "mint" report |
| 6 | `PXL_20260819_222805270_MP.jpg` | Serial stamp close-up, body tube | Reads **"YAMAHA YBS-52 / 020945"** clearly — matches the asset tag model number, serial photographed directly on the instrument |

**Status:**
- Brand/model: ✅ confirmed (Yamaha YBS-52, bell stamp + body serial stamp)
- Serial: ✅ confirmed (020945, read directly off the instrument body, not a listing photo)
- Country: ✅ confirmed (Japan, per bell stamp)
- Era/production year: ⚠️ not confirmed — not researched this session
- Condition: user-reported "mint" and confirmed plays well — **Excellent**, play-tested
- Accessories: neck, mouthpiece, neck strap, reed case observed; no swab seen — worth confirming in person

---

### Reminders
- Placeholder `MPR-TBD` used — real MPR ID assigned at merge.
- Serial tag can be printed once the real MPR ID is assigned (serial is ✅, so it qualifies once merged — just not yet, since it's still `MPR-TBD`).
- `mpr-tags.html` not regenerated in this session per skill rule — needs local `node generate-tags.js` pass after merge.
- Play-test confirmed by user — Excellent grade is now confirmed, not just reported.
- Market value estimate ($2,000–$3,500) is rough, based on dated (2022) sold-comp data — a dedicated pricing pass with fresh sold comps is worth doing before this figure is used anywhere formal.
