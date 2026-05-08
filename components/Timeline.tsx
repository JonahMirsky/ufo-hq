"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Sighting } from "../lib/types";

const HISTORICAL_EVENTS: { year: number; label: string; tone: "amber" | "cyan" | "red" }[] = [
  { year: 1947, label: "Roswell incident", tone: "amber" },
  { year: 1952, label: "DC flap", tone: "amber" },
  { year: 1966, label: "Michigan wave", tone: "amber" },
  { year: 1969, label: "Project Blue Book ends", tone: "cyan" },
  { year: 1997, label: "Phoenix lights", tone: "amber" },
  { year: 2004, label: "Tic-Tac (Nimitz)", tone: "amber" },
  { year: 2017, label: "NYT AATIP", tone: "cyan" },
  { year: 2020, label: "UAP Task Force", tone: "cyan" },
  { year: 2021, label: "ODNI prelim assessment", tone: "cyan" },
  { year: 2022, label: "AARO formed", tone: "cyan" },
  { year: 2023, label: "Congressional UAP hearings", tone: "cyan" },
  { year: 2024, label: "AARO Vol. 1", tone: "cyan" },
  { year: 2026, label: "DoD Mega-Release (PURSUE)", tone: "red" },
];

export function Timeline({ sightings }: { sightings: Sighting[] }) {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const { yearCounts, range } = useMemo(() => {
    const counts: Record<number, number> = {};
    for (const s of sightings) {
      const y = s.occurred_at ? new Date(s.occurred_at).getUTCFullYear() : null;
      if (y && !isNaN(y)) counts[y] = (counts[y] ?? 0) + 1;
    }
    const yrs = Object.keys(counts).map(Number);
    if (yrs.length === 0) return { yearCounts: {}, range: [1947, 2026] as const };
    const min = Math.min(...yrs, 1947);
    const max = Math.max(...yrs, 2026);
    return { yearCounts: counts, range: [min, max] as const };
  }, [sightings]);

  const yearsList = useMemo(() => {
    const out: number[] = [];
    for (let y = range[0]; y <= range[1]; y++) out.push(y);
    return out;
  }, [range]);

  const maxCount = Math.max(1, ...Object.values(yearCounts));
  const W = 1200;
  const H = 320;
  const PAD_L = 30;
  const PAD_R = 30;
  const PAD_T = 90;
  const PAD_B = 50;
  const innerW = W - PAD_L - PAD_R;
  const innerH = H - PAD_T - PAD_B;

  const xFor = (year: number) =>
    PAD_L + ((year - range[0]) / (range[1] - range[0])) * innerW;
  const yFor = (count: number) => PAD_T + innerH - (count / maxCount) * innerH;

  const decadeMarks = useMemo(() => {
    const out: number[] = [];
    const start = Math.floor(range[0] / 10) * 10;
    for (let y = start; y <= range[1]; y += 10) {
      if (y >= range[0]) out.push(y);
    }
    return out;
  }, [range]);

  const yearsInSelection = sightings.filter((s) => {
    if (selectedYear === null) return false;
    if (!s.occurred_at) return false;
    return new Date(s.occurred_at).getUTCFullYear() === selectedYear;
  });

  return (
    <>
      <div className="overflow-x-auto" style={{ background: "var(--bg-panel)", borderRadius: "var(--r-md)", border: "1px solid var(--border-faint)", padding: "20px" }}>
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" style={{ width: "100%", minWidth: "800px", height: "auto" }}>
          {/* horizontal axis */}
          <line
            x1={PAD_L}
            x2={W - PAD_R}
            y1={PAD_T + innerH}
            y2={PAD_T + innerH}
            stroke="var(--border-rail)"
            strokeWidth={0.5}
          />

          {/* decade ticks */}
          {decadeMarks.map((y) => (
            <g key={y}>
              <line
                x1={xFor(y)}
                x2={xFor(y)}
                y1={PAD_T + innerH}
                y2={PAD_T + innerH + 6}
                stroke="var(--border-rail)"
                strokeWidth={0.5}
              />
              <text
                x={xFor(y)}
                y={PAD_T + innerH + 22}
                textAnchor="middle"
                className="font-mono"
                fontSize={10}
                fill="var(--fg-muted)"
                letterSpacing="0.06em"
              >
                {y}
              </text>
            </g>
          ))}

          {/* historical event markers */}
          {HISTORICAL_EVENTS.filter((e) => e.year >= range[0] && e.year <= range[1]).map((e, i) => {
            const x = xFor(e.year);
            const color =
              e.tone === "red"
                ? "var(--status-anomaly)"
                : e.tone === "cyan"
                ? "var(--cyan)"
                : "var(--amber)";
            // Stagger label heights so they don't overlap
            const stagger = (i % 3) * 16;
            return (
              <g key={`ev-${e.year}-${i}`}>
                <line
                  x1={x}
                  x2={x}
                  y1={PAD_T - 8}
                  y2={PAD_T + innerH}
                  stroke={color}
                  strokeWidth={0.5}
                  strokeDasharray="2 3"
                  opacity={0.5}
                />
                <circle cx={x} cy={PAD_T - 8} r={3} fill={color} />
                <text
                  x={x}
                  y={PAD_T - 16 - stagger}
                  textAnchor="middle"
                  className="font-mono"
                  fontSize={9}
                  fill={color}
                  letterSpacing="0.08em"
                >
                  <tspan x={x} dy={0}>
                    {e.year}
                  </tspan>
                  <tspan x={x} dy={11} fill="var(--fg-secondary)" letterSpacing="0.04em">
                    {e.label}
                  </tspan>
                </text>
              </g>
            );
          })}

          {/* sighting bars (corpus data) */}
          {yearsList.map((y) => {
            const count = yearCounts[y] ?? 0;
            if (count === 0) return null;
            const x = xFor(y);
            const barH = (count / maxCount) * innerH;
            const yPos = PAD_T + innerH - barH;
            const isSelected = selectedYear === y;
            return (
              <g
                key={y}
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedYear(isSelected ? null : y)}
              >
                <rect
                  x={x - 3}
                  y={yPos}
                  width={6}
                  height={barH}
                  fill={isSelected ? "var(--cyan)" : "var(--amber)"}
                  opacity={isSelected ? 1 : 0.85}
                />
                {count >= maxCount * 0.5 && (
                  <text
                    x={x}
                    y={yPos - 6}
                    textAnchor="middle"
                    className="font-mono"
                    fontSize={9}
                    fill="var(--amber)"
                    fontWeight="500"
                  >
                    {count}
                  </text>
                )}
                {/* hover hit area */}
                <rect
                  x={x - 8}
                  y={PAD_T}
                  width={16}
                  height={innerH}
                  fill="transparent"
                />
              </g>
            );
          })}

          {/* y-axis labels */}
          {[0, 0.5, 1].map((t) => (
            <text
              key={t}
              x={PAD_L - 6}
              y={PAD_T + innerH * (1 - t) + 3}
              textAnchor="end"
              className="font-mono"
              fontSize={9}
              fill="var(--fg-muted)"
              letterSpacing="0.06em"
            >
              {Math.round(maxCount * t)}
            </text>
          ))}
        </svg>
      </div>

      <div
        className="font-mono mt-3"
        style={{
          fontSize: "10px",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--fg-muted)",
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <span>
          <span style={{ display: "inline-block", width: "8px", height: "8px", background: "var(--amber)", marginRight: "6px" }} />
          corpus sighting
        </span>
        <span>
          <span style={{ display: "inline-block", width: "8px", height: "8px", background: "var(--cyan)", marginRight: "6px" }} />
          institutional milestone
        </span>
        <span>
          <span style={{ display: "inline-block", width: "8px", height: "8px", background: "var(--status-anomaly)", marginRight: "6px" }} />
          public release event
        </span>
        <span style={{ marginLeft: "auto" }}>click a bar to filter ↓</span>
      </div>

      {selectedYear !== null && (
        <div className="mt-8">
          <div
            className="font-mono mb-3"
            style={{
              fontSize: "11px",
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "var(--cyan)",
            }}
          >
            {selectedYear} · {yearsInSelection.length} sighting{yearsInSelection.length === 1 ? "" : "s"}
          </div>
          <div className="flex flex-col gap-3">
            {yearsInSelection.map((s) => (
              <Link
                key={s.id}
                href={`/reports/${s.doc_id}`}
                className="panel block"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  padding: "12px 16px",
                }}
              >
                <span className="br tl" />
                <span className="br tr" />
                <span className="br bl" />
                <span className="br br2" />
                <div className="flex items-center justify-between gap-3 flex-wrap mb-2">
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
                      {s.shape !== "unknown" ? s.shape : "sighting"}
                    </span>
                    <span style={{ fontSize: "11px", color: "var(--fg-muted)" }}>
                      {s.occurred_at?.slice(0, 10)} · {s.location_text ?? "—"}
                    </span>
                  </div>
                  {s.is_aviator && (
                    <span
                      className="font-mono"
                      style={{
                        fontSize: "9px",
                        letterSpacing: "0.18em",
                        color: "var(--amber)",
                      }}
                    >
                      AVIATOR
                    </span>
                  )}
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "var(--fg-primary)",
                    lineHeight: 1.5,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {s.summary}
                </div>
              </Link>
            ))}
            {yearsInSelection.length === 0 && (
              <div
                className="font-mono py-6 text-center"
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.22em",
                  color: "var(--fg-muted)",
                  border: "1px dashed var(--border-strong)",
                  borderRadius: "var(--r-md)",
                }}
              >
                NO CORPUS SIGHTINGS RECORDED FOR THIS YEAR
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
