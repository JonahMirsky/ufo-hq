// Pure utility functions and constants — safe to import from client components.

export const AGENCY_COLORS: Record<string, string> = {
  DoW: "var(--amber)",
  NASA: "var(--cyan)",
  FBI: "var(--status-anomaly)",
  DoS: "var(--status-resolved)",
  CIA: "#A88FE0",
  DoE: "#E89F47",
  NRO: "#7AC0E0",
  Other: "var(--fg-muted)",
};

export function shortId(id: string): string {
  // dow-uap-d19-mission-report-syria-february-21-2023 → DOW-D19
  const parts = id.split("-");
  const head = parts[0]?.toUpperCase() ?? "DOC";
  const numeric = parts.find((p) => /^(d|pr)\d+/i.test(p))?.toUpperCase();
  if (numeric) return `${head}-${numeric}`;
  return id.slice(0, 12).toUpperCase();
}

export function fmtCount(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}

// ISO 3166-1 alpha-2 → display name. Only the codes that actually appear in
// the corpus need to be here; unknown codes fall back to the code itself.
const COUNTRY_NAMES: Record<string, string> = {
  US: "United States",
  FR: "France",
  SY: "Syria",
  DE: "Germany",
  IR: "Iran",
  CA: "Canada",
  PG: "Papua New Guinea",
  IQ: "Iraq",
  FI: "Finland",
  GB: "United Kingdom",
  NL: "Netherlands",
  SE: "Sweden",
  CO: "Colombia",
  MX: "Mexico",
  KZ: "Kazakhstan",
  GR: "Greece",
  AE: "United Arab Emirates",
  DJ: "Djibouti",
  IL: "Israel",
  JO: "Jordan",
  SA: "Saudi Arabia",
  TR: "Turkey",
  RU: "Russia",
  CN: "China",
  JP: "Japan",
  KR: "South Korea",
  IN: "India",
  AU: "Australia",
  BR: "Brazil",
  AR: "Argentina",
  ES: "Spain",
  IT: "Italy",
  PL: "Poland",
};

export function countryName(code: string | null | undefined): string {
  if (!code) return "Unknown";
  return COUNTRY_NAMES[code.toUpperCase()] ?? code.toUpperCase();
}

const DOCTYPE_LABELS: Record<string, string> = {
  case_file: "Case file",
  MISREP: "Mission report",
  range_fouler_debrief: "Range fouler",
  transcript: "Transcript",
  memo: "Memo",
  cable: "Cable",
  report: "Report",
  email: "Email",
  sketch: "Sketch",
  slide_deck: "Slide deck",
  briefing: "Briefing",
  statement: "Statement",
  other: "Other",
};

export function doctypeLabel(t: string | null | undefined): string {
  if (!t) return "—";
  return DOCTYPE_LABELS[t] ?? t.replace(/_/g, " ");
}

export function evidenceLabel(e: string): string {
  return e.replace(/_/g, " ");
}

export function isOcrPending(summary: string | undefined | null): boolean {
  if (!summary) return false;
  return /\bOCR pending\b|heavily image-based scan/i.test(summary);
}

export function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso.slice(0, 10);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}
