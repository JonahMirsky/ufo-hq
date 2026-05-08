import { TopNav } from "../../components/TopNav";
import { Timeline } from "../../components/Timeline";
import { loadSightings } from "../../lib/data";

export const metadata = {
  title: "Timeline — UFO HQ",
  description: "Seven decades of recorded UAP incidents, against the institutional events that bracket them.",
};

export default async function TimelinePage() {
  const sightings = await loadSightings();

  return (
    <>
      <TopNav />
      <main className="max-w-[1440px] mx-auto px-6 py-12">
        <div
          className="font-mono mb-3"
          style={{
            fontSize: "11px",
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: "var(--amber)",
          }}
        >
          Timeline
        </div>
        <h1
          className="font-display"
          style={{
            fontSize: "clamp(2.25rem, 5vw, 3.5rem)",
            fontWeight: 300,
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            marginBottom: "12px",
          }}
        >
          Seven decades of the unresolved.
        </h1>
        <p
          className="font-serif italic"
          style={{
            fontSize: "20px",
            color: "var(--fg-secondary)",
            lineHeight: 1.5,
            maxWidth: "820px",
            marginBottom: "32px",
          }}
        >
          Corpus sightings against the institutional milestones that bracket
          them. Click any year to expand its records.
        </p>

        <Timeline sightings={sightings} />
      </main>

      <footer
        className="border-t px-6 py-8 mt-16"
        style={{ borderColor: "var(--border-faint)" }}
      >
        <div
          className="max-w-[1440px] mx-auto font-mono"
          style={{
            color: "var(--fg-muted)",
            fontSize: "10px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          {sightings.length} sightings · most cluster after 2020 because the
          PURSUE corpus is dominated by recent CENTCOM mission reports
        </div>
      </footer>
    </>
  );
}
