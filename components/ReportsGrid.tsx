"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { UfoDocument } from "../lib/types";
import { AGENCY_COLORS, isOcrPending, shortId } from "../lib/format";

const AGENCIES = ["All", "DoW", "FBI", "NASA", "DoS", "Other"] as const;

export function ReportsGrid({ docs }: { docs: UfoDocument[] }) {
  const [agency, setAgency] = useState<(typeof AGENCIES)[number]>("All");
  const [query, setQuery] = useState("");
  const [hideOcrPending, setHideOcrPending] = useState(false);

  const ocrPendingCount = useMemo(
    () => docs.filter((d) => isOcrPending(d.summary)).length,
    [docs],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return docs.filter((d) => {
      if (agency !== "All" && d.agency !== agency) return false;
      if (hideOcrPending && isOcrPending(d.summary)) return false;
      if (!q) return true;
      const blob = [
        d.title,
        d.summary,
        d.agency,
        d.document_type,
        ...(d.key_findings ?? []),
        ...(d.location_refs ?? []),
        ...(d.unit_refs ?? []),
        ...(d.operation_refs ?? []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return blob.includes(q);
    });
  }, [agency, query, hideOcrPending, docs]);

  return (
    <>
      {/* Filter row */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex flex-wrap gap-2">
          {AGENCIES.map((a) => {
            const active = agency === a;
            return (
              <button
                key={a}
                onClick={() => setAgency(a)}
                className="font-mono"
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  padding: "6px 14px",
                  borderRadius: "var(--r-sm)",
                  border: `1px solid ${active ? "var(--amber)" : "var(--border-strong)"}`,
                  background: active ? "var(--amber-soft)" : "transparent",
                  color: active ? "var(--amber)" : "var(--fg-secondary)",
                  cursor: "pointer",
                  transition: "all 200ms var(--ease-cosmic)",
                }}
              >
                {a}
              </button>
            );
          })}
        </div>
        <div className="flex-1 min-w-[240px]">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="filter by title, agency, location, year…"
            className="w-full font-mono"
            style={{
              fontSize: "12px",
              letterSpacing: "0.06em",
              padding: "10px 16px",
              borderRadius: "var(--r-sm)",
              border: "1px solid var(--border-strong)",
              background: "var(--bg-panel)",
              color: "var(--fg-primary)",
              outline: "none",
            }}
          />
        </div>
        <div
          className="font-mono"
          style={{
            fontSize: "10px",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--fg-muted)",
          }}
        >
          {filtered.length} / {docs.length}
        </div>
      </div>

      {ocrPendingCount > 0 && (
        <div
          className="flex items-center gap-3 mb-4 -mt-1"
          style={{ fontSize: "11px" }}
        >
          <button
            onClick={() => setHideOcrPending((v) => !v)}
            className="font-mono"
            style={{
              fontSize: "10px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              padding: "5px 12px",
              borderRadius: "var(--r-sm)",
              border: `1px solid ${hideOcrPending ? "var(--status-anomaly)" : "var(--border-strong)"}`,
              background: hideOcrPending ? "rgba(198, 69, 69,0.08)" : "transparent",
              color: hideOcrPending ? "var(--status-anomaly)" : "var(--fg-secondary)",
              cursor: "pointer",
              transition: "all 200ms var(--ease-cosmic)",
            }}
          >
            {hideOcrPending ? "✕ Hiding" : "Hide"} OCR-pending ({ocrPendingCount})
          </button>
          <span
            className="font-mono"
            style={{
              fontSize: "10px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--fg-muted)",
            }}
          >
            {ocrPendingCount} encrypted scan{ocrPendingCount === 1 ? "" : "s"} have metadata-only extraction
          </span>
        </div>
      )}

      {/* Card grid */}
      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
        }}
      >
        {filtered.map((d) => (
          <ReportCard key={d.id} doc={d} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div
          className="font-mono mt-12 py-16 text-center"
          style={{
            border: "1px dashed var(--border-strong)",
            borderRadius: "var(--r-md)",
            color: "var(--fg-muted)",
            letterSpacing: "0.22em",
            fontSize: "11px",
          }}
        >
          NO RECORDS MATCH CURRENT FILTERS · ADJUST PARAMETERS
        </div>
      )}
    </>
  );
}

function ReportCard({ doc }: { doc: UfoDocument }) {
  const accent = AGENCY_COLORS[doc.agency] ?? "var(--fg-muted)";
  const sightCount = doc.incident_refs?.length ?? 0;
  const ocrPending = isOcrPending(doc.summary);

  return (
    <Link
      href={`/reports/${doc.id}`}
      className="panel block"
      style={{
        textDecoration: "none",
        color: "inherit",
        cursor: "pointer",
      }}
    >
      <span className="br tl" />
      <span className="br tr" />
      <span className="br bl" />
      <span className="br br2" />
      <div
        className="p-head"
        style={{ alignItems: "flex-start" }}
      >
        <div className="flex flex-col min-w-0 gap-1">
          <span className="p-id">{shortId(doc.id)}</span>
          <span
            className="font-mono"
            style={{
              fontSize: "9px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--fg-muted)",
            }}
          >
            {doc.document_type.replace(/_/g, " ")}
          </span>
        </div>
        <span
          className="font-mono"
          style={{
            fontSize: "10px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: accent,
            border: `1px solid ${accent}`,
            padding: "3px 8px",
            borderRadius: "4px",
          }}
        >
          {doc.agency}
        </span>
      </div>
      <div className="p-body" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <h3
          className="font-display"
          style={{
            fontSize: "16px",
            fontWeight: 500,
            letterSpacing: "-0.005em",
            lineHeight: 1.3,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            color: "var(--fg-primary)",
          }}
        >
          {doc.title}
        </h3>
        <div
          className="font-mono"
          style={{
            fontSize: "9px",
            letterSpacing: "0.06em",
            color: "var(--fg-muted)",
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <span>PUB · {doc.published_at}</span>
          <span>{doc.page_count}p</span>
          {doc.redaction_pct > 0 && <span>{doc.redaction_pct}% REDACTED</span>}
        </div>
        <p
          style={{
            fontSize: "13px",
            color: "var(--fg-secondary)",
            lineHeight: 1.55,
            display: "-webkit-box",
            WebkitLineClamp: 4,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {doc.summary}
        </p>
      </div>
      <div className="p-foot">
        <div className="flex items-center gap-2">
          <span
            className="status-dot"
            style={{
              background: ocrPending
                ? "var(--status-anomaly)"
                : sightCount > 0
                ? "var(--amber)"
                : "var(--fg-disabled)",
              boxShadow: ocrPending
                ? "0 0 4px rgba(198, 69, 69,0.4)"
                : sightCount > 0
                ? "0 0 4px var(--amber-glow)"
                : "none",
            }}
          />
          <span>
            {ocrPending
              ? "OCR PENDING"
              : `${sightCount} ${sightCount === 1 ? "sighting" : "sightings"}`}
          </span>
        </div>
        <span style={{ color: "var(--amber)" }}>OPEN →</span>
      </div>
    </Link>
  );
}
