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

export function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso.slice(0, 10);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}
