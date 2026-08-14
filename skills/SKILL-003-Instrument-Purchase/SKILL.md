---
name: instrument-purchase
description: Evaluate and buy instruments for the program — deciding whether to buy at all, setting a target spec, reading marketplace listings for what they do and don't prove, vetting sellers, calculating landed cost with tax and shipping, bidding or offering with discipline, and tracking the return window until the instrument arrives. Use this skill whenever the user shares an eBay, Reverb, Marketplace or shop listing, asks "is this a good deal", "should I buy this", "what should I bid", "what's a fair price for", asks to compare models before buying, mentions an auction ending or a proxy bid, asks what a horn will cost landed, or is deciding between two instruments to acquire. Do not use it for selling — that's `instrument-sale`. Hand off to `instrument-inventory` Workflow 1 the moment an instrument arrives.
---

# Instrument Purchase

Handles an instrument arriving by purchase: deciding the program needs it, working out what to look for, reading a listing honestly, checking who's selling it, costing it properly, and executing the buy without losing money to impatience.

Failure modes this exists to prevent: buying a duplicate of something already on the shelf; **believing a listing about facts only the instrument can prove**; losing an auction by bidding below the real maximum; and an instrument landing with nobody having noticed the return deadline.

## Core principle

**A listing is a sales document, not evidence.** A seller's "silver", "excellent condition", "professionally serviced", and "rare" are marketing until something confirms them — a photograph of the actual part, a model number that decodes, a stamp on the bell. Decide on what can be verified before money moves; price everything else as risk and cover it with a return window.

The mirror of `instrument-sale`: that skill exists so the program never *states* an unverified fact. This one exists so it never *pays* for one.

## Files

**Read `model-reference.md` before evaluating any listing or writing any spec.** It carries the model bands, the Yamaha decoding rules, and the finish traps that decide most of these purchases — this skill deliberately does not duplicate them, because they change and it doesn't.

| File | Role |
|---|---|
| `model-reference.md` | **Read first, write as findings accrue.** Cross-family buying knowledge and per-family model bands |
| `watchlist.md` | **Write.** Candidate listings under `WATCH-###`, their outcome, and the seller file |
| `inventory.md` | Read: what's owned, what it cost landed, what condition it's in |
| `students.md` | Read: who is unplaced, who is at a transition point |
| `assignment.md` | Read: what's genuinely in use versus what's sitting |
| `sale-inventory.md` | Read: don't buy the family currently being disposed of |

`WATCH-###` IDs are cheap and disposable. A candidate that loses its auction keeps its row with the closing price recorded — that's the comp data nobody else is collecting for this program. **A `WATCH-###` never becomes an `MPR-###`**; intake assigns a fresh MPR ID on arrival and the watchlist row closes with a pointer to it.

## Where this skill stops

| Concern | Owned by |
|---|---|
| Deciding to buy, spec, listing evaluation, seller vetting, landed cost, bidding, tracking to the door | **This skill** |
| Serial verification, condition grading, MPR ID, inventory row, tag, `mpr-tags.html` | `instrument-inventory`, Workflow 1 |
| Placing the instrument with a student | `instrument-inventory`, Workflow 2 |
| Anything leaving the program | `instrument-sale` |

**The handoff is the doorstep.** Assigning MPR IDs or grading condition here produces two records that disagree. The one fact that crosses the line is the **return deadline** — carry it into intake explicitly and surface it every session until resolved. It is the most perishable fact in the process.

---

# Seven phases

## 1. Does the program actually need this?

Five gates, in order. Any one stops the purchase.

1. **Is there an unplaced student who needs this family?** Check `students.md` against `assignment.md`, then **ask who it's for rather than inferring it from the files.** Placement decisions get made in conversation days before they reach the roster, so an absence in `students.md` is weak evidence and a "spare" or "backup" in the request is not an answer. A named student waiting is the strongest possible reason to buy; no named student makes this a fleet-depth or upgrade purchase, a weaker case that has to be argued on its own terms.
2. **Is something already on the shelf that covers it?** Check `inventory.md` for `Storage`, `Available`, or assigned-but-unused. This gate has already failed once — a euphonium was nearly re-bought against a stale `Project` label on a horn that was in use and loved. **Verify the record against reality**; if a row hasn't been touched in months, ask rather than assume.
3. **Is anything already in transit?** Instruments bought a week apart arrive together and become one surplus.
4. **Is the program simultaneously selling this family?** Check `sale-inventory.md`. Buying a trumpet while lotting three of them means the spec is wrong, not the count.
5. **Is the money there, and is it this budget year's?**

### Buy versus repair the one already owned

> **landed cost of replacement − (repair cost + value retained) = what buying actually costs**

Buying wins more often than on the sale side, because a repaired student horn is still an old student horn. But run it honestly — an $80 chem clean against a $700 replacement is not close. On brass, check the sticky-valve note in `model-reference.md` before treating anything as compression; it has answered this question without a purchase more than once.

