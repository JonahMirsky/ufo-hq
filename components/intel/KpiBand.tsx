import type { Metrics } from "../../lib/types";

const SHAPE_GLYPHS: Record<string, string> = {
  "tic-tac": '<ellipse cx="12" cy="12" rx="9" ry="3.5"/><line x1="3" y1="12" x2="21" y2="12"/>',
  triangle: '<polygon points="12,3 21,20 3,20"/>',
  orb: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/>',
  sphere: '<circle cx="12" cy="12" r="9"/>',
  disk: '<ellipse cx="12" cy="14" rx="9" ry="2.5"/><path d="M5 14 Q 12 6 19 14"/>',
  cigar: '<rect x="2" y="10" width="20" height="4" rx="2"/>',
  diamond: '<polygon points="12,2 22,12 12,22 2,12"/>',
  formation: '<circle cx="7" cy="8" r="2"/><circle cx="17" cy="8" r="2"/><circle cx="12" cy="17" r="2"/>',
  light: '<circle cx="12" cy="12" r="2.5" fill="currentColor"/><line x1="12" y1="3" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="21"/><line x1="3" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="21" y2="12"/>',
};

const SHAPE_TITLE: Record<string, string> = {
  "tic-tac": "Tic-Tac",
  triangle: "Triangle",
  orb: "Orb",
  sphere: "Sphere",
  disk: "Disk",
  cigar: "Cigar",
  diamond: "Diamond",
  formation: "Formation",
  light: "Light",
};

export function KpiBand({ metrics }: { metrics: Metrics }) {
  const h = metrics.headline;
  const totalShapes = Object.values(metrics.by_shape).reduce((s, n) => s + n, 0);
  const topShape = h.TM_05_top_shape ?? "unknown";
  const topShapePct =
    totalShapes > 0
      ? Math.round((h.TM_05_top_shape_count / totalShapes) * 100)
      : 0;

  // Sparkline for most active year — use last 12 known years
  const years = Object.entries(metrics.by_year).map(([y, n]) => ({
    y: parseInt(y, 10),
    n,
  }));
  const recentYears = years.slice(-12);
  const sparkMax = Math.max(1, ...recentYears.map((r) => r.n));

  // Top maneuver
  const topManeuver = Object.entries(metrics.by_maneuver_tag || {})[0];
  // Top operation
  const topOp = Object.entries(metrics.top_operations || {})[0];

  // Tile definitions — every value computed from live metrics
  const tiles: KpiTile[] = [
    {
      id: "TM-01",
      label: "Sightings",
      kind: "num",
      value: h.TM_01_total_sightings.toLocaleString(),
      sub: `${h.TM_04_unresolved_pct}% unresolved`,
      tone: "cy",
      subTone: "up",
    },
    {
      id: "TM-02",
      label: "Documents",
      kind: "num",
      value: h.TM_02_total_documents.toLocaleString(),
      sub: `${h.TM_02_total_pages.toLocaleString()} pages indexed`,
    },
    {
      id: "TM-03",
      label: "Date range",
      kind: "num",
      value: h.TM_03_date_range,
      sub: `${h.TM_03_years_covered} years covered`,
      smallNum: true,
    },
    {
      id: "TM-04",
      label: "Top shape",
      kind: "shape",
      shape: topShape,
      shapePct: topShapePct,
    },
    {
      id: "TM-05",
      label: "Most active yr",
      kind: "year",
      value: String(h.TM_06_most_active_year ?? "—"),
      sub: `${h.TM_06_most_active_year_count} sightings`,
      tone: "cy",
      sparkline: recentYears,
      sparkMax,
      hiYear: h.TM_06_most_active_year ?? null,
    },
    {
      id: "TM-06",
      label: "Top region",
      kind: "loc",
      value: countryName(h.TM_07_active_hotspot ?? null),
      sub: `${h.TM_07_active_hotspot_count} sightings`,
    },
    {
      id: "TM-07",
      label: "Aviator share",
      kind: "num",
      value: `${h.extra_aviator_pct}%`,
      sub: "military / civilian aviators",
      tone: "am",
    },
    {
      id: "TM-08",
      label: "Top maneuver",
      kind: "maneuver",
      value: topManeuver ? topManeuver[0].replace(/_/g, " ") : "—",
      sub: topManeuver ? `${topManeuver[1]} sightings` : "",
    },
    {
      id: "TM-09",
      label: "Top operation",
      kind: "op",
      value: topOp ? topOp[0] : "—",
      sub: topOp ? `${topOp[1]} documents` : "",
    },
  ];

  return (
    <div
      className="grid gap-3"
      style={{
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
      }}
    >
      {tiles.map((t) => (
        <KpiTile key={t.id} tile={t} />
      ))}
    </div>
  );
}

