---
name: music-purchase
description: Select and purchase concert band music for the program — starting with the actual students and instrumentation, defining the repertoire need, searching current publisher and vendor catalogs, evaluating whether a piece genuinely fits the ensemble rather than trusting its published grade alone, comparing editions and prices, and maintaining a disciplined purchase list. Use this skill whenever Jesse asks what music the band should buy, asks for repertoire recommendations, wants to find music for a particular concert or grade level, shares a publisher or music listing, asks whether a piece will work for the current band, or wants to build a concert program. Do not use it for instrument purchases — that is `instrument-purchase`. Do not use it for selling music or instruments.
---

# Music Purchase

Handles repertoire acquisition for the Maple Ridge band program: understanding who is actually in the ensemble, identifying what the band needs musically, finding appropriate literature, evaluating the real difficulty and instrumentation, and purchasing music that will serve the students rather than merely filling a concert slot.

Failure modes this exists to prevent: buying music because the title sounds good; treating the publisher's grade number as the whole difficulty question; choosing music that assumes instruments the band does not have; buying pieces that are technically playable but musically inappropriate for the current students; purchasing too much music at one level; and building a library full of pieces that look useful on paper but never get performed.

---

## Core principle

**The students come before the catalog.**

Do not begin by asking "What Grade 2 music is good?"

Begin by asking:

> **Who is in this band, what can they actually do, what do I want them to learn, and what kind of music will make this particular ensemble sound good?**

A published grade is evidence, not a verdict.

Different publishers use different grading systems and descriptions. Current publisher systems commonly distinguish levels using factors such as range, rhythmic complexity, independence between parts, scoring, cross-cueing, and percussion demands.

Therefore:

**Published grade → initial filter**

**Actual student capability → final judgment**

A Grade 2 piece with exposed trumpet writing may be harder for this band than a Grade 2.5 piece whose difficult material sits in the stronger sections.

The goal is not to buy the easiest music the band can survive.

The goal is to buy music the band can **learn, perform, and grow through**.

---

# Files

Read the current student and ensemble files before making repertoire recommendations.

| File | Role |
|---|---|
| `students.md` | **Read first.** Current students, instruments, grade/year, playing level, and other student information |
| `assignment.md` | Read: current instrument assignments and actual deployment |
| `inventory.md` | Read: instruments currently available, missing parts of the ensemble, and equipment limitations |
| `repertoire.md` | **Read first for past purchases.** Music already owned, performed, programmed, or deliberately avoided. Write new titles through `session-updates.md` |
| `sale-inventory.md` | Read when relevant: music/instruments being disposed of can affect whether a new purchase makes sense |
| `model-reference.md` | Not normally needed; use only if a repertoire question turns into an instrument question |
| `session-updates.md` | **Write through session updates** when this skill calls for persistent changes |

If a dedicated current-year ensemble file exists, it supersedes older student data.

If only last year's student data is available, **say so explicitly**. Do not silently treat last year's roster as this year's roster.

---

# Where this skill stops

| Concern | Owned by |
|---|---|
| Determining repertoire need | **This skill** |
| Evaluating students against repertoire | **This skill** |
| Finding current music | **This skill** |
| Evaluating publisher grade, instrumentation, difficulty, and educational value | **This skill** |
| Comparing prices and editions | **This skill** |
| Recommending what to purchase | **This skill** |
| Recording repertoire purchase recommendations | **This skill** |
| Instrument acquisition | `instrument-purchase` |
| Instrument arrival/intake | `instrument-inventory` |
| Instrument placement | `instrument-inventory` |
| Instrument disposal | `instrument-sale` |
| Coupa expense/invoice history, and attaching a Coupa ID to a purchase | `coupa-expense-reconciliation` |

**This skill does not call Coupa MCP tools.** `repertoire.md` is the record of what the program owns. When the question is what was actually paid — "did we already expense this?", "what has the program spent at JW Pepper?", "attach the Coupa line to this title" — hand off to `coupa-expense-reconciliation`, which owns Coupa access and the verified query patterns. Come back here once the titles are confirmed.

