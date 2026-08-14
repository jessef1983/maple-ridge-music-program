---
name: instrument-sale
description: Sell, consign, or dispose of instruments the program owns or holds for disposal — deciding whether an item should leave, identifying and dating it from serial and engraving evidence, pricing it against sold comps, writing eBay and Facebook Marketplace listings, publishing them manually or by bulk feed, shipping, and recording the proceeds. Use this skill whenever the user mentions selling, listing, posting, consigning, or getting rid of an instrument, asks "what's this worth" or "what year is this", asks for a listing description or title, weighs a repair against resale value, or asks how to ship a horn. Do not use it for buying decisions; hand off to `instrument-inventory` Workflow 5 for the fleet record once a program instrument sells.
---

# Instrument Sale

Handles an instrument leaving by sale: deciding it should go, working out what it actually is, pricing it, writing and publishing the listing, shipping it, and banking the result.

Failure modes this exists to prevent: selling something the program still needs; sinking repair money into a horn worth less than the repair; **writing a listing that states something nobody verified**; and money moving through the program without a record of it.

## Core principle

**Never write a fact into a listing that isn't on the instrument, in a photograph, or in a published source.** Model years, wood species, key counts, "professional model", "rare" — every one is a claim the buyer can check and dispute. A listing that says "serial 645-107, year not established" is stronger than one that says "circa 1968" from a guess, because the first is true and the second is a not-as-described case waiting to happen.

The rest of this skill assumes that rule and does not repeat it.

## Where this skill stops

| Concern | Owned by |
|---|---|
| Deciding to sell, identifying, valuing, listing, publishing, shipping, proceeds | **This skill** |
| Setting a fleet instrument to `Sold`, closing the assignment row, retiring the MPR ID, regenerating `mpr-tags.html` | `instrument-inventory`, Workflow 5 |
| Evaluating something to buy | Purchase skill (not built yet) |

## Files

| File | Role |
|---|---|
| `sale-inventory.md` | **Write.** The disposal pipeline — `LOT-###` items held for sale, their stage, and their evidence |
| `inventory.md` | Read: landed cost, serial and its confidence mark, condition, service history. Write via Workflow 5 when a fleet instrument sells |
| `assignment.md` | Read: whether the instrument is out with someone |
| `students.md` | Read: whether an unplaced student needs this family |

Fleet instruments live in `inventory.md` under `MPR-###`. Items acquired or donated for disposal live in `sale-inventory.md` under `LOT-###` and never get an MPR ID.

---

# Seven phases

## 1. Should this instrument leave at all?

Five gates, in order. Any one stops the sale.

1. **Is it still assigned?** Check `assignment.md`. Not for sale until it's back in hand and its holder is placed elsewhere.
2. **Is the return window still open?** A return at full purchase price beats a sale at market minus fees.
3. **Is it the only one of its family?** Even a mediocre single flute is coverage for the student who turns up in September. Sell the second-best, not the only one.
4. **Does an unplaced student need it?** Check `students.md` for incoming students and students with no instrument recorded.
5. **Did it come in as a donation with strings?** A relationship question, not a financial one. Ask before listing.

### Repair-then-sell almost never pays on student instruments

> **net sale price − repair cost = what the repair actually earned**

On student-tier horns this is usually negative. A $300 repad against a flute that sells for $250 is a $50 loss plus a month of waiting. Sell as-is, describe the fault, and let the buyer price their own bench work.

The exception is a fix under $30 and under an hour that removes buyer doubt: oil, grease, a freed slide, a mouthpiece that isn't seized. Anything needing a shop visit usually isn't worth it.

---

## 2. Identify and date it

This phase produces evidence, not conclusions. Work from the instrument outward.

**Evidence that counts, in descending order:**

1. Engraving on the instrument — brand, model, "Made in ___", any stamp
2. Serial number, read off the instrument and photographed
3. A published serial-to-year chart from the manufacturer or its successor company
4. A period catalogue or manual for that model
5. Multiple independent collector references agreeing with each other

**Evidence that does not count:** a similar-looking listing on eBay, a forum post with no source, the shape of the case, or a plausible inference from the serial's length. If inference is all there is, the year field stays blank and the listing says nothing about age.

### Working a brand back to a maker

Many US student instruments are **stencils** — built by one factory and stamped with a store's or distributor's name. A stencil is priced as a generic student horn no matter whose name is on the bell, so identifying the real maker changes the price only when it turns out to be a known factory.

