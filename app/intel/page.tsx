import Link from "next/link";
import { TopNav } from "../../components/TopNav";
import { Panel } from "../../components/Panel";
import { SightingsByYear } from "../../components/SightingsByYear";
import { HorizontalBars } from "../../components/HorizontalBars";
import { loadDocuments, loadMetrics, loadSightings } from "../../lib/data";
import { countryName, doctypeLabel, evidenceLabel } from "../../lib/format";

export const metadata = {
  title: "Intel — UFO HQ",
  description: "Analytical dashboard over the war.gov PURSUE corpus.",
};

const KPI_TILES: {
  id: string;
  label: string;
  key: keyof import("../../lib/types").Metrics["headline"];
  tone?: "am" | "cy";
  suffix?: string;
}[] = [
  { id: "TM-01", label: "Total Sightings", key: "TM_01_total_sightings", tone: "cy" },
  { id: "TM-02", label: "Total Documents", key: "TM_02_total_documents", tone: "am" },
  { id: "TM-02b", label: "Total Pages", key: "TM_02_total_pages" },
  { id: "TM-03", label: "Years Covered", key: "TM_03_years_covered" },
  { id: "TM-04", label: "Unresolved", key: "TM_04_unresolved_pct", tone: "am", suffix: "%" },
  { id: "TM-05", label: "Top Shape", key: "TM_05_top_shape" },
  { id: "TM-06", label: "Most Active Year", key: "TM_06_most_active_year", tone: "cy" },
  { id: "TM-07", label: "Top Region", key: "TM_07_active_hotspot" },
  { id: "TM-09", label: "Most Cited", key: "TM_09_most_cited" },
];

const STUB_SECTIONS: { id: string; label: string; subtitle: string }[] = [
  { id: "GEO-03", label: "Geographic Patterns", subtitle: "Mapbox-free density layer + hotspots." },
  { id: "PPL-04", label: "People & Organizations", subtitle: "Top units, agencies, force-graph network." },
  { id: "OBJ-05", label: "Object Characteristics", subtitle: "Shape/size/speed/altitude distributions." },
  { id: "EV-06", label: "Sensor & Evidence", subtitle: "Radar/IR/visual/photographic mix." },
  { id: "DOC-07", label: "Document Meta-Analysis", subtitle: "Redaction matrix, classification stack, release timeline." },
  { id: "LNG-08", label: "Language & Content", subtitle: "Top n-grams, hedging-vs-definitive, topic clusters." },
  { id: "CC-09", label: "Cross-Cuts", subtitle: "Apollo/NASA · Naval Aviator · Nuclear · Foreign." },
];