---

# Recording changes during a Claude Enterprise session

A Claude Enterprise project can read the project files, but conversation work does not automatically become a permanent edit to those files.

Whenever this skill says to add, update, or create something in `repertoire.md`, `students.md`, `assignment.md`, or another project file, use the same session-update mechanism as `instrument-purchase`.

Do not silently rewrite the target file.

Append a dated entry to `session-updates.md`.

Keep one `session-updates.md` artifact open for the entire conversation.

### Entry format

```text
## <ISO timestamp> — music-purchase, Phase <n> (<phase name>)
**Target file:** <file.md>
**Change:** <one line: append row / update field / add repertoire candidate, etc.>
<the literal row or field value, in the target file's own format, ready to paste in>
```

At the natural end of a repertoire-selection session, remind Jesse once:

> Download `session-updates.md` and bring it back to Claude Code — it merges these into the real project files.

Do not repeat that reminder after every individual update.

---

# Eight phases

## 1. Who is actually in the band?

Before searching for music, establish the current ensemble.

Read:

- `students.md`
- `assignment.md`
- `inventory.md`

Build a current instrumentation picture.

At minimum identify:

- Flutes
- Oboes
- Bassoons
- Clarinets
- Bass clarinet
- Alto saxophones
- Tenor saxophones
- Baritone saxophone
- Trumpets
- French horns
- Trombones
- Euphoniums/baritones
- Tuba
- Percussion
- Piano/keyboard if applicable
- Electric/acoustic bass if applicable
- Other instruments

Do not assume that an instrument listed in inventory means a student is currently playing it.

Do not assume that a student listed in `students.md` is still in the program.

### Student capability matters too

For each active player, look for whatever evidence is available:

- grade/year
- NYSSMA level
- recent solo repertoire
- previous ensemble repertoire
- known strengths
- known weaknesses
- range limitations
- reading ability
- rhythmic independence
- confidence with exposed parts
- ability to sustain long phrases
- reliability on important entrances
- experience with solos

The student roster is not just a headcount.

It is the musical specification of the ensemble.

### Ask when the roster is uncertain

If the files appear stale, ask Jesse:

> "Is this the current ensemble, or should I treat this as last year's roster?"

Do not invent the current band from old records.

---

# 2. Identify the repertoire problem before searching

Do not search the catalog until the musical need is clear.

A repertoire request should answer as many of these as possible:

| Question | Example |
|---|---|
| Concert | Fall concert |
| Number of pieces | 4 |
| Target level | Mostly 2–2.5 |
| Ensemble | Current Maple Ridge band |
| Desired style | Energetic, accessible, not childish |
| Educational goal | Articulation and dynamic contrast |
| Feature need | Something that lets horns shine |
| Duration | 2–4 minutes |
| Difficulty ceiling | Strongest players can handle ~3 |
| Difficulty floor | Weakest players should remain engaged |
| Budget | $300 |
| Existing library | Avoid duplicating pieces already owned |

### Common repertoire needs

Classify the request before shopping.

- Opener
- Concert closer
- Festival/assessment piece
- March
- Ballad
- Classical transcription
- Contemporary original
- Folk/ethnic music
- Film/pop culture
- Holiday
- Jazz-inspired
- Percussion feature
- Brass feature
- Woodwind feature
- Horn feature
- Low-brass feature
- Student soloist feature
- Educational piece
- Short filler
- Flex/reduced instrumentation
- Emergency piece for incomplete instrumentation

A strong purchase usually solves **more than one problem**.

For example:

> Grade 2.5 + strong opener + horn feature + teaches syncopation

is a better purchasing target than:

> "Find me a Grade 2.5."

---

# 3. Build the target specification

Write the specification **before searching**.

The target has six parts.

### 1. Ensemble

Who will actually play?

Example:

> 2 flutes, 3 clarinets, 2 alto saxes, 3 trumpets, 2 horns, 2 trombones, euphonium, tuba, 2 percussion

If the instrumentation is unusual, explicitly identify the problem.

### 2. Capability range

Use:

- **floor** — weakest meaningful player/section
- **center** — where most of the band sits
- **ceiling** — strongest players

Example:

> Floor: NYSSMA 1–2  
> Center: NYSSMA 2–3  
> Ceiling: NYSSMA 4–5

Do not equate NYSSMA level directly to concert-band grade. Use it as evidence about individual capability.

### 3. Musical target

Examples:

- Grade 2–2.5
- Accessible Grade 3
- Grade 3 with strong cross-cueing
- Grade 1.5 for early-year development
- Mixed program with one stretch piece

### 4. Hard requirements

Examples:

- Must work with current instrumentation
- Must include separate euphonium part
- No required oboe
- No required bass clarinet
- Percussion cannot exceed available players
- Maximum 4 minutes
- Must be suitable for a December concert

### 5. Preferences

Examples:

- Strong melody
- Interesting horn writing
- Limited exposed trumpet range
- Educational value
- Contemporary but not gimmicky
- Good percussion writing
- Something students will actually like playing

### 6. Budget

Set:

- Target per piece
- Maximum per piece
- Total session budget

Do not let the catalog determine the budget.

---

# 4. Search current repertoire

Search current publisher and music-vendor catalogs only after the specification exists.

Useful sources include:

- Publisher catalogs
- Music retailer catalogs
- New-release catalogs
- Composer/publisher pages
- Repertoire databases
- Professional recordings
- Score previews
- Director reviews and recommendations

Current catalogs can be particularly useful because publishers organize music by grade and frequently provide recordings or score previews. Hal Leonard's current catalog, for example, provides new titles by grade and indicates score/video resources for selected pieces.

Wingert-Jones likewise separates its current catalog into multiple achievement levels and provides descriptions of range, rhythms, scoring, and percussion expectations.

### Search broadly first

Start with:

> instrumentation + grade + musical goal + style

Then narrow.

Example:

> concert band grade 2 horn feature lyrical

Better than:

> good Grade 2 band music

### Search multiple publishers

Do not become dependent on one catalog.

Potential sources include:

- Hal Leonard
- Alfred/Faber
- Wingert-Jones
- Excelcia
- C. Alan
- Carl Fischer
- Kjos
- Barnhouse
- Boosey & Hawkes
- Southern Music
- Murphy Music Press
- smaller independent publishers

The purpose of the search is not to find the first acceptable piece.

It is to create a candidate pool.

---

# 5. Evaluate the actual piece

This is the most important phase.

**Never recommend a piece solely because the publisher says it is Grade X.**

Evaluate the piece against the actual ensemble.

## A. Instrumentation fit

Determine:

- Required instruments
- Optional instruments
- Missing instruments
- Divisi
- Doubles
- Auxiliary percussion
- Piano/harp/guitar requirements
- Solo instruments
- Special equipment

### Hard failure

If the piece requires an instrument that the band cannot cover and there is no practical substitution, it is not a candidate.

Do not solve instrumentation problems by pretending they do not exist.

---

## B. Range

Check the parts that matter most.

Pay particular attention to:

- Trumpet upper register
- Horn upper register
- Trombone/euphonium upper register
- Tuba low register
- Clarinet break and upper register
- Flute upper register
- Saxophone altissimo/exposed high writing
- Bassoon range

A piece can be nominally Grade 2 and still be a poor fit if the difficult range is concentrated in a section with no player capable of it.

### Range rule

Ask:

> **Who has to play the hardest notes, and who will actually be assigned those notes?**

---

## C. Rhythm

Look for:

- Syncopation
- Sixteenth-note patterns
- Dotted rhythms
- Ties across beats
- Mixed meter
- Odd meters
- Rapid repeated figures
- Independent rhythmic layers

