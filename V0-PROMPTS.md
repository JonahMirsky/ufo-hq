# UFO HQ — v0 Build Prompts

Copy-paste prompts for v0.dev to generate each page against real data.

**Workflow:**
1. Open v0.dev, create a new project. Sync to `JonahMirsky/ufo-hq`.
2. v0 sees this repo's `public/data/*.json`, `app/globals.css`, and design tokens.
3. For each page below, paste the prompt into v0 and let it generate.
4. Iterate. v0 produces Next.js + Tailwind + shadcn/ui out of the box.

**Stack constraint v0 must respect:**
- No paid APIs (no Mapbox, no OpenAI, no Anthropic, no Upstash, no Sentry).
- Use `fetch('/data/<file>.json')` to load data — these are static JSON in `public/data/`.
- Use MapLibre + OpenStreetMap tiles for any maps. No Mapbox token.
- Use Fuse.js for search if needed. No semantic embeddings.
- Vercel hobby tier for hosting.

---

## Shared design context (paste before each page prompt)

```
You are building UFO-HQ, a public-facing UAP intelligence dashboard.

Aesthetic: Interstellar × Arrival × NASA Mission Control. Restraint, negative space, monospaced confidence. Dark backgrounds, warm amber accent (#E8B547), cool cyan accent (#6BC2D9). Never pure black or pure white. No glassmorphism. No bouncy springs. All animations are slow exhales (cubic-bezier(0.16, 1, 0.3, 1)).

Typography: Space Grotesk (display + KPI numbers), Inter (body), Geist Mono (data, IDs, timestamps), Cormorant Garamond italic (introspective pull-quotes — used rarely).

Design tokens are in app/globals.css. Use CSS variables: --bg-void, --bg-panel, --bg-elevated, --fg-primary, --fg-secondary, --fg-muted, --amber, --cyan, --status-anomaly, --status-resolved.

Charts: Recharts default + D3 for custom (calendar heatmap, polar clock, force network, UMAP). All chart strokes 1.5px. Amber for primary data, cyan for annotations and secondary. Mono 9px axis labels with 0.06em letter-spacing.

The .panel CSS class is the primary container — every chart, every block of data lives inside one. Panels have:
- 1px subtle inner top highlight
- 4 corner brackets (8px) — amber, opacity 0.4 default, 0.7 on hover
- A header rail with a mono uppercase ID code (like "TS-02.1") and Space Grotesk title
- A footer telemetry strip with a pulsing LED + mono caption

Numbers always use tabular-nums and right-align. Include subtle grain overlay (already wired via globals.css).

Editorial tone: This is journalism, not advocacy. Footer includes the disclaimer: "UFO-HQ aggregates publicly available reports. Inclusion is not endorsement of authenticity."
```

---

## Page 1: `/` Landing

```
Build app/page.tsx — the UFO-HQ landing page.

Layout:
- Full-viewport hero, vertically centered.
- Eyebrow chip top-center, mono uppercase 11px, letter-spacing 0.32em: "UFO-HQ"
- H1 in Space Grotesk 80px (responsive: 56px tablet, 40px mobile): "An archive of the unresolved."
- Subtitle in Cormorant Garamond italic 32px, max-width 720px: "Every document the United States government released about UAP in October 2025."
- Single-line ticker below in mono uppercase 11px, letter-spacing 0.22em, color var(--fg-muted): "{TM_02_total_documents} DOCUMENTS · {TM_01_total_sightings} SIGHTINGS · 1 SOURCE · {TM_03_date_range}"  ← values from /data/metrics.json (headline section)
- Below ticker, a row of two buttons:
  - Primary amber: "Open Console" → /intel
  - Ghost: "Browse Reports" → /reports

Background: the four-layer background (void + grid + amber radial + grain) is already in globals.css — let it show through. Do NOT add any other background. No globe in v1.

Below the hero (after 100vh), a quiet stat band: 9-column grid (3-col tablet, 2-col mobile) of KPI tiles populated from /data/metrics.json headline values. Each tile uses the .kpi CSS class. Map the metric ids:
- TM_02_total_documents → "DOCUMENTS"
- TM_01_total_sightings → "SIGHTINGS"
- TM_02_total_pages → "PAGES"
- TM_03_years_covered → "YEARS COVERED"
- TM_04_unresolved_pct → "UNRESOLVED" (append %)
- TM_05_top_shape → "TOP SHAPE"
- TM_06_most_active_year → "PEAK YEAR"
- TM_07_active_hotspot → "TOP REGION" (use ISO country code)
- extra_aviator_pct → "AVIATOR WITNESSES" (append %)

Footer at the bottom: small mono 9px disclaimer + link to /about.

No autoplay anything. No audio. Slow fade-in stagger on hero text (60–100ms between children, 1200ms total). Keep it under 200kb of JS.
```

