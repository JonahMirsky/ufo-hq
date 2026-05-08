"use client";

import { useMemo, useState } from "react";
import type { MediaItem } from "../lib/media";
import { AGENCY_COLORS } from "../lib/format";

const FILTERS = ["All", "Images", "Videos"] as const;
type Filter = (typeof FILTERS)[number];

export function MediaGrid({ items }: { items: MediaItem[] }) {
  const [filter, setFilter] = useState<Filter>("All");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [active, setActive] = useState<MediaItem | null>(null);

  const filtered = useMemo(() => {
    let out = items;
    if (filter === "Images") out = out.filter((m) => m.kind === "image");
    if (filter === "Videos") out = out.filter((m) => m.kind === "video");
    if (order === "desc") {
      out = [...out].reverse();
    }
    return out;
  }, [filter, order, items]);

  const grouped = useMemo(() => {
    const buckets = new Map<string, MediaItem[]>();
    for (const m of filtered) {
      const key = m.year ? String(m.year) : "Undated";
      if (!buckets.has(key)) buckets.set(key, []);
      buckets.get(key)!.push(m);
    }
    return Array.from(buckets.entries());
  }, [filtered]);

  const imgCount = items.filter((m) => m.kind === "image").length;
  const vidCount = items.filter((m) => m.kind === "video").length;

  return (
    <>
      {/* Filter row */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const activeF = filter === f;
            const count = f === "All" ? items.length : f === "Images" ? imgCount : vidCount;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="font-mono"
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  padding: "8px 16px",
                  borderRadius: "var(--r-sm)",
                  border: `1px solid ${activeF ? "var(--amber)" : "var(--border-strong)"}`,
                  background: activeF ? "var(--amber-soft)" : "transparent",
                  color: activeF ? "var(--amber)" : "var(--fg-secondary)",
                  cursor: "pointer",
                  transition: "all 200ms var(--ease-cosmic)",
                }}
              >
                {f} <span style={{ opacity: 0.5, marginLeft: "6px" }}>{count}</span>
              </button>
            );
          })}
        </div>
        <button
          onClick={() => setOrder((o) => (o === "asc" ? "desc" : "asc"))}
          className="font-mono ml-auto"
          style={{
            fontSize: "10px",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            padding: "8px 14px",
            borderRadius: "var(--r-sm)",
            border: "1px solid var(--border-strong)",
            background: "transparent",
            color: "var(--fg-secondary)",
            cursor: "pointer",
          }}
        >
          {order === "asc" ? "Oldest first ↑" : "Newest first ↓"}
        </button>
      </div>

      {/* Year-grouped grid */}
      <div className="flex flex-col gap-12">
        {grouped.map(([year, group]) => (
          <section key={year}>
            <div
              className="font-mono mb-4 flex items-center gap-4"
              style={{
                fontSize: "11px",
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: "var(--fg-muted)",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "32px",
                  fontWeight: 300,
                  letterSpacing: "-0.02em",
                  color: "var(--amber)",
                  lineHeight: 1,
                }}
              >
                {year}
              </span>
              <span style={{ flex: 1, height: "1px", background: "var(--border-faint)" }} />
              <span>{group.length} item{group.length === 1 ? "" : "s"}</span>
            </div>
            <div
              className="grid gap-4"
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              }}
            >
              {group.map((m) => (
                <MediaCard key={m.id} item={m} onOpen={() => setActive(m)} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Lightbox */}
      {active && <Lightbox item={active} onClose={() => setActive(null)} />}
    </>
  );
}

function MediaCard({ item, onOpen }: { item: MediaItem; onOpen: () => void }) {
  const accent = AGENCY_COLORS[item.agency] ?? "var(--fg-muted)";
  const isVideo = item.kind === "video";

  const handleClick = () => {
    if (isVideo) {
      if (item.dvids_url) window.open(item.dvids_url, "_blank", "noopener");
    } else {
      onOpen();
    }
  };

  return (
    <button
      onClick={handleClick}
      className="text-left"
      style={{
        background: "var(--bg-panel)",
        border: "1px solid var(--border-faint)",
        borderRadius: "var(--r-md)",
        overflow: "hidden",
        cursor: "pointer",
        transition: "all 200ms var(--ease-cosmic)",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--border-strong)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border-faint)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Thumbnail area */}
      <div
        style={{
          aspectRatio: "16/10",
          background: "var(--bg-void)",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isVideo ? (
          <VideoThumb item={item} />
        ) : (
          <img
            src={item.src}
            alt={item.title}
            loading="lazy"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "saturate(0.92) contrast(1.05)",
            }}
          />
        )}

        {/* Type badge */}
        <span
          className="font-mono"
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            fontSize: "9px",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            padding: "3px 8px",
            borderRadius: "3px",
            background: isVideo ? "var(--cyan-soft)" : "var(--amber-soft)",
            border: `1px solid ${isVideo ? "var(--cyan)" : "var(--amber)"}`,
            color: isVideo ? "var(--cyan)" : "var(--amber)",
            backdropFilter: "saturate(180%)",
          }}
        >
          {isVideo ? "▶ Video" : "▢ Image"}
        </span>
      </div>

      {/* Meta */}
      <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: "6px" }}>
        <div className="flex items-center gap-2" style={{ minHeight: "18px" }}>
          <span
            className="font-mono"
            style={{
              fontSize: "9px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: accent,
              border: `1px solid ${accent}`,
              padding: "2px 6px",
              borderRadius: "3px",
            }}
          >
            {item.agency}
          </span>
          {item.location && (
            <span
              style={{ fontSize: "11px", color: "var(--fg-muted)" }}
              className="truncate"
            >
              {item.location}
            </span>
          )}
        </div>
        <h3
          className="font-display"
          style={{
            fontSize: "14px",
            fontWeight: 500,
            lineHeight: 1.35,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            color: "var(--fg-primary)",
          }}
        >
          {item.title}
        </h3>
        <div
          className="font-mono"
          style={{
            fontSize: "9px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--fg-muted)",
            marginTop: "auto",
          }}
        >
          {item.incident_date
            ? `${item.date_approx ? "~ " : ""}${item.incident_date.slice(0, 10)}`
            : "DATE UNKNOWN"}
          <span style={{ marginLeft: "10px", color: "var(--amber)" }}>
            {isVideo ? "OPEN ON DVIDS ↗" : "VIEW →"}
          </span>
        </div>
      </div>
    </button>
  );
}

