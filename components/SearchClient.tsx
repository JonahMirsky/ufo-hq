"use client";

import Link from "next/link";
import Fuse from "fuse.js";
import { useEffect, useMemo, useState } from "react";
import type { Sighting, UfoDocument } from "../lib/types";
import { AGENCY_COLORS, shortId } from "../lib/format";

type IndexEntry =
  | { _t: "document"; doc: UfoDocument; haystack: string }
  | { _t: "sighting"; s: Sighting; haystack: string };

const EXAMPLES = [
  "tic-tac near nuclear",
  "radar jamming syria",
  "pilot encounter above 24,000",
  "FBI 62-HQ-83894",
  "weapon system video",
  "apollo astronaut",
  "balloon",
];

export function SearchClient({
  documents,
  sightings,
}: {
  documents: UfoDocument[];
  sightings: Sighting[];
}) {
  const [q, setQ] = useState("");

  const fuse = useMemo(() => {
    const docEntries: IndexEntry[] = documents.map((doc) => ({
      _t: "document",
      doc,
      haystack: [
        doc.title,
        doc.summary,
        doc.agency,
        doc.document_type,
        ...(doc.key_findings ?? []),
        ...(doc.notable_quotes ?? []),
        ...(doc.location_refs ?? []),
        ...(doc.unit_refs ?? []),
        ...(doc.operation_refs ?? []),
        ...(doc.platform_refs ?? []),
        ...(doc.agency_refs ?? []),
        ...(doc.redaction_codes ?? []),
        doc.declassified_by ?? "",
      ]
        .filter(Boolean)
        .join(" "),
    }));
    const sgtEntries: IndexEntry[] = sightings.map((s) => ({
      _t: "sighting",
      s,
      haystack: [
        s.summary,
        s.location_text ?? "",
        s.country_code ?? "",
        s.shape,
        s.shape_raw,
        s.color ?? "",
        s.witness_role,
        s.outcome ?? "",
        s.weather ?? "",
        ...(s.evidence_types ?? []),
        ...(s.maneuver_tags ?? []),
        ...(s.media_captured ?? []),
      ]
        .filter(Boolean)
        .join(" "),
    }));
    const all: IndexEntry[] = [...docEntries, ...sgtEntries];
    return new Fuse(all, {
      keys: ["haystack"],
      threshold: 0.34,
      ignoreLocation: true,
      minMatchCharLength: 2,
    });
  }, [documents, sightings]);

  const results = useMemo(() => {
    if (q.trim().length < 2) return [];
    return fuse.search(q.trim()).slice(0, 50);
  }, [q, fuse]);

  // Auto-focus
  useEffect(() => {
    const input = document.getElementById("search-input") as HTMLInputElement | null;
    input?.focus();
  }, []);

  const docCount = results.filter((r) => r.item._t === "document").length;
  const sightCount = results.filter((r) => r.item._t === "sighting").length;

  return (
    <>
      {/* Big input */}
      <div className="relative">
        <span
          className="absolute left-5 top-1/2 -translate-y-1/2 font-mono"
          style={{
            fontSize: "20px",
            color: q ? "var(--amber)" : "var(--fg-muted)",
            pointerEvents: "none",
          }}
          aria-hidden
        >
          ⌕
        </span>
        <input
          id="search-input"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Ask UFO-HQ anything..."
          className="w-full"
          style={{
            fontSize: "22px",
            fontFamily: "var(--font-display)",
            padding: "20px 22px 20px 56px",
            borderRadius: "var(--r-md)",
            border: "1px solid var(--border-strong)",
            background: "var(--bg-panel)",
            color: "var(--fg-primary)",
            outline: "none",
            transition: "all 200ms var(--ease-cosmic)",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "var(--amber)";
            e.currentTarget.style.boxShadow = "0 0 0 3px var(--amber-glow)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "var(--border-strong)";
            e.currentTarget.style.boxShadow = "none";
          }}
        />
      </div>

      {/* Status / examples */}
      <div className="mt-4">
        {q.trim().length < 2 ? (
          <div>
            <div
              className="font-mono mb-3"
              style={{
                fontSize: "10px",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "var(--fg-muted)",
              }}
            >
              try
            </div>
            <div className="flex flex-wrap gap-2">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  onClick={() => setQ(ex)}
                  className="font-mono"
                  style={{
                    fontSize: "11px",
                    letterSpacing: "0.06em",
                    padding: "6px 12px",
                    borderRadius: "var(--r-sm)",
                    border: "1px solid var(--border-strong)",
                    background: "transparent",
                    color: "var(--fg-secondary)",
                    cursor: "pointer",
                  }}
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div
            className="font-mono"
            style={{
              fontSize: "10px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--fg-muted)",
            }}
          >
            <span className="status-dot amber" style={{ marginRight: "8px" }} />
            {results.length === 0
              ? "no matches"
              : `${results.length} matches · ${docCount} doc${docCount === 1 ? "" : "s"} / ${sightCount} sighting${sightCount === 1 ? "" : "s"}`}
          </div>
        )}
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="mt-6 flex flex-col gap-3">
          {results.map((r, i) => (
            <SearchHit key={i} entry={r.item} score={r.score} />
          ))}
        </div>
      )}
    </>
  );
}