---

## Page 2: `/reports` Document Library

```
Build app/reports/page.tsx — the document library.

Layout:
- Header section with section number "01" (mono amber on amber-soft), title "DOCUMENTS" (Space Grotesk 32px), subtitle "Every PDF in the corpus, structured." (Cormorant italic 18px), and a filter row beneath.
- Filter row (mono uppercase 11px chips): All / DoW / FBI / NASA / DoS / Other. Active chip has amber border + amber-soft background.
- Search input below filters, pill-shaped, mono placeholder "filter by title, agency, location, year...". Use Fuse.js for fuzzy search on documents.
- Card grid: 3 columns desktop, 2 tablet, 1 mobile. Each card uses .panel CSS class.

Each card shows (data from /data/documents.json):
- Header rail: mono ID code "DOC-{id_short}" left, agency badge right (amber for DoW, cyan for NASA, red for FBI, etc — pick distinct hues from semantic palette).
- Title (Space Grotesk 18px, 2-line clamp).
- Mono row: published_at | page_count + "p" | redaction_pct + "% redacted"
- Summary (Inter 13px, 3-line clamp).
- Bottom: incident_refs.length + " sightings" badge, click hint "[ ENTER → ]" right.

Click a card → opens /reports/[id] reader view in same tab.

Reader view (app/reports/[id]/page.tsx):
- Two-column 60/40 split (single column on mobile).
- Left: PDF embed via <object> or <iframe src={pdf_url}>.
- Right: scrollable side panel with the document JSON laid out as a series of small panels:
  - Title + agency + classification banner at top
  - "Key findings" panel — bullet list from key_findings[]
  - "Sightings" panel — one mini-card per linked sighting (filter sightings.json by doc_id)
  - "Entities" panel — chips for each *_refs[] array (units, agencies, locations, operations, platforms, people)
  - "Notable quotes" panel — Cormorant italic 18px blockquotes with amber left border
  - "Provenance" panel — declassified_date, declassified_by, redaction_codes, source_url
- Sticky back-link top-left: "← BACK TO LIBRARY"

Both pages: server components fetch JSON via fs at build time (revalidate weekly). No external API calls.
```

---

## Page 3: `/intel` SIGNAL Dashboard (Sections 01 + 02 only for v1)