Then determine whether the rhythmic difficulty is:

- distributed across the band
- concentrated in one section
- exposed
- supported by another section

---

## D. Independence

A Grade 2 piece with independent parts can be harder than a Grade 2.5 piece in which everyone has the melody or accompaniment.

Look for:

- independent entrances
- exposed rests
- staggered entrances
- countermelodies
- layered ostinatos
- independent bass lines
- section-to-section dialogue

---

## E. Musical maturity

Ask whether the students can make the piece sound good.

A piece may be technically playable but musically beyond the ensemble because it requires:

- sustained breath support
- refined intonation
- long phrasing
- sophisticated articulation
- subtle balance
- stylistic maturity
- confident exposed entrances

This matters especially with lyrical or classical repertoire.

---

## F. Percussion

Do not treat percussion as an afterthought.

Check:

- Number of players required
- Number of parts
- Timpani
- Mallets
- Auxiliary instruments
- Drum set
- Percussion effects
- Instrument changes

A four-minute piece that requires six percussionists may not be practical for a band with two.

---

## G. Solos and exposed parts

Identify every significant exposed moment.

Record:

- Instrument
- Difficulty
- Approximate measure/location
- Whether the player exists
- Whether that player is capable
- Whether the part can be covered by another instrument

A piece with a beautiful horn solo is only a good horn feature if your horn player can actually own the part.

---

# 6. Score the candidates

Every serious candidate should receive a structured evaluation.

Use a 100-point internal score.

| Category | Points |
|---|---:|
| Instrumentation fit | 20 |
| Student capability fit | 20 |
| Range fit | 15 |
| Rhythmic/technical fit | 10 |
| Musical quality | 15 |
| Educational value | 10 |
| Programming usefulness | 5 |
| Cost/value | 5 |
| **Total** | **100** |

### Interpretation

**90–100 — Strong buy**

Excellent fit. Recommend confidently.

**80–89 — Buyable**

Good fit with manageable caveats.

**70–79 — Conditional**

Worth considering, but identify the specific issue.

**60–69 — Stretch**

Only buy intentionally as a challenge piece.

**Below 60 — Pass**

Do not buy merely because the piece is attractive.

---

# 7. Compare price and purchasing options

Once the music has passed the musical test, evaluate the purchase.

Record:

- Title
- Composer/arranger
- Publisher
- Grade
- Duration
- Format
- List price
- Current sale price
- Shipping
- Digital/printed status
- Number of copies/parts
- Licensing limitations
- Return policy if applicable
- Vendor

### Do not compare unlike editions

A $45 digital license and a $75 printed set are not automatically different prices for the same thing.

Determine what is actually included.

Pay attention to:

- printed score
- printed parts
- digital score
- digital parts
- permission to print
- number of authorized copies
- replacement-part policy
- director's score
- student books

### Budget rule

The music must fit both:

1. the **musical budget**
2. the **library strategy**

Buying five mediocre pieces because they were inexpensive is worse than buying two pieces that become annual repertoire.

---

# 8. Make the recommendation

The final recommendation should not be a catalog dump.

Give Jesse a ranked shortlist.

For each serious candidate provide:

### Title
Composer/arranger — Publisher

**Grade:**  
**Duration:**  
**Price:**  
**Instrumentation:**  

**Fit:** Excellent / Good / Conditional / Stretch / Pass

**Why it fits this band:**  
2–4 sentences specifically tied to the current students and ensemble.

**Potential problems:**  
Specific ranges, instrumentation, percussion, solos, or musical demands.

**Educational value:**  
What the band will actually learn.

**Programming use:**  
Opener / closer / contrast / feature / festival / etc.

**Recommendation:**  
Buy / Consider / Pass.

---

# The repertoire shortlist

Normally return:

### 1. Best overall choice

The piece that solves the most problems at once.

### 2. Best artistic choice

The most musically interesting option that remains realistic.

### 3. Best safe choice

