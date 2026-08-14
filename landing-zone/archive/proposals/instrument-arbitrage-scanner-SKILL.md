# Instrument Arbitrage Scanner Skill

## Overview

Scans regional pawn shops, estate auctions, and online marketplaces for underpriced band instruments by analyzing listing imagery, descriptions, and asking prices. Identifies "sleeper" deals—instruments priced below market value—and dispatches real-time WhatsApp alerts when acquisition targets meet profit floor thresholds.

**Core thesis:** Silver-plated Yamaha intermediate/pro brass is the highest-confidence flip category. Minimum net profit floor: **$150.00** on yellow brass, more lenient on silver-plate.

**Triggers:** Manual scan request or periodic scheduled run (hourly/daily)

---

## Core Responsibility

Answer: *"Is this listing a deal worth acting on?"*

The scanner handles:
- **Web scraping** — Extract title, description, images, asking price from listing pages
- **Vision analysis** — Identify instrument brand, model, finish (silver vs. lacquer), tier (student/intermediate/pro)
- **Market evaluation** — Estimate resale value based on model + condition
- **Profit calculation** — (estimated resale) - (asking price + estimated repair cost) = projected margin
- **Threshold filtering** — Flag items meeting the $150 floor (yellow brass) or silver-plate priority
- **Real-time alerts** — WhatsApp notification to your phone with deal summary + link

---

## Inputs

### Listing URLs (Targets)

```yaml
targets:
  pawn_and_auction_sites:
    - "https://auctionninja.com"
    - "https://aarauctions.com"
    - "https://reverb.com/marketplace"
    - "https://ebay.com/sch/musical-instruments"
```

Per-run input: List of URLs to evaluate. Can be:
- Pawn shop inventory pages
- Estate auction listings
- Marketplace search results
- Single item links

### Configuration

```yaml
preferences:
  preferred_finish: "Silver"  # Priority 1: silver-plated instruments
  keep_lacquered_visible: true  # Show low-profit lacquered items for review
  min_net_profit_yellow_brass: 150.00  # Profit floor for yellow brass
  estimated_repair_cost: 75.00  # Assumed service cost factored into profit calc

classification_tiers:
  - "Student"  # Budget entry-level
  - "Intermediate"  # Yamaha YAS-52 / YEP-201 range
  - "Pro"  # High-end Yamaha 62, Besson, Bach, etc.

notifications:
  whatsapp_enabled: true
  twilio_sandbox_number: "whatsapp:+14155238886"
```

### Per-Listing Data (Scraped)

```json
{
  "url": "https://auctionninja.com/listing/vintage-yamaha-yas-23-alto-sax",
  "title": "Vintage Yamaha YAS-23 Alto Saxophone with case",
  "description": "Good condition, some cosmetic wear, all pads are original. Plays well. Located in Kingston, NY. Will ship.",
  "images": [
    "https://auctionninja.com/img/item-001.jpg",
    "https://auctionninja.com/img/item-002.jpg"
  ],
  "asking_price": 225.00,
  "source": "auctionninja",
  "scraped_at": "2026-08-14T15:30:00Z"
}
```

---

## Output

### High-Confidence Alert (Priority 1: Silver-Plate)

```json
{
  "alert_status": "PRIORITY_1_SILVER",
  "confidence": "high",
  "item": {
    "title": "Yamaha YAS-62 Alto Saxophone, Silver-plated",
    "url": "https://auctionninja.com/listing/yamaha-yas-62-alto-sax-silver",
    "asking_price": 425.00,
    "images": [...]
  },
  "analysis": {
    "brand": "Yamaha",
    "model": "YAS-62",
    "finish": "Silver-plate",
    "condition": "Fair (minor dents, plays well)",
    "instrument_tier": "Pro",
    "estimated_market_value": 650.00
  },
  "profit_calculation": {
    "estimated_resale": 650.00,
    "asking_price": 425.00,
    "estimated_repair_cost": 75.00,
    "projected_net_profit": 150.00,
    "profit_margin_percent": 26.1
  },
  "alert": true,
  "alert_reason": "Silver-plated pro-tier instrument at $150+ net profit margin",
  "whatsapp_sent": true,
  "whatsapp_timestamp": "2026-08-14T15:32:15Z"
}
```