```
Build app/intel/page.tsx — the SIGNAL intelligence dashboard. v1 covers Sections 01 (Overview) and 02 (Temporal Trends) from the spec. Stub Sections 03–09 with "Coming soon" panels labeled with their IDs.

SECTION 01 — OVERVIEW
- Hero block (top of page):
  - Eyebrow chip: "[●] DOD UAP RELEASE · CORPUS v0.1 · 1947 — 2026 · STATIC"
  - H1 Space Grotesk 56px: "Intelligence on the unresolved."
  - Subtitle Cormorant italic 32px: "Every document, every sighting, every shape."
  - Lead paragraph Inter 16px max-width 660px: "UFO-HQ is an analytical archive of the U.S. Department of War's October 2025 UAP disclosure — every PDF, image, and audio record structured, searchable, and aggregable. We do not adjudicate; we surface."
  - Action row: ghost "Download Corpus (JSON)" + amber primary "Browse Reports" → /reports
- KPI band: 9 tiles in repeat(9, 1fr) grid (3-col tablet, 2-col mobile). Same values as the landing page band.

SECTION 02 — TEMPORAL TRENDS
- Section header: number "02 / TEMP / ORAL" (stacked mono labels), title "The shape of seven decades.", subtitle "When were these incidents recorded, and when did the public see them?"

- TS-02.1 (full width): Line chart of sightings per year. X-axis years from earliest occurred_at to latest, Y-axis count. Amber stroke 1.5px, amber gradient fill (rgba 30% → 0% top to bottom). Cyan dashed vertical annotations on years with > 2x median count, with cyan label above ("PEAK · 2023" etc). Data: /data/metrics.json by_year.

- TS-02.2 (2/3 width): Calendar heatmap. 12 months × N years grid (one row per year). Cell color ramp: bg-panel → border-strong → cyan-soft → cyan → amber. D3-driven. Pull from sightings.json grouped by month/year.

- TS-02.3 (1/3 width): Polar clock — 24-hour radial showing sighting distribution by hour of day (UTC). 24 wedges, peak hours brighter amber. Centered text shows peak hour ("PEAK · 02:00 UTC").

- TS-02.4 (full width): Lag histogram — incident → declassification lag. X-axis years (0–80), Y-axis count. Pull /data/metrics.json lag_distribution. Show median as cyan dashed vertical with label.

SECTIONS 03–09 (placeholder panels):
A 2-column grid. Each placeholder is a .panel with:
- Mono ID badge: "03 / GEO" through "09 / CC"
- Title in Space Grotesk 16px
- Subtitle "Awaiting corpus expansion." in mono 9px
- A muted "STATUS · QUEUED" footer
Sections: GEOGRAPHIC PATTERNS / PEOPLE & ORGANIZATIONS / OBJECT CHARACTERISTICS / SENSOR & EVIDENCE / DOCUMENT META-ANALYSIS / LANGUAGE & CONTENT / CROSS-CUTS

All panels share the .panel CSS class. Use Recharts for the line/bar charts and D3 for calendar + polar. Server component fetches JSON; client components for interactive bits.
```

---

## Page 4: `/about` Mission

```
Build app/about/page.tsx — the methodology and credibility page. Long-scroll editorial.

Single column, max-width 720px, generous line-height 1.7.

Sections (each gets a mono uppercase H2 with a 1px amber underline):

1. WHY UFO-HQ EXISTS
   "On October 2025, the U.S. Department of War released the largest single batch of UAP-related material in American history under President Trump's PURSUE directive. UFO-HQ structures that release into a public, queryable archive."

2. WHAT THE DATA IS
   List the war.gov PURSUE corpus: ~161 records across DoW, FBI, NASA, DoS, and one civilian witness statement.

3. WHAT THE DATA ISN'T
   "We do not include unverified eyewitness reports from civilian aggregators. We do not include alien-abduction narratives, cryptid material, or anything outside the federal disclosure scope. Inclusion of an item is not an assertion that the underlying claim is true."

4. METHODOLOGY
   - Source: scraped from war.gov/UFO/ in May 2026
   - Extraction: each PDF read by Claude (Anthropic), structured into JSON per a schema modeled on the AARO and ODNI report shapes
   - No machine guessing on coordinates, names, or dates that weren't explicitly stated
   - Code is open-source

5. SOURCES
   List with links: war.gov/UFO/, defense.gov releases, AARO public reporting tool

6. DISCLAIMER (Cormorant italic 24px pull):
   "UFO-HQ aggregates publicly available reports. Inclusion is not endorsement of authenticity."

7. BUILD
   Stack list, GitHub repo link.

Cormorant italic for any pulled callout. Mono for IDs and dates. Inter for body. No charts on this page.
```

---

## Notes for v0

- **Don't add Mapbox.** Use MapLibre GL with OSM tiles when /explore is built later. Style URL: `https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json`
- **Don't add OpenAI / Anthropic.** Search is Fuse.js client-side. Future semantic search via local sentence-transformers (Phase 3).
- **Don't add Sentry / PostHog** in v1.
- **All data is static JSON in `/public/data/`.** Server components can read these via `fs.readFile` at build time.
- **Vercel hobby tier** is the deploy target — no edge runtime needed, no cron jobs in v1.
- **PDFs live at `/reports/<filename>`** — but for v1 we may need to host the PDFs on a CDN since the repo would balloon to 2.3 GB. Plan: use Vercel Blob (free tier 1 GB) or Cloudflare R2 (free tier 10 GB). Update `pdf_url` accordingly when hosted.
