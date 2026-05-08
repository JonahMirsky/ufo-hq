import Link from "next/link";
import { TopNav } from "../../components/TopNav";
import { Panel } from "../../components/Panel";
import { SightingsByYear } from "../../components/SightingsByYear";
import { ShapePictogram } from "../../components/intel/ShapePictogram";
import { BarList } from "../../components/intel/BarList";
import { ColorStack } from "../../components/intel/ColorStack";
import { Histogram } from "../../components/intel/Histogram";
import { EvidenceDonut } from "../../components/intel/EvidenceDonut";
import { KpiBand } from "../../components/intel/KpiBand";
import { SectionHead } from "../../components/intel/SectionHead";
import { loadDocuments, loadMetrics, loadSightings } from "../../lib/data";
import { countryName, doctypeLabel } from "../../lib/format";

export const metadata = {
  title: "Intel — UFO HQ",
  description: "What 178 declassified sightings tell us about the unresolved.",
};

export default async function IntelPage() {
  const [docs, sightings, metrics] = await Promise.all([
    loadDocuments(),
    loadSightings(),
    loadMetrics(),
  ]);
  const h = metrics.headline;

  // Object characteristics — Section 02
  const shapeEntries = Object.entries(metrics.by_shape).map(([k, v]) => ({
    name: k,
    count: v,
  }));
  const totalTyped = shapeEntries.reduce((s, e) => s + e.count, 0);

  const colorEntries = Object.entries(metrics.by_color || {}).map(([k, v]) => ({
    label: k,
    count: v,
  }));

  const maneuverEntries = Object.entries(metrics.by_maneuver_tag || {})
    .slice(0, 12)
    .map(([k, v]) => ({ label: k.replace(/_/g, " "), count: v }));

  const altitudeEntries = Object.entries(metrics.altitude_histogram || {}).map(
    ([k, v]) => ({ label: k, count: v }),
  );

  // Geographic — Section 03
  const countryEntries = Object.entries(metrics.by_country)
    .map(([code, count]) => ({
      label: countryName(code),
      code,
      count,
    }))
    .slice(0, 10);
  const totalCountrySightings = countryEntries.reduce((s, e) => s + e.count, 0);

  const operationEntries = Object.entries(metrics.top_operations || {}).map(
    ([k, v]) => ({ label: k, count: v }),
  );

  const unitEntries = Object.entries(metrics.top_units || {}).map(([k, v]) => ({
    label: k,
    count: v,
  }));

  const locationEntries = Object.entries(metrics.top_locations || {}).map(
    ([k, v]) => ({ label: k, count: v }),
  );

  // Temporal — Section 04
  const decadeEntries = Object.entries(metrics.by_decade || {}).map(
    ([k, v]) => ({ label: k, count: v }),
  );

  // Evidence — Section 05
  const evidenceEntries = Object.entries(metrics.by_evidence_type)
    .map(([k, v]) => ({ label: k.replace(/_/g, " "), count: v }))
    .filter((e) => e.count > 0);
  const evidenceTotal = evidenceEntries.reduce((s, e) => s + e.count, 0);

  const witnessEntries = Object.entries(metrics.witness_histogram || {}).map(
    ([k, v]) => ({ label: k, count: v }),
  );

  const witnessSplit = metrics.witness_split as { aviator: number; civilian: number };
  const aviatorPct =
    witnessSplit && (witnessSplit.aviator + witnessSplit.civilian) > 0
      ? Math.round(
          (witnessSplit.aviator / (witnessSplit.aviator + witnessSplit.civilian)) * 100,
        )
      : 0;

  const mediaTypes = metrics.media_types || {};

  // Top sightings by altitude / speed — picked from raw data
  const topAltitudeSightings = [...sightings]
    .filter((s) => s.altitude_ft != null)
    .sort((a, b) => (b.altitude_ft || 0) - (a.altitude_ft || 0))
    .slice(0, 5);

  return (
    <>
      <TopNav />
      <main className="max-w-[1480px] mx-auto px-6 py-10">
        {/* HERO + KPI BAND */}
        <section className="mb-12 relative" style={{ overflow: "hidden" }}>
          <div className="hero-ring" aria-hidden />
          <div
            className="font-mono inline-flex items-center gap-3 mb-5"
            style={{
              fontSize: "10px",
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "var(--plasma)",
              background: "rgba(0, 217, 255, 0.08)",
              border: "1px solid rgba(0, 217, 255, 0.30)",
              padding: "6px 14px",
              borderRadius: "999px",
            }}
          >
            <span
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: "var(--classified)",
                boxShadow: "0 0 8px var(--classified)",
                animation: "pulse 1.5s ease-in-out infinite",
              }}
            />
            DoD UAP Release · Corpus v0.1 · {h.TM_03_date_range} · LIVE
          </div>

          <div className="flex justify-between items-end gap-6 flex-wrap mb-10">
            <div>
              <h1
                className="font-serif"
                style={{
                  fontSize: "clamp(2.5rem, 5vw, 4.25rem)",
                  fontWeight: 300,
                  lineHeight: 1.0,
                  letterSpacing: "-0.02em",
                  marginBottom: "16px",
                  maxWidth: "880px",
                  position: "relative",
                  zIndex: 2,
                }}
              >
                Intelligence on <span className="hero-em">the unresolved</span>.
              </h1>
              <p
                style={{
                  fontSize: "15px",
                  lineHeight: 1.7,
                  color: "var(--moondust)",
                  maxWidth: "640px",
                }}
              >
                {h.TM_01_total_sightings} declassified sightings, indexed by
                shape, altitude, witness, evidence and outcome. Every number
                computed live from {h.TM_02_total_documents} structured
                documents in the war.gov PURSUE corpus.
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Link href="/reports" className="btn btn-primary">
                <span>BROWSE REPORTS</span>
                <span className="btn-arrow" aria-hidden>→</span>
              </Link>
              <a
                className="btn btn-ghost"
                href="/data/sightings.json"
                target="_blank"
                rel="noopener"
              >
                <span>DOWNLOAD SIGHTINGS (JSON)</span>
                <span className="btn-arrow" aria-hidden>↓</span>
              </a>
            </div>
          </div>

          <KpiBand metrics={metrics} />
        </section>

        {/* SECTION 02 — OBJECT CHARACTERISTICS */}
        <section className="mb-16">
          <SectionHead
            num="02"
            sub="OBJECT CHARACTERISTICS"
            title="The shape of"
            titleEm="the unidentified"
            lede="Form, color, altitude, behavior. The irreducible physics of every encounter in the corpus."
          />

          <div className="mb-4">
            <Panel
              id="OBJ-02.1"
              title="Shape distribution"
              subtitle={`Glyph size proportional to count · n = ${totalTyped} typed sightings`}
              footer={
                <>
                  <div className="flex items-center gap-2">
                    <span className="led am" />
                    <span>{shapeEntries[0]?.name?.toUpperCase()} dominant</span>
                  </div>
                  <span>
                    n = <span className="v cy">{totalTyped}</span> · {shapeEntries.length} types
                  </span>
                </>
              }
            >
              <ShapePictogram entries={shapeEntries} total={totalTyped} />
            </Panel>
          </div>

          <div
            className="grid gap-4 mb-4"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))" }}
          >
            <Panel
              id="OBJ-02.2"
              title="Altitude distribution"
              subtitle="Reported object altitude · feet AGL"
              footer={
                <>
                  <div className="flex items-center gap-2">
                    <span className="led" />
                    <span>n = {altitudeEntries.reduce((s, e) => s + e.count, 0)}</span>
                  </div>
                  <span>
                    Max <span className="v am">{(metrics.altitude_max_ft ?? 0).toLocaleString()} ft</span>
                  </span>
                </>
              }
            >
              <Histogram
                entries={altitudeEntries}
                tone="cy"
                emphasizeMax
              />
            </Panel>

            <Panel
              id="OBJ-02.3"
              title="Reported color"
              subtitle="Dominant color in witness account"
              footer={
                <>
                  <div className="flex items-center gap-2">
                    <span className="led" />
                    <span>{colorEntries.length} bands</span>
                  </div>
                  <span>
                    {colorEntries[0]?.label} <span className="v">{colorEntries[0]?.count}</span>
                  </span>
                </>
              }
            >
              <ColorStack entries={colorEntries} />
              <BarList
                entries={colorEntries.slice(0, 6).map((e, i) => ({
                  label: e.label,
                  count: e.count,
                  rank: "·",
                  tone: i === 1 ? "am" : undefined,
                }))}
              />
            </Panel>
          </div>

          <Panel
            id="OBJ-02.4"
            title="Maneuver tags · ranked"
            subtitle="Behaviors observed · multi-tag enabled"
            footer={
              <>
                <div className="flex items-center gap-2">
                  <span className="led" />
                  <span>{maneuverEntries.length} behaviors</span>
                </div>
                <span>
                  Top <span className="v am">{maneuverEntries[0]?.label}</span> ·{" "}
                  <span className="v">{maneuverEntries[0]?.count}</span>
                </span>
              </>
            }
          >
            <div
              className="grid gap-6"
              style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}
            >
              <BarList
                entries={maneuverEntries.slice(0, 6).map((e, i) => ({
                  label: e.label,
                  count: e.count,
                  rank: String(i + 1).padStart(2, "0"),
                  tone: i === 1 ? "am" : undefined,
                }))}
              />
              <BarList
                entries={maneuverEntries.slice(6, 12).map((e, i) => ({
                  label: e.label,
                  count: e.count,
                  rank: String(i + 7).padStart(2, "0"),
                }))}
              />
            </div>
          </Panel>
        </section>

        {/* SECTION 03 — GEOGRAPHIC */}
        <section className="mb-16">
          <SectionHead
            num="03"
            sub="GEOGRAPHIC"
            title="Where the sky"
            titleEm="has whispered"
            lede="Country, theatre of operations, and the units that filed the reports."
          />
          <div
            className="grid gap-4 mb-4"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))" }}
          >
            <Panel
              id="GEO-03.1"
              title="Top countries"
              subtitle={`Sightings with a known country · ${totalCountrySightings} of ${sightings.length}`}
              footer={
                <>
                  <div className="flex items-center gap-2">
                    <span className="led cy" />
                    <span>Top {countryEntries.length} of {Object.keys(metrics.by_country).length}</span>
                  </div>
                  <span>
                    {sightings.length - totalCountrySightings} unlocated
                  </span>
                </>
              }
            >
              <BarList
                entries={countryEntries.map((e, i) => ({
                  label: e.label,
                  rank: String(i + 1).padStart(2, "0"),
                  count: e.count,
                  code: e.code,
                  tone: i === 1 ? "am" : undefined,
                }))}
              />
            </Panel>

            <Panel
              id="GEO-03.2"
              title="Top theatres / operations"
              subtitle="Operations referenced across documents"
              footer={
                <>
                  <div className="flex items-center gap-2">
                    <span className="led am" />
                    <span>{operationEntries.length} operations</span>
                  </div>
                  <span>
                    Top <span className="v am">{operationEntries[0]?.label}</span>
                  </span>
                </>
              }
            >
              <BarList
                entries={operationEntries.slice(0, 8).map((e, i) => ({
                  label: e.label,
                  rank: String(i + 1).padStart(2, "0"),
                  count: e.count,
                  tone: "am",
                }))}
              />
            </Panel>
          </div>

          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))" }}
          >
            <Panel
              id="GEO-03.3"
              title="Top filing units"
              subtitle="Squadrons / commands / installations"
              footer={
                <>
                  <div className="flex items-center gap-2">
                    <span className="led" />
                    <span>{Object.keys(metrics.top_units || {}).length} units</span>
                  </div>
                  <span>
                    Top <span className="v cy">{unitEntries[0]?.label}</span>
                  </span>
                </>
              }
            >
              <BarList
                entries={unitEntries.slice(0, 8).map((e, i) => ({
                  label: e.label,
                  rank: String(i + 1).padStart(2, "0"),
                  count: e.count,
                }))}
              />
            </Panel>

            <Panel
              id="GEO-03.4"
              title="Top specific locations"
              subtitle="Place-names referenced across documents"
              footer={
                <>
                  <div className="flex items-center gap-2">
                    <span className="led" />
                    <span>{Object.keys(metrics.top_locations || {}).length} hotspots</span>
                  </div>
                  <span>
                    Top <span className="v cy">{locationEntries[0]?.label}</span>
                  </span>
                </>
              }
            >
              <BarList
                entries={locationEntries.slice(0, 8).map((e, i) => ({
                  label: e.label,
                  rank: String(i + 1).padStart(2, "0"),
                  count: e.count,
                }))}
              />
            </Panel>
          </div>
        </section>

        {/* SECTION 04 — TEMPORAL */}
        <section className="mb-16">
          <SectionHead
            num="04"
            sub="TEMPORAL"
            title="The shape of"
            titleEm="seven decades"
            lede="When did the unresolved show up — and how long did it take to admit it?"
          />

          <div className="mb-4">
            <Panel
              id="TS-04.1"
              title="Sightings per year"
              subtitle="By incident year · top 3 peak years annotated"
              footer={
                <>
                  <div className="flex items-center gap-2">
                    <span className="led am" />
                    <span>Annual series</span>
                  </div>
                  <span>
                    n = <span className="v cy">{sightings.length}</span> · peak{" "}
                    <span className="v am">{h.TM_06_most_active_year}</span>
                  </span>
                </>
              }
            >
              <SightingsByYear byYear={metrics.by_year} />
            </Panel>
          </div>

          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))" }}
          >
            <Panel
              id="TS-04.2"
              title="Sightings by decade"
              subtitle="Aggregated counts · 1940s onward"
              footer={
                <>
                  <div className="flex items-center gap-2">
                    <span className="led" />
                    <span>{decadeEntries.length} decades</span>
                  </div>
                  <span>
                    Top <span className="v am">{decadeEntries.slice().sort((a, b) => b.count - a.count)[0]?.label}</span>
                  </span>
                </>
              }
            >
              <Histogram
                entries={decadeEntries}
                tone="am"
                emphasizeMax
              />
            </Panel>

            <Panel
              id="TS-04.3"
              title="Disclosure lag"
              subtitle="Years between incident and public release"
              footer={
                <>
                  <div className="flex items-center gap-2">
                    <span className="led cy" />
                    <span>{metrics.lag_distribution.count} of {docs.length} docs</span>
                  </div>
                  <span>
                    Median <span className="v am">{metrics.lag_distribution.median_years?.toFixed(1)} yr</span>
                  </span>
                </>
              }
            >
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div
                    className="font-mono mb-1"
                    style={{
                      fontSize: "9px",
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      color: "var(--penumbra)",
                    }}
                  >
                    Median lag
                  </div>
                  <div className="big-num">
                    <div className="v am">
                      {metrics.lag_distribution.median_years?.toFixed(1)}{" "}
                      <span style={{ fontSize: "20px", color: "var(--moondust)" }}>yr</span>
                    </div>
                    <div className="s">half of docs took longer</div>
                  </div>
                </div>
                <div>
                  <div
                    className="font-mono mb-1"
                    style={{
                      fontSize: "9px",
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      color: "var(--penumbra)",
                    }}
                  >
                    Maximum lag
                  </div>
                  <div className="big-num">
                    <div className="v cy">
                      {metrics.lag_distribution.max_years?.toFixed(0)}{" "}
                      <span style={{ fontSize: "20px", color: "var(--moondust)" }}>yr</span>
                    </div>
                    <div className="s">oldest case in corpus</div>
                  </div>
                </div>
              </div>
            </Panel>
          </div>
        </section>

        {/* SECTION 05 — WITNESSES & EVIDENCE */}
        <section className="mb-16">
          <SectionHead
            num="05"
            sub="WITNESSES & EVIDENCE"
            title="What kind of"
            titleEm="proof"
            lede="Who saw it, how many of them, and what survived as record."
          />

          <div
            className="grid gap-4 mb-4"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))" }}
          >
            <Panel
              id="EV-05.1"
              title="Evidence type breakdown"
              subtitle="Multi-sensor cases counted in each applicable category"
              footer={
                <>
                  <div className="flex items-center gap-2">
                    <span className="led" />
                    <span>{evidenceEntries.length} types</span>
                  </div>
                  <span>
                    {evidenceTotal} tags · {sightings.length} sightings
                  </span>
                </>
              }
            >
              <EvidenceDonut entries={evidenceEntries} total={sightings.length} />
            </Panel>

            <Panel
              id="EV-05.2"
              title="Witnesses per incident"
              subtitle="Multi-witness corroboration ↑"
              footer={
                <>
                  <div className="flex items-center gap-2">
                    <span className="led" />
                    <span>n = {sightings.length}</span>
                  </div>
                  <span>
                    Aviator share <span className="v cy">{aviatorPct}%</span>
                  </span>
                </>
              }
            >
              <Histogram entries={witnessEntries} tone="cy" emphasizeMax />
              <div
                className="grid grid-cols-2 gap-4"
                style={{
                  marginTop: "20px",
                  paddingTop: "16px",
                  borderTop: "1px solid var(--meridian)",
                }}
              >
                <div>
                  <div
                    className="font-mono mb-1"
                    style={{
                      fontSize: "9px",
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      color: "var(--penumbra)",
                    }}
                  >
                    Aviator
                  </div>
                  <div className="big-num">
                    <div className="v cy">
                      {witnessSplit?.aviator}
                      <span style={{ fontSize: "16px", color: "var(--moondust)" }}> ({aviatorPct}%)</span>
                    </div>
                    <div className="s">military / civilian aviators</div>
                  </div>
                </div>
                <div>
                  <div
                    className="font-mono mb-1"
                    style={{
                      fontSize: "9px",
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      color: "var(--penumbra)",
                    }}
                  >
                    Civilian / Other
                  </div>
                  <div className="big-num">
                    <div className="v am">
                      {witnessSplit?.civilian}
                      <span style={{ fontSize: "16px", color: "var(--moondust)" }}> ({100 - aviatorPct}%)</span>
                    </div>
                    <div className="s">archive subjects, ground observers</div>
                  </div>
                </div>
              </div>
            </Panel>
          </div>

          {/* Highest-altitude sightings list */}
          <Panel
            id="OBJ-05.5"
            title="Highest-altitude sightings"
            subtitle="Top reported altitudes from the corpus"
            footer={
              <>
                <div className="flex items-center gap-2">
                  <span className="led am" />
                  <span>Top {topAltitudeSightings.length}</span>
                </div>
                <span>
                  Range{" "}
                  <span className="v cy">
                    {topAltitudeSightings[topAltitudeSightings.length - 1]?.altitude_ft?.toLocaleString()}–
                    {topAltitudeSightings[0]?.altitude_ft?.toLocaleString()} ft
                  </span>
                </span>
              </>
            }
          >
            <BarList
              entries={topAltitudeSightings.map((s, i) => ({
                rank: String(i + 1).padStart(2, "0"),
                label: `${s.summary?.slice(0, 80)}${(s.summary?.length || 0) > 80 ? "…" : ""}`,
                count: s.altitude_ft || 0,
                tone: s.classification === "anomalous" ? "am" : undefined,
                href: `/reports/${s.doc_id}`,
              }))}
            />
          </Panel>
        </section>
      </main>

      <footer
        className="border-t px-6 py-8 mt-16"
        style={{ borderColor: "var(--meridian)" }}
      >
        <div
          className="max-w-[1480px] mx-auto flex flex-wrap justify-between gap-4 font-mono"
          style={{
            color: "var(--penumbra)",
            fontSize: "10px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          <span>UFO-HQ aggregates publicly available reports. Inclusion is not endorsement of authenticity.</span>
          <span>
            CORPUS v0.1 · GENERATED {metrics.generated_at.slice(0, 10)} · ALL FIGURES LIVE
          </span>
        </div>
      </footer>
    </>
  );
}
