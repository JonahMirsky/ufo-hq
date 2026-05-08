"use client";

import { useMemo } from "react";

export function SightingsByYear({ byYear }: { byYear: Record<string, number> }) {
  const entries = useMemo(() => {
    const yrs = Object.keys(byYear)
      .map(Number)
      .filter((y) => !isNaN(y))
      .sort((a, b) => a - b);
    if (yrs.length === 0) return [];
    const first = yrs[0];
    const last = yrs[yrs.length - 1];
    const out: { year: number; count: number }[] = [];
    for (let y = first; y <= last; y++) {
      out.push({ year: y, count: byYear[String(y)] ?? 0 });
    }
    return out;
  }, [byYear]);

  if (entries.length === 0) {
    return (
      <div
        className="font-mono text-center py-8"
        style={{
          fontSize: "10px",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "var(--fg-muted)",
        }}
      >
        AWAITING TEMPORAL DATA
      </div>
    );
  }

  const maxCount = Math.max(...entries.map((e) => e.count));
  const W = 800;
  const H = 220;
  const PAD_L = 36;
  const PAD_R = 16;
  const PAD_T = 16;
  const PAD_B = 28;
  const innerW = W - PAD_L - PAD_R;
  const innerH = H - PAD_T - PAD_B;

  // Linear x
  const xFor = (i: number) =>
    PAD_L + (entries.length === 1 ? innerW / 2 : (i / (entries.length - 1)) * innerW);
  const yFor = (count: number) => PAD_T + innerH - (count / maxCount) * innerH;

  // Build path + area
  const linePath = entries
    .map((e, i) => `${i === 0 ? "M" : "L"} ${xFor(i)} ${yFor(e.count)}`)
    .join(" ");
  const areaPath =
    `M ${xFor(0)} ${PAD_T + innerH} ` +
    entries.map((e, i) => `L ${xFor(i)} ${yFor(e.count)}`).join(" ") +
    ` L ${xFor(entries.length - 1)} ${PAD_T + innerH} Z`;

  // Annotations: peak years (top 3, marked cyan)
  const sortedByCount = [...entries].sort((a, b) => b.count - a.count).slice(0, 3);
  const peakYears = new Set(sortedByCount.map((e) => e.year));

  // X-axis ticks: roughly 6
  const tickStep = Math.max(1, Math.floor(entries.length / 6));
  const ticks = entries.filter((_, i) => i % tickStep === 0 || i === entries.length - 1);

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "auto" }}>
        <defs>
          <linearGradient id="amberFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--amber)" stopOpacity="0.30" />
            <stop offset="100%" stopColor="var(--amber)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* horizontal grid lines */}
        {[0.25, 0.5, 0.75, 1].map((t) => (
          <line
            key={t}
            x1={PAD_L}
            x2={W - PAD_R}
            y1={PAD_T + innerH * (1 - t)}
            y2={PAD_T + innerH * (1 - t)}
            stroke="var(--grid-line-bright)"
            strokeWidth={0.5}
            strokeDasharray="2 4"
            opacity={0.5}
          />
        ))}

        {/* area + line */}
        <path d={areaPath} fill="url(#amberFill)" />
        <path d={linePath} fill="none" stroke="var(--amber)" strokeWidth={1.5} />

        {/* peak markers */}
        {entries
          .filter((e) => peakYears.has(e.year))
          .map((e, i) => {
            const x = xFor(entries.findIndex((x) => x.year === e.year));
            const y = yFor(e.count);
            return (
              <g key={`peak-${e.year}`}>
                <line
                  x1={x}
                  x2={x}
                  y1={PAD_T}
                  y2={PAD_T + innerH}
                  stroke="var(--cyan)"
                  strokeWidth={0.5}
                  strokeDasharray="2 3"
                  opacity={0.6}
                />
                <circle cx={x} cy={y} r={3} fill="var(--cyan)" />
                <text
                  x={x}
                  y={PAD_T - 4}
                  textAnchor="middle"
                  className="font-mono"
                  fontSize={9}
                  letterSpacing="0.1em"
                  fill="var(--cyan)"
                >
                  {e.year} · {e.count}
                </text>
              </g>
            );
          })}

        {/* x-axis ticks */}
        {ticks.map((e) => {
          const i = entries.findIndex((x) => x.year === e.year);
          return (
            <text
              key={e.year}
              x={xFor(i)}
              y={H - 8}
              textAnchor="middle"
              className="font-mono"
              fontSize={9}
              fill="var(--fg-muted)"
              letterSpacing="0.06em"
            >
              {e.year}
            </text>
          );
        })}

        {/* y-axis ticks */}
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
  );
}