export default async function IntelPage() {
  const metrics = await loadMetrics();
  const docs = await loadDocuments();
  const sightings = await loadSightings();
  const h = metrics.headline;

  const docTypeBars = Object.entries(metrics.by_doctype)
    .map(([raw, count]) => ({ label: doctypeLabel(raw), count }))
    .slice(0, 8);
  const evidenceBars = Object.entries(metrics.by_evidence_type)
    .map(([raw, count]) => ({ label: evidenceLabel(raw), count }))
    .slice(0, 8);
  const countryBars = Object.entries(metrics.by_country)
    .map(([code, count]) => ({ label: countryName(code), code, count }))
    .slice(0, 10);

  return (
    <>
      <TopNav />
      <div className="max-w-[1440px] mx-auto px-6 py-12">
        {/* Section 01 — OVERVIEW */}
        <section className="mb-16">
          <div
            className="font-mono mb-4 inline-flex items-center gap-3"
            style={{
              fontSize: "10px",
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "var(--amber)",
              background: "var(--amber-soft)",
              border: "1px solid var(--amber-glow)",
              padding: "4px 12px",
              borderRadius: "4px",
            }}
          >
            <span className="status-dot amber" />
            <span>DOD UAP RELEASE · CORPUS v0.1 · {h.TM_03_date_range} · STATIC</span>
          </div>

          <h1
            className="font-display"
            style={{
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              fontWeight: 300,
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              marginTop: "16px",
            }}
          >
            Intelligence on the unresolved.
          </h1>
          <p
            className="font-serif italic mt-4"
            style={{
              fontSize: "clamp(1.25rem, 2.4vw, 2rem)",
              color: "var(--fg-secondary)",
              maxWidth: "820px",
              lineHeight: 1.4,
            }}
          >
            Every document, every sighting, every shape.
          </p>
          <p
            className="mt-6"
            style={{ fontSize: "16px", maxWidth: "660px", color: "var(--fg-secondary)", lineHeight: 1.7 }}
          >
            UFO-HQ is an analytical archive of the U.S. Department of War's October
            2025 UAP disclosure — every PDF, image, and audio record structured,
            searchable, and aggregable. We do not adjudicate; we surface.
          </p>
          <div className="mt-8 flex gap-3 flex-wrap">
            <Link href="/reports" className="btn btn-primary">
              BROWSE REPORTS
            </Link>
            <a className="btn btn-ghost" href="/data/documents.json" target="_blank" rel="noopener">
              DOWNLOAD CORPUS (JSON)
            </a>
          </div>

          {/* KPI band */}
          <div
            className="grid gap-3 mt-12"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}
          >
            {KPI_TILES.map((tile) => {
              const raw = h[tile.key];
              const value =
                raw === null || raw === undefined || raw === ""
                  ? "—"
                  : `${raw}${tile.suffix ?? ""}`;
              return (
                <div className="kpi" key={tile.id}>
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="font-mono"
                      style={{
                        fontSize: "9px",
                        letterSpacing: "0.22em",
                        textTransform: "uppercase",
                        color: "var(--amber)",
                        background: "var(--amber-soft)",
                        border: "1px solid var(--amber-glow)",
                        padding: "2px 6px",
                        borderRadius: "3px",
                      }}
                    >
                      {tile.id}
                    </span>
                    <span
                      className="status-dot"
                      style={{
                        background: tile.tone === "cy" ? "var(--cyan)" : "var(--amber)",
                        boxShadow:
                          tile.tone === "cy" ? "0 0 6px var(--cyan-glow)" : "0 0 6px var(--amber-glow)",
                      }}
                    />
                  </div>
                  <div
                    className="font-mono mt-3"
                    style={{
                      fontSize: "10px",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "var(--fg-muted)",
                    }}
                  >
                    {tile.label}
                  </div>
                  <div
                    className={`kpi-num ${tile.tone ?? ""}`}
                    style={{ marginTop: "auto", paddingTop: "16px" }}
                  >
                    {value}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 02 — TEMPORAL */}
        <section className="mb-16">
          <SectionHead num="02" prefix="TEMP" title="The shape of seven decades." subtitle="When did these incidents occur, and when did the public see them?" />

          <div className="grid gap-4 mt-6">
            <Panel
              id="TS-02.1"
              title="Sightings per year"
              subtitle="By incident year · top 3 peak years annotated in cyan"
              footer={
                <>
                  <div className="flex items-center gap-2">
                    <span className="led am" />
                    <span>Annual series</span>
                  </div>
                  <span className="v am">{sightings.length} sightings</span>
                </>
              }
            >
              <SightingsByYear byYear={metrics.by_year} />
            </Panel>

            <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))" }}>
              <Panel
                id="TS-02.4"
                title="Disclosure lag"
                subtitle="Years between incident and public release"
                footer={
                  <>
                    <div className="flex items-center gap-2">
                      <span className="led cy" />
                      <span>{metrics.lag_distribution.count} of {docs.length} docs</span>
                    </div>
                    <span>Excludes docs without a date_authored</span>
                  </>
                }
              >
                {metrics.lag_distribution.count > 0 ? (
                  <LagSummary
                    median={metrics.lag_distribution.median_years}
                    max={metrics.lag_distribution.max_years}
                  />
                ) : (
                  <div
                    className="font-mono text-center py-6"
                    style={{ fontSize: "10px", letterSpacing: "0.22em", color: "var(--fg-muted)" }}
                  >
                    Awaiting more docs with both authored and release dates
                  </div>
                )}
              </Panel>

              <Panel
                id="TS-02.5"
                title="Documents by type"
                subtitle={`Of ${docs.length} structured records`}
                footer={
                  <>
                    <div className="flex items-center gap-2">
                      <span className="led am" />
                      <span>Top {docTypeBars.length}</span>
                    </div>
                    <span>{docs.length} total</span>
                  </>
                }
              >
                <HorizontalBars entries={docTypeBars} />
              </Panel>
            </div>
          </div>
        </section>

        {/* Section 03 (partial) — GEOGRAPHIC quick view */}
        <section className="mb-16">
          <SectionHead num="03" prefix="GEO" title="Where they happened." subtitle="Country distribution by sighting count. Map view pending the open-source engine." />
          <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))" }}>
            <Panel
              id="GEO-03.2"
              title="Top regions"
              subtitle={`Sightings with a known country (${countryBars.reduce((s, e) => s + e.count, 0)} of ${sightings.length})`}
              footer={
                <>
                  <div className="flex items-center gap-2">
                    <span className="led cy" />
                    <span>Top {countryBars.length} of {Object.keys(metrics.by_country).length}</span>
                  </div>
                  <span>{sightings.length - countryBars.reduce((s, e) => s + e.count, 0)} unlocated</span>
                </>
              }
            >
              <HorizontalBars
                entries={countryBars}
                accent="var(--cyan)"
                labelWidth="minmax(140px, 200px)"
              />
            </Panel>
            <Panel
              id="EV-06.1"
              title="Evidence types"
              subtitle="Per-sighting evidence (sightings can carry multiple)"
              footer={
                <>
                  <div className="flex items-center gap-2">
                    <span className="led am" />
                    <span>Schema-valid types only</span>
                  </div>
                  <span>{evidenceBars.reduce((s, e) => s + e.count, 0)} tags</span>
                </>
              }
            >
              <HorizontalBars
                entries={evidenceBars}
                accent="var(--amber)"
                labelWidth="minmax(140px, 180px)"
              />
            </Panel>
          </div>
        </section>

        {/* Stubs */}
        <section className="mb-16">
          <SectionHead num="04+" prefix="QUEUED" title="More awaits." subtitle="Sections expand as the corpus grows. Each sub-page below opens once the underlying data is rich enough to be honest." />
          <div className="grid gap-3 mt-6" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
            {STUB_SECTIONS.map((s) => (
              <div
                key={s.id}
                className="panel"
                style={{ opacity: 0.55, padding: "16px 18px" }}
              >
                <span className="br tl" />
                <span className="br tr" />
                <span className="br bl" />
                <span className="br br2" />
                <div className="flex items-center justify-between mb-2">
                  <span className="p-id">{s.id}</span>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: "9px",
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      color: "var(--fg-muted)",
                    }}
                  >
                    QUEUED
                  </span>
                </div>
                <div className="p-title">{s.label}</div>
                <div
                  className="font-mono mt-1"
                  style={{
                    fontSize: "10px",
                    color: "var(--fg-muted)",
                    letterSpacing: "0.04em",
                  }}
                >
                  {s.subtitle}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <footer
        className="border-t px-6 py-8"
        style={{ borderColor: "var(--border-faint)" }}
      >
        <div
          className="max-w-[1440px] mx-auto flex flex-wrap justify-between gap-4 font-mono"
          style={{
            color: "var(--fg-muted)",
            fontSize: "10px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          <span>UFO-HQ aggregates publicly available reports. Inclusion is not endorsement of authenticity.</span>
          <span>CORPUS v0.1 · GENERATED {metrics.generated_at.slice(0, 10)}</span>
        </div>
      </footer>
    </>
  );
}

function SectionHead({
  num,
  prefix,
  title,
  subtitle,
}: {
  num: string;
  prefix: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="grid gap-6 items-end" style={{ gridTemplateColumns: "auto 1fr" }}>
      <div
        className="font-mono"
        style={{
          fontSize: "10px",
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          color: "var(--fg-muted)",
          lineHeight: 1.4,
        }}
      >
        <div style={{ color: "var(--amber)", fontSize: "32px", lineHeight: 1 }}>{num}</div>
        <div style={{ marginTop: "4px" }}>{prefix}</div>
      </div>
      <div>
        <h2 className="font-display" style={{ fontSize: "28px", fontWeight: 500, letterSpacing: "-0.01em", lineHeight: 1.1 }}>
          {title}
        </h2>
        <p style={{ marginTop: "6px", color: "var(--fg-secondary)", fontSize: "14px", maxWidth: "640px" }}>
          {subtitle}
        </p>
      </div>
    </div>
  );
}

function LagSummary({
  median,
  max,
}: {
  median: number | null;
  max: number | null;
}) {
  return (
    <div className="grid grid-cols-2 gap-6">
      <Stat
        label="Median"
        value={median !== null ? `${median.toFixed(1)} yr` : "—"}
        tone="am"
        sub="half of docs took longer"
      />
      <Stat
        label="Maximum"
        value={max !== null ? `${max.toFixed(0)} yr` : "—"}
        tone="cy"
        sub="oldest case in the corpus"
      />
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
  sub,
}: {
  label: string;
  value: string;
  tone?: "am" | "cy";
  sub?: string;
}) {
  return (
    <div>
      <div
        className="font-mono"
        style={{
          fontSize: "9px",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "var(--fg-muted)",
        }}
      >
        {label}
      </div>
      <div className={`kpi-num ${tone ?? ""}`} style={{ fontSize: "32px", marginTop: "4px" }}>
        {value}
      </div>
      {sub && (
        <div
          style={{
            fontSize: "11px",
            color: "var(--fg-muted)",
            marginTop: "4px",
          }}
        >
          {sub}
        </div>
      )}
    </div>
  );
}
