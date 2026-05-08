// Mirror of SCHEMA.md v2 — kept in sync with extraction output.

export type Agency = "DoW" | "FBI" | "NASA" | "DoS" | "CIA" | "DoE" | "NRO" | "Other";

export type DocumentType =
  | "MISREP"
  | "range_fouler_debrief"
  | "cable"
  | "case_file"
  | "transcript"
  | "email"
  | "statement"
  | "sketch"
  | "slide_deck"
  | "report"
  | "memo"
  | "briefing"
  | "other";

export type Classification = "unresolved" | "identified" | "anomalous";

export type Shape =
  | "disk"
  | "sphere"
  | "orb"
  | "tic-tac"
  | "cylinder"
  | "triangle"
  | "cube"
  | "rectangle"
  | "cigar"
  | "boomerang"
  | "diamond"
  | "light"
  | "formation"
  | "unknown";

export type EvidenceType =
  | "visual"
  | "radar"
  | "infrared"
  | "photographic"
  | "video"
  | "audio"
  | "electronic_signature"
  | "physical_trace";

export type ManeuverTag =
  | "hovering"
  | "instantaneous_acceleration"
  | "right_angle_turns"
  | "trans_medium"
  | "silent"
  | "formation_flight"
  | "stationary"
  | "pulsing"
  | "flaring"
  | "swarm_behavior"
  | "disappearance";

export interface UfoDocument {
  id: string;
  source: string;
  external_id: string | null;
  title: string;
  agency: Agency;
  document_type: DocumentType;
  published_at: string;
  date_authored: string | null;
  lag_years: number | null;
  classification_at_creation: string;
  classification_caveats: string[];
  redaction_pct: number;
  page_count: number;
  pdf_url: string;
  pdf_url_local?: string;
  summary: string;
  key_findings: string[];
  incident_refs: string[];
  person_refs: string[];
  unit_refs: string[];
  agency_refs?: string[];
  operation_refs?: string[];
  platform_refs?: string[];
  location_refs?: string[];
  declassified_date: string | null;
  declassified_by: string | null;
  approved_for_release_to: string | null;
  redaction_codes: string[];
  notable_quotes: string[];
}

export interface Sighting {
  id: string;
  doc_id: string;
  source: string;
  occurred_at: string | null;
  reported_at: string;
  location_text: string | null;
  country_code: string | null;
  lat: number | null;
  lng: number | null;
  duration_seconds: number | null;
  shape: Shape;
  shape_raw: string;
  size_estimate_m: number | null;
  speed_mph: number | null;
  altitude_ft: number | null;
  color: string | null;
  witness_count: number | null;
  witness_role: string;
  is_aviator: boolean;
  near_military_mi: number | null;
  near_nuclear_mi: number | null;
  maneuver_tags: ManeuverTag[];
  evidence_types: EvidenceType[];
  media_captured: string[];
  has_media: boolean;
  summary: string;
  classification: Classification;
  resolution_category: string | null;
  weather: string | null;
  outcome: string | null;
}

export interface Metrics {
  generated_at: string;
  headline: {
    TM_01_total_sightings: number;
    TM_02_total_documents: number;
    TM_02_total_pages: number;
    TM_03_date_range: string;
    TM_03_years_covered: number;
    TM_04_unresolved_pct: number;
    TM_05_top_shape: string | null;
    TM_05_top_shape_count: number;
    TM_06_most_active_year: number | null;
    TM_06_most_active_year_count: number;
    TM_07_active_hotspot: string | null;
    TM_07_active_hotspot_count: number;
    TM_08_top_speed_mph: number | null;
    TM_09_most_cited: string | null;
    TM_09_most_cited_count: number;
    extra_aviator_pct: number;
  };
  by_year: Record<string, number>;
  by_shape: Record<string, number>;
  by_country: Record<string, number>;
  by_agency_docs: Record<string, number>;
  by_doctype: Record<string, number>;
  by_evidence_type: Record<string, number>;
  lag_distribution: { median_years: number | null; max_years: number | null; count: number };
}