function VideoThumb({ item }: { item: MediaItem }) {
  // We can't reliably load DVIDS thumbnails (CORS / referrer policy), so render a styled tile.
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background:
          "radial-gradient(circle at 50% 50%, rgba(107,194,217,0.18) 0%, var(--bg-void) 80%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--cyan)",
        fontFamily: "var(--font-mono)",
        position: "relative",
      }}
    >
      <div
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          border: "1px solid var(--cyan)",
          background: "rgba(107,194,217,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "20px",
          color: "var(--cyan)",
          textShadow: "0 0 12px var(--cyan-glow)",
        }}
      >
        ▶
      </div>
      {item.dvids_id && (
        <div
          style={{
            position: "absolute",
            bottom: "10px",
            right: "10px",
            fontSize: "9px",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--fg-muted)",
          }}
        >
          DVIDS · {item.dvids_id}
        </div>
      )}
    </div>
  );
}

function Lightbox({ item, onClose }: { item: MediaItem; onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(5,6,8,0.92)",
        backdropFilter: "blur(4px)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        cursor: "zoom-out",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "1100px",
          width: "100%",
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          cursor: "default",
        }}
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2
              className="font-display"
              style={{ fontSize: "20px", fontWeight: 500, lineHeight: 1.3 }}
            >
              {item.title}
            </h2>
            <div
              className="font-mono mt-1"
              style={{
                fontSize: "10px",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "var(--fg-muted)",
              }}
            >
              {item.agency}
              {item.location && ` · ${item.location}`}
              {item.incident_date && ` · ${item.incident_date.slice(0, 10)}`}
            </div>
          </div>
          <button
            onClick={onClose}
            className="font-mono"
            style={{
              fontSize: "10px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              padding: "8px 14px",
              borderRadius: "var(--r-sm)",
              border: "1px solid var(--border-strong)",
              background: "transparent",
              color: "var(--fg-secondary)",
              cursor: "pointer",
            }}
          >
            ✕ CLOSE
          </button>
        </div>
        <div
          style={{
            background: "var(--bg-void)",
            borderRadius: "var(--r-md)",
            border: "1px solid var(--border-faint)",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={item.src}
            alt={item.title}
            style={{
              maxWidth: "100%",
              maxHeight: "70vh",
              objectFit: "contain",
              display: "block",
            }}
          />
        </div>
        {item.description && (
          <p
            style={{
              fontSize: "13px",
              lineHeight: 1.6,
              color: "var(--fg-secondary)",
              maxHeight: "120px",
              overflow: "auto",
            }}
          >
            {item.description}
          </p>
        )}
        {item.source_url && (
          <a
            href={item.source_url}
            target="_blank"
            rel="noopener"
            className="font-mono"
            style={{
              fontSize: "10px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--amber)",
              textDecoration: "none",
            }}
          >
            OPEN ORIGINAL AT WAR.GOV ↗
          </a>
        )}
      </div>
    </div>
  );
}