The piece most likely to succeed quickly.

### 4. Best stretch choice

Only include when appropriate.

### 5. Wild card

An unusual piece that could be particularly successful with this ensemble.

Do not manufacture five recommendations if only two are genuinely good.

**Two excellent choices beat five mediocre ones.**

---

# Student-specific reasoning

The skill should make student-specific connections whenever the data supports them.

For example:

> "This piece has an exposed second-trumpet line. That makes it a better fit for the current group if the stronger trumpet player takes 1st and the developing player takes 2nd."

Or:

> "The horn writing is unusually independent for this grade. That could be a feature rather than a problem if the current horn section is strong."

Or:

> "This looks like Grade 2.5 on paper, but the clarinet writing is unusually exposed. I would not call it a safe Grade 2.5 for this particular band."

Never invent student strengths.

If the file does not establish the student's ability, say:

> "I would want Jesse to confirm whether this player can handle the exposed part."

---

# Use the previous repertoire intelligently

Read `repertoire.md` before recommending purchases.

Look for:

- Pieces already owned
- Pieces already performed
- Pieces recently rejected
- Pieces Jesse liked
- Pieces students responded well to
- Composers used repeatedly
- Styles overrepresented in the library
- Grades overrepresented
- Missing musical categories
- Pieces suitable for reuse

### When `repertoire.md` is thin

Early on the library file will be sparse, and an absence there is **not** evidence the program never bought a piece. Say so rather than treating a blank file as "we own nothing."

If Jesse needs the actual spending history — what was already purchased, from which vendor, at what price — hand off to `coupa-expense-reconciliation`. That skill queries Coupa and knows the verified query patterns; this one does not. When it comes back with confirmed sheet-music purchases, record them here as `REP-###` rows through `session-updates.md` so the next session doesn't need Coupa at all.

Never promote a Coupa line into `repertoire.md` on a vague card descriptor. A merchant string is not a catalog title — confirm the actual title and edition with Jesse first, and keep instrument purchases out of the repertoire library entirely.

### Library balance

The goal is not simply to accumulate music.

Look for gaps such as:

> "You have plenty of Grade 2 marches but almost no lyrical Grade 2 literature."

or:

> "The library has several contemporary Grade 3 pieces but very little accessible classical repertoire."

or:

> "You have a strong collection of pieces for full instrumentation but very little that works when one or two sections are absent."

That is a purchasing opportunity.

---

# Grade distribution

Do not automatically buy everything at the band's average grade.

A healthy program may need a mixture of:

- **Below-level pieces** — confidence and early success
- **Core-level pieces** — primary instructional repertoire
- **Stretch pieces** — growth
- **Feature pieces** — individual/section development
- **Flexible pieces** — insurance against instrumentation changes

A program whose entire library sits at one difficulty level becomes difficult to program.

---

# "Can they play it?" versus "Can they perform it?"

These are different questions.

### Playable

The students can technically execute the notes.

### Performable

The students can execute the notes while producing:

- appropriate tone
- balance
- intonation
- style
- phrasing
- dynamics
- articulation
- musical character

The recommendation should be based on **performability**, not merely survivability.

---

# Special rule for developing ensembles

For a developing band, favor music that gives students something meaningful to do.

Avoid music where:

- first parts do everything
- weak players count rests
- low brass simply doubles bass notes
- percussion has little musical responsibility
- one section carries the entire piece
- the easiest parts are so easy that students disengage

Good developing-band literature distributes musical responsibility intelligently.

---

# Special rule for small or unusual instrumentation

If the current ensemble is missing standard instruments, search specifically for:

- flexible instrumentation
- adaptable scoring
- reduced instrumentation
- cross-cued parts
- optional parts
- "one player per part" arrangements
- works designed for incomplete bands

Do not automatically reject a piece because one nonessential part is absent.

But do reject a piece if its musical structure depends on an unavailable instrument.