---

## 2. Define the target before looking at listings

Searching first and specifying afterwards produces a purchase shaped by whatever happened to be listed that week. Write the spec, then shop against it.

The spec has four parts, and all four constrain the search:

| Part | Example | Why it's binding |
|---|---|---|
| **Who plays it** | 5th-grade beginner; adult instructor; a student going to NYSSMA | Sets the tier — a beginner on a professional horn is a maintenance liability; an advancing student on a budget horn stalls |
| **Hard requirements** | Compensating; silver-plate; open-hole B-foot | Non-negotiable. A listing that misses one is out regardless of price |
| **Preferences** | Japan-stamped; original case; offset G | Tie-breakers and price adjusters, not filters |
| **Budget band and a ceiling** | $600–$800, hard stop $900 landed | Set in the calm, never revised upward while an auction runs |

Pull the candidate models and their price bands from `model-reference.md`, and write anything new back to it. Note what's already owned as an internal benchmark — two YHR-668s on the shelf make a 664 a comparison, not a leap of faith.

---

## 3. Read the listing for what it proves

**What a listing can actually establish:**

| Claim | Established by | Not established by |
|---|---|---|
| Model | Bell engraving legible in a photo | The title |
| Finish | Wear pattern at contact points; base metal colour where plating is gone | The word "silver" |
| Serial | A sharp photograph of the number itself | The seller typing it |
| Origin | A "Made in ___" stamp visible in a photo | Where the seller is |
| Compression / seal | Nothing in a listing. Only a bench check | "Valves move freely" |
| Playing condition | A video of it being played | "Plays great" |
| Completeness | Photographs of each item claimed | A list in the description |

**Photo-read facts are provisional.** A serial read from a listing photo carries 📷 into inventory and stays there until someone checks the instrument.

### What to look for in the photographs

- **Leadpipe and receiver** — dents and green corrosion here matter more than anything cosmetic, and sellers rarely photograph them. Their absence from the set is itself information; ask.
- **Valve casings and slide tubes** — pitting, red rot, plating loss at the crook of a slide
- **Solder joints** — braces and the bell-to-body seam. Re-solder blobs mean a prior repair the description didn't mention
- **Bell throat and rim** — dents here are expensive and often shot from the flattering angle
- **Pads and key cups (woodwind)** — yellowed, torn, lifting; light at the rim of a closed cup
- **Cracks (clarinet)** — upper joint tone holes and tenon sockets
- **The case** — latches and hinges. A broken latch means the seller has no shipping container
- **The background** — a horn on a gym floor next to twelve others is a district surplus lot, not one careful owner's instrument

### Questions worth asking before bidding

Ask few and ask specific. A seller who answers one clear question well beats one who answers five vaguely.

1. "Can you photograph the leadpipe and mouthpiece receiver?"
2. "Is there a Made in stamp, and what does it say?"
3. "Can you photograph the serial number clearly?"
4. "Has it been played recently, and by whom?" — "I don't play, it was in a closet" is honest and useful.
5. "Do all slides pull freely by hand?"

**No answer is an answer.** A seller who won't photograph a leadpipe before the sale won't be helpful after it.

### Listing red flags

Stock photographs, or backgrounds that don't match each other · a title stuffed with model numbers the instrument isn't · "silver" with no finish evidence · condition language and photographs that disagree · a price far below the comp band with no fault disclosed, because the fault exists and just isn't described · no returns on a high-value item from a thin-history seller · description copy-pasted across different instruments in the same shop.

---

## 4. Vet the seller

The seller determines what happens when the instrument is wrong, and something is eventually wrong.

| Signal | What good looks like |
|---|---|
| Feedback percentage and volume | 98%+ with real volume. 100% across nine sales says almost nothing |
| Detailed seller ratings | Item-as-described is the one that matters; 4.9+ |
| Return policy | Seller-paid returns are worth real money on the price — they convert an unverifiable claim into a reversible decision |
| Category history | A seller who moves instruments weekly knows what a leadpipe is. A general liquidator does not |
| Licensing | Japanese sellers holding a prefectural second-hand dealer license are running a real business |
| Recent negatives | Read them. A pattern of description disputes is disqualifying; one shipping complaint is noise |

The standing of sellers already used lives in the seller file in `watchlist.md`. **Update it after every purchase, good or bad** — its whole value is in being current.

---

## 5. Cost it landed, not listed

> **landed cost = item + shipping + tax on (item + shipping)**

**Sales tax is Ulster County, NY: 8% total — 4% state + 4% county** — applied to the item and shipping subtotal together, not the item alone.

```
Item                                    $595.00
Shipping                                 $58.00
                                        -------
Subtotal                                $653.00
Sales tax @ 8%                           $52.24
                                        -------
Landed cost                             $705.24
```

