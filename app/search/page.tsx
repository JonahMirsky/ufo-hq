import { TopNav } from "../../components/TopNav";
import { SearchClient } from "../../components/SearchClient";
import { loadDocuments, loadSightings } from "../../lib/data";

export const metadata = {
  title: "Search — UFO HQ",
  description: "Lexical search across every document and sighting in the corpus.",
};

export default async function SearchPage() {
  const [documents, sightings] = await Promise.all([
    loadDocuments(),
    loadSightings(),
  ]);

  return (
    <>
      <TopNav />
      <main className="max-w-[920px] mx-auto px-6 py-12">
        <div
          className="font-mono mb-3"
          style={{
            fontSize: "11px",
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: "var(--amber)",
          }}
        >
          Search
        </div>
        <h1
          className="font-display"
          style={{
            fontSize: "clamp(2rem, 4vw, 2.75rem)",
            fontWeight: 300,
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            marginBottom: "8px",
          }}
        >
          Across {documents.length} documents and {sightings.length} sightings.
        </h1>
        <p
          className="font-serif italic"
          style={{
            fontSize: "18px",
            color: "var(--fg-secondary)",
            marginBottom: "32px",
            lineHeight: 1.5,
            maxWidth: "640px",
          }}
        >
          Lexical search. Free, local, no API. Type a phrase the way it might
          appear in a mission report.
        </p>

        <SearchClient documents={documents} sightings={sightings} />
      </main>
    </>
  );
}
