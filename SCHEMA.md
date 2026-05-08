# UFO HQ — extraction schema v2 (spec-aligned)

This schema mirrors the UFO-HQ build spec's Postgres tables (`documents` and
`sightings`) so output JSON drops directly into the dashboard or, later,
into Supabase with no field renaming.

Each PDF in `reports/` produces one JSON file in `extracted/<doc_id>.json`.
The JSON contains a `document` object and a `sightings` array. The
orchestrator (`build_records.py`) flattens these into `public/data/documents.json`
and `public/data/sightings.json`.

## File structure

```json
{
  "document": { /* see Document below */ },
  "sightings": [ /* zero or more Sighting objects */ ]
}
```

## Document — one per PDF

```json
{
  "id": "dow-uap-d19-mission-report-syria-february-21-2023",
  "source": "DoW-PURSUE",
  "external_id": "MDR-25-0094",
  "title": "USCENTCOM Mission Report — Syria, 21 February 2023",
  "agency": "DoW",
  "document_type": "MISREP",
  "published_at": "2026-05-08",
  "date_authored": "2023-02-21",
  "lag_years": 2.7,
  "classification_at_creation": "secret",
  "classification_caveats": ["NOFORN"],
  "redaction_pct": 35,
  "page_count": 10,
  "pdf_url": "/reports/dow-uap-d19-mission-report-syria-february-21-2023.pdf",
  "summary": "1–3 sentence factual summary.",
  "key_findings": [
    "F-15E flight observed 3 white objects at FL240 near Shaddadi, IR-significant, no radar return.",
    "Same flight observed possible balloon at FL210; WSV produced.",
    "Three minutes of MFT radar jamming on APG-82 attributed to suspected Turkish X-band jammer."
  ],
  "incident_refs": [
    "dow-uap-d19-mission-report-syria-february-21-2023#0",
    "dow-uap-d19-mission-report-syria-february-21-2023#1"
  ],
  "person_refs": [],
  "unit_refs": ["389 EFS", "332 AEW"],
  "agency_refs": ["USCENTCOM", "AFCENT", "AARO"],
  "operation_refs": ["OPERATION INHERENT RESOLVE"],
  "platform_refs": ["F-15E"],
  "location_refs": ["Shaddadi, Syria", "Muwaffaq Salti AB, Jordan"],
  "declassified_date": "2025-10-08",
  "declassified_by": "MG Richard A. Harrison, USCENTCOM Chief of Staff",
  "approved_for_release_to": "AARO",
  "redaction_codes": ["1.4a", "1.4g", "(b)(3)", "(b)(6)", "3.5c"],
  "notable_quotes": [
    "OBS 3X POSS UAP IVO SHADDADI AT FL240. WSV PRODUCED. NFTR."
  ]
}
```

### Document field rules

| Field | Type | Rules |
|---|---|---|
| `id` | string | filename minus `.pdf`, lowercase |
| `source` | enum | always `"DoW-PURSUE"` for this corpus |
| `external_id` | string\|null | doc's own ID — MDR number, MSGID, FBI case ref, etc. |
| `agency` | enum | `DoW`, `FBI`, `NASA`, `DoS`, `CIA`, `DoE`, `NRO`, `Other` |
| `document_type` | enum | `MISREP`, `range_fouler_debrief`, `cable`, `case_file`, `transcript`, `email`, `statement`, `sketch`, `slide_deck`, `report`, `memo`, `briefing`, `other` |
| `published_at` | date | when DoD released it (CSV `Release Date` field, default `2026-05-08`) |
| `date_authored` | date\|null | when the doc was originally written / mission flown |
| `lag_years` | number\|null | (published_at − date_authored) in years; `null` if either is null |
| `classification_at_creation` | enum | `unclassified`, `confidential`, `secret`, `top_secret`, `ts_sci` |
| `classification_caveats` | string[] | `NOFORN`, `REL TO USA FVEY`, `LIMDIS`, `SI`, `TK`, etc. |
| `redaction_pct` | int 0–100 | rough estimate from how much of the visible text/page area is blacked out |
| `pdf_url` | string | always `/reports/<filename>` |
| `summary` | string | 1–3 sentences, factual |
| `key_findings` | string[] | 3–8 short bullets of operationally important facts; this is what the dashboard surfaces |
| `incident_refs` | string[] | IDs of sightings extracted from this doc (`<doc_id>#<index>`) |
| `*_refs` arrays | string[] | named entities in the doc; deduplicate, keep proper-noun form |
| `redaction_codes` | string[] | exemption codes visible in stamps/banners |
| `notable_quotes` | string[] | 1–3 short verbatim hits, each <30 words |

## Sighting — zero or more per PDF

A sighting is an **observation of an aerial object**, anomalous or not.
Non-sighting events (EMI, photographic references without observation,
narrative snippets) go into `key_findings`, not into `sightings`.