Most American student woodwind brands consolidated over time into **Conn-Selmer**, the first place to ask about dating for those names. When a chart is found, cross-check against a second independent source before writing a year anywhere. Where two sources disagree, record both and state neither.

### What to record per item in `sale-inventory.md`

| Field | Rule |
|---|---|
| Brand / model | Only what is engraved. "Model unknown" is a legitimate value |
| Serial | Verified against the instrument, marked ✅. Hand-logged serials stay ✋ until checked |
| Year | Blank unless a chart supports it. If supported, record **the source alongside the year** |
| Material | Wood vs resin, silver-plate vs sterling — confirmed by mark or physical check, never by appearance alone |
| Pitch / key | For saxophones and clarinets this is a major price driver and must be confirmed |

### Physical checks that drive price on student woodwinds

Fast, no tools, and they convert an `Unassessed` row into a gradeable one:

- **Cracks** — clarinet upper joint around the tone holes and the tenon sockets; hold to a light. A crack is the difference between a sale and a parts listing
- **Pads** — yellowed, torn, or lifting; do the cups close with a visible seat? Press and look for light at the rim
- **Tenon corks and neck cork** — dried, compressed, or missing. Cheap to mention, cheap to replace, common
- **Key fit** — lift each key and feel for side-play; bent rods and sprung keys read immediately in photographs
- **Springs** — any that don't return
- **Body material** — grenadilla is dense, cool, and shows grain; resin is uniform and lighter. Say which, or say you didn't determine it
- **Plating** — silver-plate wears to a yellow base metal at contact points; sterling flutes carry a mark
- **Case** — latches, hinges, handle, and whether it's original. A case with a broken latch is not a shipping container

Grade the result with the program's rubric so it maps to listing language later: `Excellent` · `Good` · `Fair` · `Poor` · `Project`.

---

## 3. Price it

**Sold comps only.** Asking prices are hopes; sold prices are transactions. On eBay, search the model and filter to **Sold Items**, reading the last 90 days. On Reverb, use the Price Guide, built from completed sales. Three or four genuine comps beat twenty listings that never sold.

**Build the comp search from evidence, not from the brand name alone.** For a student clarinet, "Bundy clarinet sold" returns a wide band because it mixes wood and resin, playable and parts. Narrow it: model, material, condition language, and whether a case is included.

### Turning condition into a number

Comps give a band. Condition places the item inside it:

| Grade | Where it sits in the comp band | How it lists |
|---|---|---|
| `Excellent` | Top of band, sometimes above with good photos | Excellent — plays correctly, minimal wear |
| `Good` | Upper middle | Very good used condition — plays correctly, normal wear, ready to play |
| `Fair` | Lower middle | Good used condition with noted issues — playable, needs [specific work] |
| `Poor` | Bottom of band or below | For repair — not currently playable, [specific fault] |
| `Project` | Parts value; comp against **parts** listings, not playing ones | Sold as-is for repair or parts |
| `Unassessed` | **Do not price and do not list.** Assess it first | — |

A `Project` horn compared against playing-condition comps produces a price nobody pays and a listing that sits for months. Compare like with like.

### Adjustments that move price

| Factor | Effect |
|---|---|
| **Material** | Wood clarinet over resin, by a wide margin. Sterling or solid-silver flute over plated |
| **Pitch / size** | Tenor sax over alto; bass clarinet over Bb. Confirm before pricing |
| **Finish (brass)** | Silver-plate (Yamaha `S` suffix) above lacquer; nickel below both. Listings saying "silver" often mean nickel — YTR-135, YTR-136, YTR-1310 are nickel |
| **Model tier (Yamaha)** | 1000 student → 2000 standard → 3000 upper student → 4000 intermediate → 8000–9000 professional |
| **Japan-stamped brass** | Yamaha moved student brass to China around March 2012; a pre-2012 Japan stamp is a real premium and belongs in the title |
| **Mixed parts** | A body, bell and mouthpiece from three makers is a player's or repairer's horn. Price it as the sum of usable parts |
| **Case and mouthpiece** | An original case in good order and a decent mouthpiece add real money and cost nothing to include |

### Work backwards to a floor

> **list price ≈ floor + fees + shipping + packing materials**

Fee reality as of mid-2026 — **verify current rates before pricing**, both platforms change them:

- **eBay** — standard final value fee around 13.25–13.6% of the total the buyer pays (item **plus** shipping), plus roughly $0.30–$0.40 per order. Musical Instruments & Gear is widely reported at a reduced rate near 6.35%, but the reduction does not cover every subcategory; confirm the exact category on eBay's seller fee page.
- **Reverb** — 5% selling fee on item plus shipping (capped at $500), plus payment processing around 3.19% + $0.49. Roughly 8–9% all in.
- **Facebook Marketplace, local pickup** — **no seller fee and no shipping.** Fees apply only to shipped orders through checkout. That is what makes it the right channel for low-value, awkward-to-ship items.

Sales tax is collected from the buyer by the platform and never reaches the program's proceeds. Leave it out of the math.

### Lot vs. individual

For a pile of low-value student instruments, run the arithmetic honestly. Ten separate listings means ten sets of photographs, ten descriptions, ten boxes, ten buyers and ten chances at a dispute. A single "lot of ten student clarinets, as-is" sells for less per horn and closes in one transaction to a repairer who wants exactly that. Split the difference: list the few individually worth it, lot the rest.

### When to consign instead

Consignment through a woodwind or brass shop runs 20–25% — dear, but right for high-value, low-liquidity instruments where the buyer pool is small and a shop's condition report carries weight the program's does not. For student-tier horns it gives away a quarter of the price for an audience you can reach yourself.

---

## 4. Prepare and photograph

1. **Verify the serial** against the instrument and promote the mark to ✅. Once it ships it cannot be checked, and a wrong serial in a sold listing is a not-as-described claim.
2. **Strip program identity.** Remove the student tag and file it with the assignment record. Remove the laminated instrument tag — it carries the school name and phone number and should not travel to a stranger. Peel off inventory stickers. A school-tagged horn in a listing photo raises questions no seller wants to answer.
3. **Clean it.** Wipe down, swab out, empty the case of old reeds and other people's mouthpieces, vacuum the interior. **Sanitize any mouthpiece that ships** — warm water and mild soap; never hot water on hard rubber, which discolours it. Say in the listing that it was sanitized.
4. **Decide what's included** — case, mouthpiece, ligature, cap, care kit, reeds. List them explicitly. If something is program stock that should stay, remove it before photographing so it never appears in an image.
5. **Photograph before writing anything.** The photographs decide what the description has to explain.

**The shot list** — full instrument both sides on a plain background in indirect daylight; brand engraving legible; **serial sharp and readable**; keywork and pad cups; tenons and corks; joints assembled and apart; bell interior; case exterior, interior, latches; every crack, dent, plating wear patch and bent key lit at a rake so it is visible; each included accessory.

Photograph the faults deliberately. A buyer who sees the crack in the listing does not open a case about it later.

---

## 5. Write the listing

The same evidence produces two different documents. Write eBay first — it's stricter — then cut it down for Facebook.

### eBay

| Field | Rule |
|---|---|
| **Title** | 80 characters, hard limit. Front-load the words a buyer types: brand, model, instrument, key/pitch, then qualifiers, then "with case". No ALL CAPS, no "L@@K", no stuffing in brands it isn't |
| **Category** | Musical Instruments & Gear → the specific instrument. The category sets the fee rate; get it right |
| **Condition** | `Used` or `For parts or not working`. If it doesn't play, it is the second one — no exceptions |
| **Item specifics** | Brand, model, type, key, body material, serial. **Leave a specific blank rather than guessing it** — a wrong specific is a dispute, a blank one is only a slightly weaker listing |
| **Description** | The skeleton below |
| **Photos** | Up to 24. Lead with the full instrument, put the serial in the first four, put the faults in before the accessories |
| **Returns** | 30-day returns raise the price a listing achieves and reduce disputes. On an honestly described instrument the return rate is low. Usually the better trade |

**Description skeleton:**

1. **What it is** — brand, model, instrument, what's engraved on it, verbatim
2. **Serial and what it does or doesn't establish** — the number, and either the dated source or "no year established"
3. **Condition, split in two** — what works, then what doesn't, in its own paragraph. Burying faults reads as hiding them
4. **What's included** — and what isn't
5. **What you don't know** — "not assessed by a technician", "not play-tested beyond checking key action", "body material not confirmed". Stating the limits is what makes the rest credible
6. **Shipping and returns** — handling time, how it's packed, the return policy