function SearchHit({ entry, score }: { entry: IndexEntry; score?: number }) {
  if (entry._t === "document") {
    const d = entry.doc;
    const accent = AGENCY_COLORS[d.agency] ?? "var(--fg-muted)";
    return (
      <Link
        href={`/reports/${d.id}`}
        className="block panel"
        style={{ textDecoration: "none", color: "inherit", padding: "14px 18px" }}
      >
        <span className="br tl" />
        <span className="br tr" />
        <span className="br bl" />
        <span className="br br2" />
        <div className="flex items-center justify-between mb-2 gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="p-id">{shortId(d.id)}</span>
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
              {d.agency} · {d.document_type.replace(/_/g, " ")}
            </span>
          </div>
          {score !== undefined && (
            <span
              className="font-mono"
              style={{
                fontSize: "9px",
                letterSpacing: "0.18em",
                color: "var(--fg-muted)",
              }}
            >
              SCORE · {Math.max(0, 100 - Math.round(score * 100))}
            </span>
          )}
        </div>
        <div
          className="font-display"
          style={{ fontSize: "15px", fontWeight: 500, lineHeight: 1.4, marginBottom: "4px" }}
        >
          {d.title}
        </div>
        <div
          style={{
            fontSize: "13px",
            color: "var(--fg-secondary)",
            lineHeight: 1.5,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {d.summary}
        </div>
      </Link>
    );
  }
  // sighting
  const s = entry.s;
  return (
    <Link
      href={`/reports/${s.doc_id}`}
      className="block panel"
      style={{ textDecoration: "none", color: "inherit", padding: "14px 18px" }}
    >
      <span className="br tl" />
      <span className="br tr" />
      <span className="br bl" />
      <span className="br br2" />
      <div className="flex items-center justify-between mb-2 gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span
            className="font-mono"
            style={{
              fontSize: "9px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--cyan)",
              background: "var(--cyan-soft)",
              border: "1px solid var(--cyan-glow)",
              padding: "2px 6px",
              borderRadius: "3px",
            }}
          >
            SIGHTING
          </span>
          {s.shape && s.shape !== "unknown" && (
            <span
              className="font-mono"
              style={{
                fontSize: "9px",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--fg-muted)",
              }}
            >
              {s.shape}
            </span>
          )}
          {s.location_text && (
            <span style={{ fontSize: "11px", color: "var(--fg-muted)" }}>{s.location_text}</span>
          )}
        </div>
        {score !== undefined && (
          <span
            className="font-mono"
            style={{
              fontSize: "9px",
              letterSpacing: "0.18em",
              color: "var(--fg-muted)",
            }}
          >
            SCORE · {Math.max(0, 100 - Math.round(score * 100))}
          </span>
        )}
      </div>
      <div
        style={{
          fontSize: "14px",
          color: "var(--fg-primary)",
          lineHeight: 1.5,
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {s.summary}
      </div>
      <div
        className="font-mono mt-2"
        style={{
          fontSize: "9px",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--fg-muted)",
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <span>OCCURRED · {s.occurred_at?.slice(0, 10) ?? "—"}</span>
        {s.altitude_ft !== null && <span>ALT · {s.altitude_ft} FT</span>}
        {s.is_aviator && <span style={{ color: "var(--amber)" }}>AVIATOR</span>}
        <span>↗ OPEN DOC</span>
      </div>
    </Link>
  );
}
