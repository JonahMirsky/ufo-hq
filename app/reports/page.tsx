import { TopNav } from "../../components/TopNav";
import { ReportsGrid } from "../../components/ReportsGrid";
import { loadDocuments } from "../../lib/data";

export const metadata = {
  title: "Documents — UFO HQ",
  description: "Every PDF in the war.gov PURSUE corpus, structured.",
};

export default async function ReportsPage() {
  const docs = await loadDocuments();

  return (
    <>
      <TopNav />
      <div className="max-w-[1440px] mx-auto px-6 py-12">
        {/* Section header */}
        <div className="flex items-end justify-between gap-6 mb-10 flex-wrap">
          <div>
            <div
              className="font-mono"
              style={{
                fontSize: "11px",
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: "var(--amber)",
                background: "var(--amber-soft)",
                border: "1px solid var(--amber-glow)",
                padding: "3px 10px",
                borderRadius: "4px",
                display: "inline-block",
                marginBottom: "12px",
              }}
            >
              01 / DOC / LIBRARY
            </div>
            <h1
              className="font-display"
              style={{
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 300,
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
              }}
            >
              Documents.
            </h1>
            <p
              className="font-serif italic mt-3"
              style={{
                fontSize: "20px",
                color: "var(--fg-secondary)",
                maxWidth: "560px",
              }}
            >
              Every PDF in the corpus, structured for analysis.
            </p>
          </div>
          <div
            className="font-mono flex flex-col items-end"
            style={{
              fontSize: "10px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--fg-muted)",
            }}
          >
            <span>{docs.length} documents</span>
            <span style={{ color: "var(--fg-secondary)" }}>
              {docs.reduce((sum, d) => sum + (d.page_count || 0), 0)} pages
            </span>
          </div>
        </div>

        <ReportsGrid docs={docs} />
      </div>

      {/* Footer */}
      <footer
        className="border-t px-6 py-8 mt-12"
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
        </div>
      </footer>
    </>
  );
}