**Also count, where they apply:** import handling on non-marketplace international purchases; a case if the included one is unusable; a mouthpiece if none ships; and the near-certain **first service visit** on any horn bought without a play test. That last one is the honest way to compare a cheap unknown against a dearer known quantity.

Compare landed against landed — never a landed cost here against a listed price there. `inventory.md` is now a real price history for this program's own buying; use it.

---

## 6. Execute

### Auctions: the proxy bid rule

> **Decide the true maximum before the auction, enter it once, and let the system work.**

The most expensive lesson in the program's history. A YEP-321S was lost at $590 because $500 went in as a probe rather than the real $600 ceiling. The proxy system bids only the minimum needed to hold the lead — entering the true maximum never means paying it, it means not losing below it.

The failure mode of probing isn't paying too much. It's losing an auction you'd have won, then buying something worse later for more.

- **Set the ceiling in Phase 2**, in writing, before emotion is involved
- **If no ceiling was written down before the auction, that is itself a reason not to bid today.** A number derived mid-auction — anchored to a comp, to what the last one cost, to what the bidding happens to be at — is improvisation wearing the costume of discipline. Say so plainly rather than supplying the number: the next one is a week away, and a ceiling set in the calm is the entire mechanism
- **Enter the maximum once.** Raising a proxy mid-auction is the same probe wearing a different coat
- **Don't bid early.** Early bids draw attention and raise the close without improving the position
- **The ceiling is landed, not item.** A $600 landed ceiling against $166 shipping is really a $412 item ceiling. Do that arithmetic before, not during
- **Losing is a valid outcome.** Record the closing price as a comp and wait

### Buy It Now and Best Offer

Fixed price inverts the problem — no clock, so the risk is dithering while someone else buys it. Something correctly specified, correctly priced, from a good seller should be bought, not watched.

On Best Offer: open 15–20% under ask on a listing that's been sitting, less on a fresh one, and **name the reason** — a missing mouthpiece, a dented bell, comps at a lower band. A reasoned offer gets countered; a lowball gets declined and remembered.

### The return window is the real risk control

For anything unverifiable before purchase — which is most things — **the return policy is what makes the purchase reversible.**

When two instruments are close, buy the returnable one and treat the final-sale one as the thing to beat. That is exactly the MPR-019 / MPR-020 shape: one final-sale, one returnable to September 4, compared in hand with the loser going back. **That plan only works if the deadline is tracked.**

**Record the deadline the day of purchase**, in `watchlist.md` and again at intake, and count backwards — a return needs the instrument assessed, packed and moving several days before the date, not on it.

---

## 7. Track it to the door, then hand off

1. **Write the `watchlist.md` row** at purchase — what, from whom, item and shipping and landed, the order number, and the return deadline in bold if one exists.
2. **Watch the transit.** Tracking that hasn't moved in a week from an international seller is worth one polite message. The window for opening a case is finite.
3. **On arrival, stop.** Photograph the serial and engraving first — this is the easiest it will ever be — then **hand off to `instrument-inventory` Workflow 1** for the MPR ID, condition grade, inventory row, tag, and `mpr-tags.html` rebuild.
4. **Close the watchlist row** with the outcome and a pointer to the new MPR ID.
5. **Close losing rows too**, with what happened and what it went for.

---

## Appendix: the no-guessing rules, buy side

1. **Finish** — only from a stamp, a model suffix that decodes, or visible base metal. Never from the word "silver".
2. **Serial** — photo-read serials are 📷 and stay 📷 until the instrument is in hand.
3. **Year and origin** — only from a stamp or a published serial chart, with the source recorded. A seller's "1970s" is not a source.
4. **Condition** — a listing establishes cosmetics and nothing else. Compression, seal and intonation are bench findings.
5. **Completeness** — what's photographed is what's included.
6. **"Professionally serviced"** — meaningless without an invoice. Ask for it; its absence is informative.
7. **Where evidence is missing and the seller won't supply it**, the choice is to buy it as a priced risk with a return window, or not to buy it. It is not to assume.

## Appendix: when the answer is not "buy"

| Situation | Better move |
|---|---|
| Something equivalent is in `Storage` | **Deploy it** — check the record is current first |
| The fault is a $15 bottle of heavier valve oil | **Oil it** |
| One student, one term, uncertain commitment | **Loan a lesser horn** — a horn bought for a student who quits in March is next year's loss |
| Right model, wrong price, auction in progress | **Lose it.** Record the close as a comp |
| Nothing in the family is specified yet | **Write the spec first.** A purchase made to end a search is how a fleet acquires horns nobody chose |
| A family is simultaneously being disposed of | **Fix the spec, not the count** |
| Right listing, unknown seller, final sale | **Pass**, or find the returnable equivalent and pay more for it |