### Medium-Confidence Alert (Priority 2: Yellow Brass, High Profit)

```json
{
  "alert_status": "PRIORITY_2_YELLOW_BRASS_PRO",
  "confidence": "medium",
  "item": {
    "title": "Yamaha YTR-5335 Bb Trumpet, Lacquered",
    "url": "https://aarauctions.com/lot/yamaha-ytr-5335-trumpet",
    "asking_price": 180.00,
    "images": [...]
  },
  "analysis": {
    "brand": "Yamaha",
    "model": "YTR-5335",
    "finish": "Lacquered (yellow brass)",
    "condition": "Good (light cosmetic wear)",
    "instrument_tier": "Pro",
    "estimated_market_value": 450.00
  },
  "profit_calculation": {
    "estimated_resale": 450.00,
    "asking_price": 180.00,
    "estimated_repair_cost": 75.00,
    "projected_net_profit": 195.00,
    "profit_margin_percent": 52.0
  },
  "alert": true,
  "alert_reason": "Pro-tier instrument exceeds $150 net profit floor",
  "whatsapp_sent": true
}
```

### Visible but Low-Priority (Lacquered, Modest Profit)

```json
{
  "alert_status": "VISIBLE_LOW_PRIORITY",
  "confidence": "low",
  "item": {
    "title": "Yamaha YCL-450 Clarinet, Lacquered",
    "url": "https://pawnbrokers.example.com/clarinet-001",
    "asking_price": 120.00,
    "images": [...]
  },
  "analysis": {
    "brand": "Yamaha",
    "model": "YCL-450",
    "finish": "Lacquered (yellow brass)",
    "condition": "Fair (some key wear)",
    "instrument_tier": "Intermediate",
    "estimated_market_value": 250.00
  },
  "profit_calculation": {
    "estimated_resale": 250.00,
    "asking_price": 120.00,
    "estimated_repair_cost": 75.00,
    "projected_net_profit": 55.00,
    "profit_margin_percent": 31.4
  },
  "alert": false,
  "reason": "Below $150 profit floor; shown for visibility if `keep_lacquered_visible: true`",
  "whatsapp_sent": false
}
```

### Suppressed (Not a Deal)

```json
{
  "alert_status": "SUPPRESSED",
  "confidence": "n/a",
  "item": {
    "title": "Generic 'Band Instrument Lot' - Unknown Brand",
    "url": "https://example.com/mystery-lot",
    "asking_price": 800.00
  },
  "analysis": {
    "brand": "Unknown",
    "model": "Unidentifiable",
    "finish": "Unknown",
    "condition": "Unknown",
    "instrument_tier": "Unknown",
    "estimated_market_value": 0.00
  },
  "profit_calculation": {
    "estimated_resale": 0.00,
    "asking_price": 800.00,
    "estimated_repair_cost": 0.00,
    "projected_net_profit": -800.00
  },
  "alert": false,
  "reason": "Cannot confidently identify instrument; insufficient market data",
  "whatsapp_sent": false
}
```

---

## Vision Analysis Logic

### Finish Detection (from image + text)

**Priority indicators:**
1. **Text match** — "silver-plated", "silver plate", "Ag", "SP" in title/description
2. **Image inspection** — Reflectivity, patina color (bright silver vs. duller lacquer)
3. **Model heuristic** — Yamaha YAS-62, YEP-321, etc., default to silver if not specified

**Classification:**
- `Silver-plate` → High priority, relaxed profit floor
- `Lacquered (yellow brass)` → Medium priority, strict $150 floor
- `Nickel` → Lower priority (harder to resell, less collector interest)
- `Unknown` → Suppressed unless model is high-confidence pro tier

### Model & Tier Recognition

**Model extraction:** Use regex + ML to pull "Yamaha YAS-52", "Bach 180S37", etc. from title/description

**Tier mapping:**
- **Student:** Yamaha YAS-23, YCL-255, YTR-1310, YEP-201
- **Intermediate:** Yamaha YAS-52, YCL-450, YTR-3335, YEP-321, Selmer Paris student models
- **Pro:** Yamaha YAS-62, YEP-621, YTR-5335, Besson 3-4 valve euphs, Bach/Conn/Holton doubles, Selmer Paris YAS-875