Flexible/flex-band literature can be particularly useful for incomplete or changing ensembles; current publishers explicitly market such series for reduced or flexible instrumentation.

---

# Current-year versus historical students

Historical student data is useful for understanding the program's trajectory.

It is not sufficient to establish the current ensemble.

If the only available roster is last year's:

1. Use it to establish a provisional capability picture.
2. Clearly label the picture as historical.
3. Do not make a final purchase recommendation that depends on specific current students without confirmation.
4. Ask Jesse for the current roster when the purchase decision is ready.

---

# Repertoire evidence hierarchy

When evaluating a piece, use evidence in this order:

1. **Actual score/parts**
2. **Publisher score preview**
3. **Publisher instrumentation information**
4. **Professional recording**
5. **Publisher description**
6. **Trusted repertoire database**
7. **Vendor description**
8. **Director/community commentary**
9. **Search-result snippets**

The lower levels are useful for discovery.

They should not be treated as proof of detailed musical difficulty.

---

# No-guessing rules

1. **Grade** — record the publisher's grade, but do not treat it as a complete difficulty assessment.

2. **Instrumentation** — verify from publisher or score information.

3. **Duration** — use publisher/score information where available; do not guess from a recording.

4. **Range** — verify from the actual part or score whenever possible.

5. **Percussion** — verify the required instruments and number of players.

6. **Price** — use the current vendor/publisher price at the time of recommendation.

7. **Edition** — identify the actual edition being recommended.

8. **Availability** — do not claim a piece is currently available unless the current source establishes it.

9. **Student capability** — never infer a specific student's ability from their instrument alone.

10. **Recording** — a polished professional recording proves what the piece can sound like, not what this band can produce.

11. **Publisher grade** — different grading systems are not automatically interchangeable.

12. **"Easy"** — never use this word without explaining what makes the piece easy.

---

# When the answer is not "buy"

| Situation | Better move |
|---|---|
| Current instrumentation cannot cover the piece | Pass |
| One student would be dangerously exposed | Find another piece |
| The piece duplicates an existing library gap-free title | Use the existing title |
| Grade is appropriate but musical maturity is not | Pass or wait |
| Piece is technically easy but artistically thin | Pass |
| Piece is too easy for nearly everyone | Use only if confidence-building is the goal |
| Piece is too hard but strategically valuable | Consider as intentional stretch |
| Current roster is unknown | Establish roster first |
| Price is high but the piece fills a major library gap | Consider |
| Cheap piece with little future use | Pass |
| Missing instrument is genuinely optional | Consider |
| Missing instrument is structurally essential | Pass |
| Great piece but no student can cover its exposed solo | Find an alternative |
| Attractive title but weak ensemble fit | Pass |

---

# Purchase decision language

Use direct recommendations.

### BUY

> **BUY.** This is one of the strongest fits for the current ensemble.

### BUY — CONDITIONAL

> **BUY IF:** Jesse confirms that the horn section can cover the exposed material.

### CONSIDER

> **CONSIDER.** Strong piece, but it solves a narrower programming need.

### STRETCH

> **STRETCH.** Appropriate only if Jesse intentionally wants this to be the band's growth piece.

### PASS

> **PASS.** Attractive repertoire, but the fit is wrong for this ensemble.

Do not hide a weak recommendation behind a long list of pros and cons.

---

# Building a concert program

When the user asks for a concert rather than a single piece, evaluate the program as a whole.

Look for:

- opening energy
- contrast
- tempo variety
- tonal variety
- style variety
- student features
- section features
- difficulty progression
- duration
- audience accessibility
- educational purpose
- appropriate closer

Avoid four pieces that all sound alike.

Avoid four pieces that all demand the same section.

Avoid putting the hardest piece first.

A strong program should feel intentional rather than like four unrelated pieces that happened to be purchased.

---

# Search behavior

When web search is available, search current sources rather than relying on memory for:

- current titles
- current publishers
- current grades
- current prices
- current availability
- current editions
- new releases

Use publisher sources whenever possible.

