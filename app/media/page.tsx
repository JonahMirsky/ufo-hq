import { TopNav } from "../../components/TopNav";
import { MediaGrid } from "../../components/MediaGrid";
import { loadMedia } from "../../lib/media";

export const metadata = {
  title: "Media — UFO HQ",
  description: "Every UAP image and video in the war.gov PURSUE corpus, in chronological order.",
};

export default async function MediaPage() {
  const items = await loadMedia();
  const images = items.filter((m) => m.kind === "image").length;
  const videos = items.filter((m) => m.kind === "video").length;
  const earliest = items.find((m) => m.year)?.year;
  const latest = [...items].reverse().find((m) => m.year)?.year;

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
          Media
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
          Every photograph and video, in order.
        </h1>
        <p
          className="font-serif italic"
          style={{
            fontSize: "20px",
            color: "var(--fg-secondary)",
            lineHeight: 1.5,
            maxWidth: "780px",
            marginBottom: "12px",
          }}
        >
          The visual record from the war.gov PURSUE release — Apollo
          spaceflight to FBI sensor frames, grouped by year.
        </p>
        <div
          className="font-mono mb-10"
          style={{
            fontSize: "10px",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--fg-muted)",
          }}
        >
          {images} images · {videos} videos
          {earliest && latest && earliest !== latest
            ? ` · ${earliest}–${latest}`
            : earliest
            ? ` · ${earliest}`
            : ""}
        </div>

        <MediaGrid items={items} />
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
          Images served locally from /public/media/. Videos open at DVIDS in a new tab —
          we don&apos;t host video.
        </div>
      </footer>
    </>
  );
}