### Facebook Marketplace

Local, fee-free on pickup, and read on a phone. Shorter, plainer, no eBay conventions.

| Field | Rule |
|---|---|
| **Title** | Brand, instrument, and the one thing that matters — "Bundy Resonite Clarinet with Case, plays" |
| **Price** | Marketplace buyers expect to negotiate. Set a little above the floor and leave room, or mark it firm and mean it |
| **Category** | Musical Instruments |
| **Condition** | New · Used – Like New · Used – Good · Used – Fair. Map `Fair`/`Poor`/`Project` to **Used – Fair** and put the fault in the first line of the description |
| **Description** | Three short paragraphs: what it is; condition including the faults; what's included and where pickup is |
| **Location** | A general area, not the school address |
| **Availability** | Single item; mark sold rather than deleting, so the history stays |

**Safety, since these are program-linked sales:** meet in a public place or at the school during hours, don't publish the school address, keep the exchange in Marketplace messaging, and take cash or a platform payment — no wire, no gift card, no "I'll send my driver".

### Cross-posting

The same instrument can run on both. Price the eBay listing higher — it carries fees and a box. Whichever sells first, **pull the other listing the same day**. A sold instrument still live on Marketplace generates messages for weeks and one very annoyed buyer.

---

## 6. Publish and ship

### What can actually be automated

Checked August 2026 — verify before building anything, since both platforms move.

**eBay: real automation exists and is open to ordinary sellers.**

- **Seller Hub Reports** (formerly File Exchange) — upload listings in bulk as CSV or Excel from a downloaded template. Free with Seller Hub; private sellers need at least one completed sale for access. The realistic path for a batch of instruments.
- **Sell Feed API** — bulk listing feeds processed asynchronously.
- **Inventory API** — the REST API eBay recommends for new integrations; creates inventory items and offers, then publishes. Requires an eBay Developers Program account and a seller account opted in to Business Policies.
- **Trading API** — older XML interface; still supports add, revise, relist, end.
- **Inventory Mapping API** — takes photos, titles and identifiers and returns a listing preview with category and item-aspect recommendations, which then feeds the listing APIs. US marketplace only.

Practical recommendation: **build the CSV, not the API integration.** A batch of twenty items does not justify OAuth, business policies and a sandbox; the template upload does the same job in an afternoon. Reach for the Inventory API only if disposal becomes a recurring channel.

A Seller Hub Reports row is roughly `Action, CustomLabel, Category, Title, Description, ConditionID, PicURL, Format, StartPrice, Duration, Quantity, Location` — `ConditionID` 3000 for Used and 7000 for For parts or not working, and `CustomLabel` carrying the `LOT-###` so the pipeline file and the live listings stay matched. **Take the column set from the current downloaded template, not from this list** — eBay's template is authoritative and the schema changes.

**Facebook Marketplace: no public listing API.** Meta's Graph API does not cover Marketplace, because Marketplace listings are posted by private individuals rather than business Pages. Marketplace Partner Item and Seller APIs exist, but they are restricted partner programs for approved businesses in categories like vehicles and rentals — not a route an individual seller can take. Third-party "Marketplace APIs" are scrapers, and Meta has been enforcing against them.

That leaves:

- **Manual posting from generated copy** — this skill produces title, price, condition and description per item; posting is copy-paste plus photo upload. Two or three minutes an item.
- **Bulk-lister browser extensions** exist and fill the Marketplace create flow from a CSV. They automate a human session rather than an API, which puts them against Meta's automation terms and puts the account at risk. Not recommended for an account tied to a school program.

So: **eBay by CSV, Facebook by hand.** Say that plainly when asked, rather than implying a Marketplace integration is available.

### Auction or fixed price

- **Auction** suits liquid items with dense comps. Start **at the floor**, no reserve. A start above the floor suppresses early bidding; a reserve annoys bidders into leaving.
- **Fixed price with Best Offer** suits thin markets — vintage, mixed-parts, professional, anything unusual. An auction on a thin market finds exactly one bidder, at the start price.

The discipline that governs buying applies in reverse: set the floor once, in advance, and hold it. Relisting costs nothing but time.

### Packing

The case protects the instrument from the world; the box protects the case. Never ship a case with a label on it.

