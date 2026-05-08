import { TopNav } from "../components/TopNav";
import { loadMetrics } from "../lib/data";

const KPI_ORDER: { key: string; label: string; tone?: "am" | "cy"; suffix?: string }[] = [
  { key: "TM_02_total_documents", label: "Documents", tone: "am" },
  { key: "TM_01_total_sightings", label: "Sightings", tone: "cy" },
  { key: "TM_02_total_pages", label: "Pages" },
  { key: "TM_03_years_covered", label: "Years Covered" },
  { key: "TM_04_unresolved_pct", label: "Unresolved", tone: "am", suffix: "%" },
  { key: "TM_05_top_shape", label: "Top Shape" },
  { key: "TM_06_most_active_year", label: "Peak Year", tone: "cy" },
  { key: "TM_07_active_hotspot", label: "Top Region" },
  { key: "extra_aviator_pct", label: "Aviator Witnesses", suffix: "%" },
];

export default async function HomePage() {
  const metrics = await loadMetrics();
  const h = metrics.headline;

  return (
    <div className="min-h-screen flex flex-col">
      <TopNav />
      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 pt-32 pb-24 min-h-[70vh]">
        <div className="mono-label" style={{ letterSpacing: "0.32em" }}>
          UFO-HQ
        </div>

        <h1
          className="mt-8 font-display"
          style={{
            fontSize: "clamp(2.5rem, 7vw, 5rem)",
            fontWeight: 300,
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
            maxWidth: "1100px",
          }}
        >
          An archive of the unresolved.
        </h1>

        <p
          className="mt-6 font-serif italic"
          style={{
            fontSize: "clamp(1.25rem, 2.4vw, 2rem)",
            color: "var(--fg-secondary)",
            maxWidth: "720px",
            lineHeight: 1.4,
          }}
        >
          Every document the United States government released about UAP in
          October 2025.
        </p>

        <div
          className="mt-10 mono-label"
          style={{ color: "var(--fg-muted)", letterSpacing: "0.22em", fontSize: "11px" }}
        >
          {h.TM_02_total_documents} DOCUMENTS · {h.TM_01_total_sightings} SIGHTINGS · 1
          SOURCE · {h.TM_03_date_range}
        </div>

        <div className="mt-10 flex gap-4 flex-wrap justify-center">
          <a className="btn btn-primary btn-lg" href="/intel">
            <span className="btn-dot" aria-hidden />
            <span>OPEN CONSOLE</span>
            <span className="btn-arrow" aria-hidden>→</span>
          </a>
          <a className="btn btn-ghost btn-lg" href="/reports">
            <span>BROWSE REPORTS</span>
            <span className="btn-arrow" aria-hidden>→</span>
          </a>
        </div>
      </section>

      {/* KPI band */}
      <section className="px-6 pb-24 max-w-[1440px] mx-auto w-full">
        <div className="mono-label mb-4" style={{ color: "var(--amber)" }}>
          [TM-01] Telemetry · Headline
        </div>
        <div
          className="grid gap-3"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          }}
        >
          {KPI_ORDER.map((tile) => {
            const raw = h[tile.key];
            const value =
              raw === null || raw === undefined || raw === ""
                ? "—"
                : `${raw}${tile.suffix ?? ""}`;
            return (
              <div className="kpi" key={tile.key}>
                <div className="flex items-center gap-2">
                  <span
                    className="status-dot"
                    style={{
                      background:
                        tile.tone === "cy" ? "var(--cyan)" : "var(--amber)",
                      boxShadow:
                        tile.tone === "cy"
                          ? "0 0 6px var(--cyan-glow)"
                          : "0 0 6px var(--amber-glow)",
                    }}
                  />
                  <span className="mono-label">{tile.label}</span>
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

      {/* Footer */}
      <footer
        className="mt-auto border-t px-6 py-8"
        style={{ borderColor: "var(--border-faint)" }}
      >
        <div
          className="max-w-[1440px] mx-auto flex flex-wrap justify-between gap-4 mono-label"
          style={{ color: "var(--fg-muted)", fontSize: "10px" }}
        >
          <span>
            UFO-HQ aggregates publicly available reports. Inclusion is not
            endorsement of authenticity.
          </span>
          <span>
            CORPUS v0.1 · GENERATED {metrics.generated_at.slice(0, 10)} ·{" "}
            <a href="/about" style={{ color: "var(--fg-secondary)" }}>
              ABOUT
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}