interface KpiTile {
  id: string;
  label: string;
  kind: "num" | "shape" | "year" | "loc" | "maneuver" | "op";
  value?: string;
  sub?: string;
  tone?: "cy" | "am" | "un";
  subTone?: "up" | "down";
  smallNum?: boolean;
  shape?: string;
  shapePct?: number;
  sparkline?: { y: number; n: number }[];
  sparkMax?: number;
  hiYear?: number | null;
}

function KpiTile({ tile }: { tile: KpiTile }) {
  return (
    <div className="kpi" style={{ minHeight: "168px" }}>
      <span className="br tl" />
      <span className="br tr" />
      <span className="br bl" />
      <span className="br br2" />
      <div
        className="flex justify-between items-start"
        style={{ marginBottom: "auto", gap: "8px" }}
      >
        <div
          className="font-mono"
          style={{
            fontSize: "8px",
            color: "var(--penumbra)",
            letterSpacing: "0.22em",
          }}
        >
          {tile.id}
        </div>
        <div
          style={{
            width: "5px",
            height: "5px",
            borderRadius: "50%",
            background: "var(--verified)",
            boxShadow: "0 0 4px var(--verified)",
            animation: "pulse 1.6s ease-in-out infinite",
            marginTop: "2px",
          }}
        />
      </div>
      <div
        className="font-mono"
        style={{
          fontSize: "9px",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "var(--plasma)",
          marginBottom: "6px",
          fontWeight: 500,
        }}
      >
        {tile.label}
      </div>

      {tile.kind === "shape" && tile.shape ? (
        <div className="flex items-center gap-3" style={{ marginTop: "auto" }}>
          <ShapeIconBox shape={tile.shape} />
          <div>
            <div
              className="font-serif"
              style={{ fontSize: "20px", fontWeight: 300, lineHeight: 1.05 }}
            >
              {SHAPE_TITLE[tile.shape] ?? tile.shape}
            </div>
            <div
              className="font-mono"
              style={{
                fontSize: "9px",
                color: "var(--moondust)",
                marginTop: "4px",
                letterSpacing: "0.04em",
              }}
            >
              {tile.shapePct}% of typed
            </div>
          </div>
        </div>
      ) : tile.kind === "year" && tile.sparkline ? (
        <>
          <div
            className={`kpi-num ${tile.tone ?? ""}`}
            style={{ fontSize: "30px" }}
          >
            {tile.value}
          </div>
          <div
            className="font-mono"
            style={{
              fontSize: "9px",
              color: "var(--moondust)",
              marginTop: "6px",
              letterSpacing: "0.04em",
            }}
          >
            {tile.sub}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: "1px",
              marginTop: "10px",
              height: "20px",
            }}
          >
            {tile.sparkline.map((p) => {
              const hv = (p.n / (tile.sparkMax ?? 1)) * 100;
              const isHi = tile.hiYear ? p.y === tile.hiYear : false;
              return (
                <span
                  key={p.y}
                  style={{
                    flex: 1,
                    background: "var(--plasma)",
                    opacity: isHi ? 1 : 0.4,
                    boxShadow: isHi ? "0 0 4px var(--plasma)" : "none",
                    height: `${Math.max(hv, 6)}%`,
                    borderRadius: "1px",
                  }}
                  title={`${p.y}: ${p.n}`}
                />
              );
            })}
          </div>
        </>
      ) : (
        <>
          <div
            className={`kpi-num ${tile.tone ?? ""}`}
            style={{
              fontSize: tile.smallNum
                ? "22px"
                : tile.kind === "loc" || tile.kind === "maneuver" || tile.kind === "op"
                ? "20px"
                : "32px",
              lineHeight: 1.1,
              wordBreak: "break-word",
            }}
          >
            {tile.value}
          </div>
          {tile.sub && (
            <div
              className="font-mono"
              style={{
                fontSize: "9px",
                color:
                  tile.subTone === "up"
                    ? "var(--verified)"
                    : tile.subTone === "down"
                    ? "var(--classified)"
                    : "var(--moondust)",
                marginTop: "6px",
                letterSpacing: "0.04em",
              }}
            >
              {tile.sub}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function ShapeIconBox({ shape }: { shape: string }) {
  const glyph = SHAPE_GLYPHS[shape] ?? '<circle cx="12" cy="12" r="9"/>';
  return (
    <div
      style={{
        width: "34px",
        height: "34px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid rgba(46, 224, 106, 0.25)",
        borderRadius: "6px",
        background: "rgba(46, 224, 106, 0.06)",
        flexShrink: 0,
      }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        style={{ stroke: "var(--plasma)", fill: "none", strokeWidth: 1 }}
        dangerouslySetInnerHTML={{ __html: glyph }}
      />
    </div>
  );
}

function countryName(code: string | null): string {
  const map: Record<string, string> = {
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
  };
  if (!code) return "—";
  return map[code.toUpperCase()] ?? code.toUpperCase();
}