**Condition buckets:**
- `Excellent` → Plays beautifully, minimal wear → Resale ~95% of guide price
- `Good` → Light wear, minor issues, plays well → ~75-85% of guide
- `Fair` → Cosmetic wear, some service needed, playable → ~60-70% of guide
- `Project` → Needs significant work, may not play → ~30-50% of guide, or skip entirely

### Market Value Estimation

**Data sources:**
1. **eBay Sold listings** (last 90 days, same model + finish)
2. **Reverb.com price guide** (instrument-specific, multi-condition)
3. **Pawn shop comps** (in-market reference prices)
4. **Internal watchlist history** (your past purchase prices)

**Calculation:**
```
market_value = (recent_sales_average) × (condition_multiplier) × (finish_premium)

finish_premium:
  - Silver-plate: 1.15 to 1.30 (15-30% above guide for collectors)
  - Lacquer: 1.0 (baseline)
  - Nickel: 0.85 to 0.95 (discount vs. silver)
```

**Example:**
- Yamaha YAS-62 guide price: $500
- Last 3 eBay sales (silver): $580, $620, $600 → avg $600
- Estimated resale (fair condition, silver): $600 × 0.70 condition × 1.20 silver premium = **$504**

---

## Profit Floor Logic

### Yellow Brass: $150 Minimum

If finish is lacquered (yellow brass) and tier is not silver-plated pro:
```
projected_profit = estimated_resale - (asking_price + repair_cost)

if projected_profit >= $150.00:
    alert = true  (PRIORITY_2_YELLOW_BRASS_PRO)
else:
    alert = false OR visible_low_priority (if config.keep_lacquered_visible)
```

### Silver-Plate: Relaxed Floor

If finish is silver-plate AND tier is intermediate or pro:
```
alert = true  (PRIORITY_1_SILVER)
# Profit floor is secondary; aesthetic/collector value is primary driver
# Only suppress if estimated_resale < asking_price (obvious overprice)
```

### Profit Calculation Detail

```
repair_cost = config.estimated_repair_cost (default $75)
# Assumes: chem clean, pad check, minor spring/cork fixes
# For "project" instruments needing major work, estimate manually from descriptions

projected_profit = (estimated_resale) - (asking_price + repair_cost)
margin_pct = (projected_profit / asking_price) × 100

# Examples:
# Asking $425, Est. Resale $650:
#   Profit = $650 - $425 - $75 = $150 (exactly at floor)
#   Margin = ($150 / $425) × 100 = 35.3%

# Asking $180, Est. Resale $450:
#   Profit = $450 - $180 - $75 = $195 (well above floor)
#   Margin = ($195 / $180) × 100 = 108%
```

---

## Scraping Strategy

### Target Site Patterns

**Auction Ninja** (auctionninja.com)
- Pattern: `https://auctionninja.com/clearinghouseestatesales/product/{slug}`
- Selector for title: `h1.product-title`
- Selector for price: `span.price-value`
- Selector for description: `div.product-details`
- Image gallery: `div.carousel img[src]`

**AAR Auctions** (aarauctions.com)
- Pattern: `https://aarauctions.com/lot/{lot-id}`
- Selector for title: `h2.lot-title`
- Selector for price: `span.estimate-high` or `span.realized-price`
- Selector for description: `div.lot-description`
- Images: `img.lot-image[src]`

**Generic fallback** (Reverb, eBay, local pawn sites)
- Title: `<h1>`, `<h2>`, `[data-title]`
- Price: Regex search for `$[\d.,]+` in visible text
- Description: Largest text block in `<p>`, `<div class="description">`, etc.
- Images: All `<img src>` with "product" or "item" in src path

### Rate Limiting & Courtesy

- Add 2–5 second delay between requests (respect server load)
- Include descriptive User-Agent header
- Respect robots.txt; don't crawl at high frequency
- Cache results for 6 hours to avoid re-scraping same URL

---

## Notification Flow

### WhatsApp Alert Format

```
🚨 SLEEPER ALERT (PRIORITY_1_SILVER)!

Item: Yamaha YAS-62 Alto Saxophone, Silver-plated
Condition: Fair
Asking: $425.00 | Est. Resale: $650.00 | Est. Profit: $150.00

🔗 Link: https://auctionninja.com/listing/yamaha-yas-62-alto-sax-silver

⏰ Expires: Check listing for deadline
```

