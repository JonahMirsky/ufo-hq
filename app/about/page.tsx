import { TopNav } from "../../components/TopNav";
import { loadDocuments, loadMetrics } from "../../lib/data";

export const metadata = {
  title: "Mission — UFO HQ",
  description: "Why UFO-HQ exists, what's in the corpus, and how it was built.",
};

export default async function AboutPage() {
  const docs = await loadDocuments();
  const metrics = await loadMetrics();

  return (
    <>
      <TopNav />
      <main className="max-w-[720px] mx-auto px-6 py-16">
        <div
          className="font-mono mb-4"
          style={{
            fontSize: "11px",
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: "var(--amber)",
          }}
        >
          Mission
        </div>
        <h1
          className="font-display"
          style={{
            fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
            fontWeight: 300,
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
          }}
        >
          A reading room for the unresolved.
        </h1>
        <p
          className="font-serif italic mt-4"
          style={{
            fontSize: "20px",
            color: "var(--fg-secondary)",
            lineHeight: 1.5,
            maxWidth: "620px",
          }}
        >
          Every document the United States government released about UAP in
          October 2025, structured for analysis.
        </p>

        <div style={{ height: "48px" }} />

        <Section title="Why UFO-HQ exists">
          <p>
            In October 2025, under President Trump&apos;s PURSUE directive, the
            U.S. Department of War released the largest single batch of
            UAP-related material in American history — mission reports, range
            fouler debriefs, declassified diplomatic cables, NASA transcripts,
            FBI archives, and one signed citizen statement.
          </p>
          <p>
            Most of it lives as PDFs on{" "}
            <a
              href="https://www.war.gov/UFO/"
              target="_blank"
              rel="noopener"
              style={{ color: "var(--amber)" }}
            >
              war.gov/UFO/
            </a>{" "}
            — useful if you have time to read 4,144 pages. UFO-HQ pulls every
            release into a structured archive so the patterns become visible.
          </p>
        </Section>

        <Section title="What the data is">
          <p>
            The corpus currently holds {docs.length} documents covering{" "}
            {metrics.headline.TM_02_total_pages} pages, drawn entirely from the
            war.gov PURSUE release. Spread across {Object.keys(metrics.by_agency_docs).length}{" "}
            originating agencies:
          </p>
          <ul>
            {Object.entries(metrics.by_agency_docs).map(([agency, count]) => (
              <li key={agency}>
                <strong>{agency}</strong> — {count} document{count === 1 ? "" : "s"}
              </li>
            ))}
          </ul>
          <p>
            Each document carries a structured record (title, agency,
            classification, redaction percentage, declassification authority,
            key findings) and any aerial-object observations it describes are
            split into individual sighting records with shape, altitude,
            evidence type, witness role, and outcome.
          </p>
        </Section>

        <Section title="What the data isn&apos;t">
          <p>
            We do not aggregate civilian UFO databases, abduction narratives,
            cryptid material, or anything outside the federal disclosure scope
            for v1. Inclusion of an item is not an assertion that the
            underlying claim is true — most reports describe phenomena
            categorized as &ldquo;possible UAP&rdquo;, deliberately leaving room
            for later identification.
          </p>
          <p>
            We do not invent. Coordinates, witness names, and exact times are
            captured only when the document explicitly states them. Where
            redaction has removed information, the field is null and stays
            that way.
          </p>
        </Section>

        <Section title="Methodology">
          <ul>
            <li>
              <strong>Source:</strong> Records scraped from war.gov/UFO/ via
              its backing CSV. Files downloaded in May 2026.
            </li>
            <li>
              <strong>Extraction:</strong> Each PDF read by Claude (Anthropic),
              structured into JSON per a schema designed to mirror the
              database tables planned for v2 — so the static-JSON v1 ports
              directly to Postgres later.
            </li>
            <li>
              <strong>No paid APIs.</strong> No OpenAI, no third-party
              embeddings, no per-request billing. The only inference cost is
              the operator&apos;s own Claude subscription.
            </li>
            <li>
              <strong>No fabrication.</strong> If a doc doesn&apos;t state
              something, we don&apos;t fill it in. Filenames sometimes lie
              about content (we&apos;ve found at least four cases where the
              filename geography contradicts the actual mission narrative);
              when filename and content disagree, we honor the content.
            </li>
          </ul>
        </Section>

        <Section title="Sources">
          <ul>
            <li>
              <a
                href="https://www.war.gov/UFO/"
                target="_blank"
                rel="noopener"
                style={{ color: "var(--cyan)" }}
              >
                war.gov/UFO/
              </a>{" "}
              — DoD PURSUE Public Reading Room
            </li>
            <li>
              <a
                href="https://www.aaro.mil/"
                target="_blank"
                rel="noopener"
                style={{ color: "var(--cyan)" }}
              >
                aaro.mil
              </a>{" "}
              — All Domain Anomaly Resolution Office
            </li>
            <li>
              <a
                href="https://www.defense.gov/News/Releases/"
                target="_blank"
                rel="noopener"
                style={{ color: "var(--cyan)" }}
              >
                defense.gov / Releases
              </a>{" "}
              — Department of War press releases
            </li>
          </ul>
        </Section>

        <blockquote
          className="font-serif italic"
          style={{
            fontSize: "22px",
            lineHeight: 1.5,
            color: "var(--fg-primary)",
            borderLeft: "2px solid var(--amber)",
            paddingLeft: "20px",
            margin: "48px 0",
          }}
        >
          UFO-HQ aggregates publicly available reports. Inclusion is not
          endorsement of authenticity.
        </blockquote>

        <Section title="Build">
          <p>
            Open source. Next.js 16 + Tailwind, no paid APIs, no per-usage
            services. Static JSON data layer; the entire site is renderable
            from a single git checkout.
          </p>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: "0.06em" }}>
            <a
              href="https://github.com/JonahMirsky/ufo-hq"
              target="_blank"
              rel="noopener"
              style={{ color: "var(--cyan)" }}
            >
              github.com/JonahMirsky/ufo-hq
            </a>
          </p>
        </Section>
      </main>

      <footer
        className="border-t px-6 py-8"
        style={{ borderColor: "var(--border-faint)" }}
      >
        <div
          className="max-w-[720px] mx-auto font-mono"
          style={{
            color: "var(--fg-muted)",
            fontSize: "10px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          CORPUS v0.1 · GENERATED {metrics.generated_at.slice(0, 10)} · {docs.length} DOCUMENTS · {metrics.headline.TM_01_total_sightings} SIGHTINGS
        </div>
      </footer>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: "48px" }}>
      <h2
        className="font-mono"
        style={{
          fontSize: "11px",
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: "var(--fg-primary)",
          paddingBottom: "10px",
          borderBottom: "1px solid var(--amber-glow)",
          marginBottom: "20px",
        }}
      >
        {title}
      </h2>
      <div
        style={{
          fontSize: "16px",
          lineHeight: 1.7,
          color: "var(--fg-secondary)",
        }}
        className="prose"
      >
        {children}
      </div>
      <style>{`
        .prose p { margin-bottom: 1em; }
        .prose p:last-child { margin-bottom: 0; }
        .prose ul { list-style: none; padding: 0; margin: 0; }
        .prose ul li {
          padding: 6px 0 6px 18px;
          position: relative;
        }
        .prose ul li::before {
          content: '·';
          color: var(--amber);
          position: absolute;
          left: 0;
          font-weight: bold;
        }
        .prose strong { color: var(--fg-primary); font-weight: 500; }
      `}</style>
    </section>
  );
}