1. **Remove the mouthpiece** from the receiver — shipping shock seats it hard enough to need a puller, and that's a damage claim on arrival. Wrap it separately.
2. **Disassemble jointed woodwinds** into the case's moulded compartments; never ship a clarinet or flute assembled.
3. **Fill the voids inside the case** with soft cloth so nothing shifts. Not newspaper against the finish.
4. **Latch the case and tape the latches.**
5. **Double box** — at least 2" of rigid fill on all six sides. The bell throat on brass and the headjoint on flutes are the fragile points.
6. **Insure for the full sale price**, with tracking. Rough boxed weights: flute 5–8 lb, clarinet 6–10 lb, alto sax 15–20 lb, tenor sax 20–28 lb, trumpet 10–14 lb, French horn 20–28 lb, euphonium 28–38 lb. Check girth limits on the large ones; oversize surcharges can exceed the saving from picking the wrong carrier.
7. **Film the packing** — one continuous video from bare instrument to sealed box, showing the serial. Two minutes, and it settles almost every dispute that follows.

### Seller-side red flags

- A buyer asking to move off-platform, or to ship to an address other than the order's — decline both
- A partial-refund request shortly after delivery instead of a return — usually leverage; ask for photographs and offer a return
- A not-as-described claim citing something visible in the listing photographs — answer with the photo and the packing video, calmly, once

---

## 7. Close it out

1. **Record the money** before the payout lands and the numbers blur. In `sale-inventory.md` for `LOT-###` items, in `inventory.md` for fleet instruments:

```
| Sale ID | LOT / MPR | Instrument | Channel | Listed | Sold | Gross | Fees | Shipping | Net | Notes |
```

`SALE-###` in sale order. Record **gross, fees and net separately** — net alone hides what the channel cost, and that is the only data that says whether eBay, Reverb or local was the right call next time.

2. **Compare net against landed cost** where one exists, and note the difference. Over a few sales it is the only honest read on whether the program's buying is any good.

3. **Log the proceeds against the budget year.** Money moving through the program without a record is the failure that already bit this program once, on the service side. A sale is the same shape of problem.

4. **For a fleet instrument, hand off to `instrument-inventory` Workflow 5** — status to `Sold`, assignment row closed, MPR ID retired, `mpr-tags.html` regenerated with the entry removed from the `FLEET` array. An instrument that left the building but is still in the tag picker will eventually get a tag printed for it.

5. **For a `LOT-###` item**, set its stage to `Sold` and leave the row. The pipeline file is also the record of what was disposed of, and for how much.

---

## Selling to a program family

- **Price at the low end of comps, not below.** A visible discount to one family becomes an expectation for the next.
- **Put the number and the condition in writing.** An email is enough; the point is that everyone remembers the same transaction a year later.
- **Say plainly it is sold as-is** and that the program is not a warranty — then be generous about pointing them to a repair shop.
- **The instrument is gone.** Sold is not on loan; it does not come back if the student quits in March. Make sure that is understood before money changes hands.
- Record it through Phase 7 like any other sale, channel noted as internal.

---

## Appendix A: the no-guessing rules

Applied to every listing, description, title and item specific:

1. **Year** — only from a published serial chart, with the source recorded next to it. Otherwise blank, and the listing says nothing about age.
2. **Model** — only what is engraved. "Model unknown" is legitimate and costs less than a wrong model number.
3. **Material** — only from a mark or a physical check. Wood-look resin is common.
4. **Maker behind a stencil brand** — only with a documented match. "Believed to be made by ___" belongs in a conversation, not a listing.
5. **"Rare", "professional", "vintage"** — each is a claim. Drop all three unless a source supports it.
6. **Playing condition** — "plays" means someone played it. "Appears playable" means nobody did, and that is what the listing must say.
7. **Where two sources disagree**, record both and publish neither.

When a fact is wanted and the evidence is not there, the answer is a photograph or a physical check — not an inference.

## Appendix B: when the answer is not "sell"

| Situation | Better move |
|---|---|
| Low value, high repair cost, no buyer interest | **Retire** — parts donor, or a loaner for a student who might quit in six weeks |
| Playable but obsolete for the program | **Donate** to a smaller program; record where it went |
| Never program property to begin with | **External** — correct the record, no sale involved |
| Within the return window | **Return** — full price beats market price every time |
| Sentimental or donated instrument | Ask before listing. The money is rarely worth the relationship |
| A pile of weak student horns | **Lot them** — one transaction, one box, one buyer who repairs |