**Trigger conditions:**
- `alert_status` in [PRIORITY_1_SILVER, PRIORITY_2_YELLOW_BRASS_PRO]
- `whatsapp_enabled: true` in config
- Twilio credentials present (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, USER_WHATSAPP_NUMBER)

**Notification deduplication:**
- Track sent alerts by URL hash + asking_price
- Don't send duplicate alert for same item within 24 hours (even if price drops)
- Clear history weekly

---

## Configuration

```yaml
# config.yaml

preferences:
  # Finish preference (silver is 30% more valuable to collectors)
  preferred_finish: "Silver"
  
  # Show low-profit lacquered items for optional manual review?
  keep_lacquered_visible: true
  
  # Hard floor for yellow brass (net profit after repair, before shipping)
  min_net_profit_yellow_brass: 150.00
  
  # Assumed service cost baked into profit calculation
  # Typical: chem clean + pad check + minor repairs
  estimated_repair_cost: 75.00
  
  # Market value estimation buffer
  # Conservative: 0.75 (estimate 75% of guide)
  # Moderate: 0.85
  # Aggressive: 0.95
  resale_confidence: 0.85

# Scan targets (URLs or search result pages)
targets:
  pawn_and_auction_sites:
    - "https://auctionninja.com"
    - "https://aarauctions.com"
    - "https://reverb.com/marketplace?query=saxophone"
  
  search_queries:
    - site:ebay.com "alto saxophone" "Yamaha YAS"
    - site:facebook.com "band instrument" "estate sale"

# Notification settings
notifications:
  whatsapp_enabled: true
  twilio_sandbox_number: "whatsapp:+14155238886"
  # Actual user number loaded from env var USER_WHATSAPP_NUMBER

# Scraping behavior
scraping:
  timeout_seconds: 10
  delay_between_requests_seconds: 3
  cache_ttl_hours: 6
  max_retries: 2

# Scheduling (optional, for automated runs)
schedule:
  enabled: false
  cron_expression: "0 */6 * * *"  # Every 6 hours
  timezone: "America/New_York"
```

---

## Integration Points

### From Instrument Purchase Workflow