```json
{
  "id": "dow-uap-d19-mission-report-syria-february-21-2023#0",
  "doc_id": "dow-uap-d19-mission-report-syria-february-21-2023",
  "source": "DoW-PURSUE",
  "occurred_at": "2023-02-21T00:25:00Z",
  "reported_at": "2026-05-08",
  "location_text": "vicinity Shaddadi, Syria",
  "country_code": "SY",
  "lat": null,
  "lng": null,
  "duration_seconds": null,
  "shape": "sphere",
  "shape_raw": "two white objects, IR significant, three total",
  "size_estimate_m": null,
  "speed_mph": null,
  "altitude_ft": 24000,
  "color": "white",
  "witness_count": 2,
  "witness_role": "USAF aircrew (F-15E)",
  "is_aviator": true,
  "near_military_mi": null,
  "near_nuclear_mi": null,
  "maneuver_tags": [],
  "evidence_types": ["visual", "infrared"],
  "media_captured": ["WSV"],
  "has_media": true,
  "summary": "F-15E aircrew observed 3 white objects at FL240 near Shaddadi. IR-significant, no radar returns, WSV captured. Aircrew at FL270 in CAP. NFTR.",
  "classification": "unresolved",
  "resolution_category": null,
  "weather": "cloudy",
  "outcome": "NFTR"
}
```

### Sighting field rules

| Field | Type | Rules |
|---|---|---|
| `id` | string | `<doc_id>#<index>`, index starts at 0 |
| `occurred_at` | timestamp\|null | ISO Zulu if known precisely; date-only with `T00:00:00Z` if just a date |
| `country_code` | ISO 3166-1 alpha-2 | `US`, `SY`, `IQ`, etc. `null` if unknown / international waters |
| `lat`, `lng` | number\|null | only if explicitly stated. Coords are usually redacted — leave null |
| `shape` | enum | normalize to one of: `disk`, `sphere`, `orb`, `tic-tac`, `cylinder`, `triangle`, `cube`, `rectangle`, `cigar`, `boomerang`, `diamond`, `light`, `formation`, `unknown`. If multiple objects of different shapes, use the most prominent and note in `shape_raw`. |
| `shape_raw` | string | the doc's literal description of the object(s); preserve verbatim |
| `size_estimate_m` | number\|null | best estimate in meters; only if the doc gives a size |
| `speed_mph` | number\|null | convert from knots/Mach if needed (1 kt = 1.151 mph; Mach 1 ≈ 767 mph at sea level) |
| `altitude_ft` | number\|null | flight levels: FL240 → 24000. Only the OBJECT's altitude, not the observer's |
| `color` | string\|null | dominant color; can be a list separated by `/` if multi-color |
| `witness_count` | int\|null | best estimate; for aircrew assume 2 per single-seat fighter? No — only count what's in the doc |
| `witness_role` | string | role label, never names: e.g. `USAF aircrew (F-15E)`, `civilian observer`, `naval aviator (F/A-18F)`, `radar operator`, `FAA controller` |
| `is_aviator` | boolean | true if any witness is an aircrew member, pilot, or aviator (military or civilian) |
| `near_military_mi` | number\|null | distance to nearest military asset/installation if mentioned |
| `near_nuclear_mi` | number\|null | distance to nearest nuclear facility if mentioned |
| `maneuver_tags` | string[] | normalize from these: `hovering`, `instantaneous_acceleration`, `right_angle_turns`, `trans_medium`, `silent`, `formation_flight`, `stationary`, `pulsing`, `flaring`, `swarm_behavior`, `disappearance` |
| `evidence_types` | string[] | subset of: `visual`, `radar`, `infrared`, `photographic`, `video`, `audio`, `electronic_signature`, `physical_trace` |
| `classification` | enum | `unresolved`, `identified`, `anomalous`. Default `unresolved` for any UAP without resolution. `identified` if the doc resolves to balloon/satellite/aircraft. `anomalous` reserved for cases the doc itself flags as non-conventional. |
| `resolution_category` | string\|null | `balloon`, `satellite`, `aircraft`, `bird`, `lens_flare`, `ice_crystal`, etc. — only when `classification == "identified"` |

### Defaults to apply

- `is_aviator = true` for any DoW MISREP, range_fouler_debrief, or NASA transcript involving pilots/astronauts
- `evidence_types` always includes `"visual"` if anyone saw it; add `"radar"` if radar contact mentioned, `"infrared"` if IR/FLIR mentioned, `"video"` if video/WSV/TGT pod recording, `"photographic"` if photos
- `has_media` = true if `media_captured` is non-empty
- For DoW PURSUE corpus: `published_at = "2026-05-08"` unless the doc itself states otherwise

### Hard rules

- **Never fabricate.** If absent, use `null`. Especially: coordinates, names, exact times.
- **Use the doc's words for `shape_raw`** — but normalize `shape` to the enum.
- **One sighting per object encounter.** A flight that observes 3 UAP at 0025Z then a balloon at 0135Z = 2 sightings. 10 orb sightings across one evening = 10 sightings.
- **Names of individuals are typically redacted.** Capture role/rank in `witness_role`. Never invent names.

## Empty / unreadable documents

If a PDF can't be extracted (e.g. fully-redacted scan), still emit the JSON
with the document object filled as best as possible from filename + CSV
metadata, and `sightings: []`. Set `summary: "[OCR pending — scanned PDF]"`
so the dashboard knows.
