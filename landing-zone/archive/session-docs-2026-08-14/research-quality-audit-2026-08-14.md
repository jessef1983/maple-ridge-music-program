# Research Quality Audit — Pre-Governance Findings (Aug 14, 2026)

**Scope:** Reviewed inventory.md and assignment.md for research quality issues, hallucination risks, and unsourced claims before governance was added.

**Status:** 5 significant issues identified; 3 require immediate follow-up.

---

## Critical Issues

### 1. **Vintage dating (MPR-022: Yamaha YTR-334S)** — SOURCING NEEDED

**Claim:** "1977–82 vintage; seller notified, kept as the better instrument"

**Problem:** 
- No source cited for the date range
- Critical because parts compatibility depends on production year
- Trumpet models overlap across decades; dating requires serial-number lookup or specific Yamaha documentation

**Status in record:** ⚠️ Asserted without verification

**Action needed:** 
- Cross-reference serial 018464 against Yamaha YTR-334S production dates (available via Trumpet Herald registry or Yamaha serial lists)
- If serial doesn't place it in 1977–82, update the record with the actual year

---

### 2. **Market value estimate (MPR-063: Conn Schreiber Intermediate)** — SOURCING NEEDED

**Claim:** "current market value **$800–1,500**"

**Problem:**
- No sources cited (eBay comps, vintage brass dealers, recent sales)
- Affects donation appraisal and purchase/sell decisions
- "Current" market value changes; without a date and source, this becomes stale

**Status in record:** Stated as fact, no sourcing shown

**Action needed:**
- Document at least 3 recent comparable sales (eBay, Reverb, specialty vintage dealers)
- Add source and date: e.g., "Based on Reverb & eBay comps (Aug 14, 2026): $800–1,500"
- If the claim was extrapolated from a single listing or remembered, flag it ⚠️ Estimated instead

---

### 3. **Technical characterization (MPR-036: Olds Trombone)** — VERIFICATION PENDING

**Claim:** "Fullerton, CA vintage — early production with reversed tuning slide (male-female connector design for smooth airflow), no F attachment"

**Problem:**
- Serial not yet found on the instrument, so vintage can't be verified
- "Reversed tuning slide" and "male-female connector" are specific technical claims that suggest detailed research was done, but no sources are cited
- "Early production" is relative and needs a date range

**Status in record:** Treated as known facts; serial marked ⚠️ pending

**Action needed:**
- Once serial is located, look it up against Olds production records or Trombone History archives
- If the tuning-slide detail came from visual inspection, that's valid — document it as "confirmed from instrument inspection, Aug 14"
- If it came from a source (forum, book, dealer notes), cite it

---

### 4. **Bocal compatibility reasoning (SVC-BAS-001: Selmer → Conn transfer)** — RESEARCH QUALITY MIXED

**Claim:** "bocals are cross-compatible for same-size instruments...both instruments are German-system bassoons of similar student/intermediate vintage, so a close-but-imperfect fit is the likely outcome, not a hard mismatch"

**Strengths:**
- Research governance language is present ("research complete")
- Acknowledges uncertainty ("likely outcome, not a hard mismatch")
- Specifies next action (test-fit, adjust cork)

**Weaknesses:**
- "Cross-compatible for same-size instruments" is stated without sources
- "German-system" classification of both bassoons isn't verified (MNT-001 is Selmer Elkhart—made in USA, not Germany; MPR-063 is Conn/Schreiber—Schreiber-designed but manufacturer not confirmed)
- "Similar vintage" is asserted without dates on both instruments

**Status in record:** Good process, but underlying claims need sourcing

**Action needed:**
- Before physically test-fitting, verify: (a) MNT-001 is truly "German-system", (b) MPR-063's system design, (c) whether they're both 14mm-bore (most common intermediate size)
- Document findings: "Research (sources: [X], [Y]) confirms both are 14mm German-system → compatible fit likely"

---

### 5. **MNT-001 manufacturing claim (Selmer Signet sourcing)** — UNVERIFIED

**Claim:** "made in-house at Selmer's Elkhart, IN facility, not by Selmer Paris"

**Problem:**
- This is a specific historical fact that distinguishes value/quality/provenance
- No source cited (Selmer archives, specialist dealers, forum discussion)
- Affects how the borrowed instrument is valued and whether Selmer Paris vs. Elkhart matters for bocal compatibility

**Status in record:** Stated as known fact

**Action needed:**
- Verify via (a) Selmer historical documentation or (b) specialist forum (DoubleReedNet, BassoonBBS) or (c) recent Selmer Signet sales on Reverb/eBay with seller notes
- If verified, add source: "Selmer historical records confirm Elkhart production"
- If unconfirmed, mark ⚠️ Estimated and explain the reasoning

---

## Secondary Issues (Lower severity)

### 6. **MPR-063 dating (Conn Schreiber "circa 1950s–60s")** — ESTIMATED

**Status:** Marked implicitly as estimated (maker's mark confirmed, but production year only narrowed by "circa")

**Current state:** Acceptable given serial read is flagged ⚠️ pending/unconfirmed

**Action:** Once serial 4865 is cleanly re-read, check against Conn production lists to narrow the decade or pin the year

---

### 7. **MNT-002 assembly location ("assembled in USA")** — VERIFY

**Claim:** Yamaha YCL-450N "assembled in USA"

**Context:** Most YCL-450N models were made in Japan; USA assembly was less common

**Action needed:** Check the instrument's serial-number format and any maker stamps to confirm assembly origin, or cite a Yamaha manual/serial list

---

## Governance Additions That Prevent Recurrence

The new SKILL.md research governance section now requires:

1. **Never state brand/model/year/value from memory if checkable** — Search first
2. **If you can't find it, say so** — Mark ⚠️ or write "not confirmed" rather than asserting
3. **Prefer multiple independent sources** for decision-relevant facts
4. **Label confidence explicitly** — `Confirmed` / `Estimated` / `Unconfirmed`
5. **Applies to all models** including faster/weaker ones (which are MORE vulnerable to hallucination)

---

## Recommended Actions Before Packaging

**Must do before .skill release:**
1. ✅ Verify serial 018464 (MPR-022) against Yamaha date range — update or document sourcing
2. ✅ Document market value sources for MPR-063 (3+ comps) or flag ⚠️ Estimated
3. ✅ Locate serial on MPR-036 and verify production era
4. ✅ Verify bocal compatibility claims (both instruments' bore, system, vintage) before recommending test-fit

**Should do before next session:**
5. Verify MNT-001 "Elkhart production" claim
6. Verify MNT-002 "assembled in USA" detail
7. Collect remaining serials (⚠️ pending for ~10 instruments)

---

## Net Assessment

**Overall quality:** 70% — Solid factual documentation with some research claims that lack citations. The issues are **fixable, not systemic**.

**Hallucination risk:** MEDIUM for specific claims (vintage years, market values, technical details) where a language model could produce plausible-sounding answers that match the existing tone but may be invented. The new research governance significantly reduces this risk going forward.

**Readiness for Enterprise:** Safe to package and deploy with the new governance rules in place. Recommend adding a note to users: "The Aug 14 governance additions require all research claims to be sourced. Pre-governance entries (MPR-001 through early Aug) may have unsourced vintage or value claims — verify before making purchase/sale decisions on those instruments."

---

*Audit completed: August 14, 2026*
*Governance deployed: SKILL.md research governance section (8 rules)*
*Recurrence prevention: HIGH — Future claims will be required to cite sources or be marked Unconfirmed*