**When:** Scout encounters a potential arbitrage opportunity
**Call with:**
- URL of listing
- Optional: pre-parsed item data (if you've already scraped it)

**Use output to:**
- Decide whether to bid/make an offer
- Set bid ceiling based on projected profit
- Prioritize high-silver items for faster action
- Log deal metadata (source, estimated margin) for future reference

### Standalone: Manual Scan

**When:** User types "scan for deals" or runs scheduled job
**Call with:**
- List of auction site URLs or search queries
- Optional: date range filter (last 24 hours, last week)

**Output:**
- Summary of PRIORITY_1, PRIORITY_2, and visible low-priority items
- Rank by profit potential or profit margin
- WhatsApp alerts dispatched in real-time

### Feedback Loop: Actual vs. Estimated

**After you buy an instrument:**
- Record actual purchase price, repair cost, resale price
- Compare to estimated values
- Recalibrate market value heuristics quarterly
- Track which models/finishes actually flip best

---

## Error Handling

### Scraping Failure

```json
{
  "status": "scrape_error",
  "url": "https://example.com/listing-404",
  "error": "404 Not Found",
  "action": "Skip URL and continue to next target"
}
```

### Vision Analysis Failure (Can't Identify Instrument)

```json
{
  "status": "unidentifiable",
  "url": "https://example.com/mystery-lot",
  "reason": "No legible model text; images too blurry or obscured",
  "action": "Flag for manual review or skip"
}
```

### Missing Market Data (No Price Comps)

```json
{
  "status": "insufficient_market_data",
  "item": {
    "brand": "Obscure Student Saxophone",
    "model": "Unknown"
  },
  "estimated_resale": 0.00,
  "action": "Suppress; no confidence in value estimate. User can manually evaluate if interested."
}
```

### Network / Rate-Limited

```json
{
  "status": "rate_limited",
  "url": "https://auctionninja.com",
  "retry_after_seconds": 60,
  "action": "Pause and retry after delay; continue with other URLs"
}
```

---

## State & Persistence

**What to log/track:**

```json
{
  "scan_id": "2026-08-14-15-30-00-abc123",
  "scan_timestamp": "2026-08-14T15:30:00Z",
  "targets_scanned": 3,
  "items_found": 12,
  "alerts_sent": 3,
  "high_confidence_alerts": [
    {
      "url": "...",
      "title": "Yamaha YAS-62 Silver",
      "alert_status": "PRIORITY_1_SILVER",
      "projected_profit": 150.00
    }
  ],
  "scan_duration_seconds": 45
}
```

**Persistence options:**
- CSV log: `arbitrage_scan_log.csv` (append each scan result)
- SQLite: `arbitrage.db` (queryable history, trend analysis)
- Google Sheets: Link to form responses (shareable, visual)

---

## Example Workflow

```
User: "Scan for deals"

System: "Scanning 3 target sites + Reverb search..."

[15:32:05] Scraping auctionninja.com... Found 8 items
[15:32:18] Scraping aarauctions.com... Found 4 items
[15:32:31] Searching Reverb... Found 12 items

Analyzing 24 total items for market value + profit...

PRIORITY_1_SILVER ALERTS (3):
✅ Yamaha YAS-62 Alto Sax, Silver, Fair condition
   Asking: $425 | Est. Resale: $650 | Profit: $150
   Link: https://auctionninja.com/listing/yas-62-silver

✅ Yamaha YEP-621 Euphonium, Silver, Good condition
   Asking: $1,200 | Est. Resale: $1,850 | Profit: $575
   Link: https://aarauctions.com/lot/yep-621-euph

✅ Besson 3V Eupho, Silver, Fair condition
   Asking: $800 | Est. Resale: $1,150 | Profit: $275
   Link: https://reverb.com/item/besson-3v-comp

PRIORITY_2_YELLOW_BRASS_PRO ALERTS (2):
⚠️  Yamaha YTR-5335 Trumpet, Lacquered, Good condition
   Asking: $180 | Est. Resale: $450 | Profit: $195
   Link: https://pawnshop-example.com/trumpet-001

...

[WhatsApp notifications sent to +1-XXX-XXX-XXXX]

Scan complete. 5 alerts. Next scan in 6 hours.
"
```

---

## Testing Scenarios

1. **Silver-plate, pro tier, good profit** → PRIORITY_1 alert
2. **Lacquered, pro tier, $200+ profit** → PRIORITY_2 alert
3. **Lacquered, intermediate, $80 profit** → Visible low-priority (or suppressed)
4. **Unknown brand, no price comps** → Suppressed (insufficient data)
5. **Student instrument, overpriced** → Suppressed (negative profit)
6. **Price below estimated resale + repair** → PRIORITY_1 (deep discount flag)
7. **Multi-item lot, mixed instruments** → Evaluate each separately or flag as ambiguous

---

## Future Enhancements

- **Image ML classification** — Use Claude Vision to auto-detect brand/model/finish from photos
- **Historical price tracking** — Watch auction sites over time; alert on price drops
- **Shipping cost integration** — Factor UPS/FedEx estimates by size + destination
- **Geographic filtering** — Prioritize local auctions (no shipping) vs. far-away deals
- **Offer automation** — Auto-bid or make standing offers on high-confidence targets
- **Seasonal adjustments** — Silver demand spikes before school year; adjust premiums
- **Comparative shopping** — Cross-reference same item on Reverb vs. eBay vs. local
- **Trend analysis** — Which models flip fastest? Highest margins? Report quarterly

---

## Dependencies & Tech Stack

- **requests** — HTTP scraping
- **beautifulsoup4** — HTML parsing
- **selenium** (optional) — JavaScript-heavy sites (Reverb, modern eBay)
- **twilio** — WhatsApp messaging
- **pyyaml** — Config loading
- **pandas** (optional) — Data logging + analysis
- **python-dotenv** — Environment variable loading

---

## Security Notes

- Store Twilio credentials in environment variables, never in config.yaml
- Use a dedicated Twilio Sandbox for testing; upgrade to production number for real alerts
- Respect terms of service on target sites (don't overload servers)
- Log all alerts for compliance/audit trail