Use retailer sources for price/availability comparisons.

Use recordings to evaluate musical character.

Use repertoire lists and educational resources for discovery and cross-checking.

Do not present a search result as a recommendation until it has passed the ensemble-fit evaluation.

---

# Candidate tracking

When multiple pieces are being considered, assign temporary IDs:

`MUSIC-001`, `MUSIC-002`, etc.

Example:

| ID | Title | Grade | Fit | Status |
|---|---|---:|---|---|
| MUSIC-001 | Title A | 2.5 | 92 | BUY |
| MUSIC-002 | Title B | 2 | 86 | CONSIDER |
| MUSIC-003 | Title C | 3 | 74 | STRETCH |

These IDs are **repertoire-search IDs**, not inventory IDs.

A purchased title receives a permanent `REP-###` in `repertoire.md`, assigned sequentially and never reused. A `MUSIC-###` never becomes a `REP-###` — the candidate row closes and a fresh library ID is issued on purchase, the same way `WATCH-###` and `MPR-###` stay separate on the instrument side.

---

# Do not let candidate tracking become permanent clutter

A temporary candidate that is rejected does not need to live forever in the repertoire database.

Record permanent information such as:

- purchased titles
- intentionally rejected titles when the reason will be useful later
- meaningful programming notes
- vendor/edition information
- student-specific notes that will affect future programming

Do not turn every web search into a permanent database entry.

---

# Final purchase list

When Jesse says "let's buy these," produce a concise purchase list containing:

| Title | Composer/Arranger | Publisher | Grade | Price | Reason |
|---|---|---|---:|---:|---|
| ... | ... | ... | ... | ... | ... |

Then calculate:

**Music subtotal**

**Shipping**

**Tax if applicable**

**Total**

If multiple vendors are involved, show the vendor breakdown.

Do not silently include optional items.

---

# Purchase handoff

Once Jesse has decided to purchase:

1. Record the selected titles.
2. Record vendor and edition.
3. Record price at decision time.
4. Record the intended concert/program.
5. Record any important notes about instrumentation.
6. Add the information to `session-updates.md`, targeting `repertoire.md`.
7. When the music arrives, update the permanent repertoire file.

Music does not need the same physical intake process as an instrument, but the library still needs a reliable record of what the program owns.

Once the purchase actually appears in Coupa, tying the expense line to the `REP-###` row belongs to `coupa-expense-reconciliation`, not here.

---

# Long-term repertoire strategy

The purpose of this skill is not simply to answer:

> "What should I buy today?"

It should gradually make the Maple Ridge repertoire library smarter.

Over time, look for:

- recurring successful composers
- pieces that consistently work with developing students
- useful grade bands
- instrumentation patterns
- programming gaps
- pieces that remain useful after students graduate
- titles that work with unusually small ensembles
- music that repeatedly gets rejected for the same reason

The repertoire library should become a record of **what works for this program**, not merely a list of titles the program owns.

---

# Appendix: repertoire-selection checklist

Before recommending a purchase, verify:

1. **Who is playing it?**
2. **What is the current instrumentation?**
3. **What is the weakest section that matters?**
4. **What is the strongest section?**
5. **What is the published grade?**
6. **What does the actual music demand?**
7. **Who has the exposed material?**
8. **Are the ranges realistic?**
9. **Are the rhythms realistic?**
10. **Is the percussion practical?**
11. **Does the band have all essential instruments?**
12. **Does the piece teach something useful?**
13. **Does it fill a programming/library need?**
14. **Is it already owned?**
15. **Is the current price reasonable?**
16. **Is this better than the next-best option?**
17. **Would Jesse still want it if the title and composer were hidden?**
18. **Would the band actually sound good performing it?**

If the answer to #18 is uncertain, **do not recommend the purchase yet.**

---

# The governing rule

> **Buy music for the band you have, not the band you wish you had.**

Then deliberately buy a small amount of music that helps build the band you want to have.