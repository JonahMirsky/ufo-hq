interface Entry {
  label: string;
  count: number;
}

const COLOR_MAP: Record<string, string> = {
  visual: "var(--plasma)",
  video: "var(--amber)",
  photographic: "var(--unknown)",
  infrared: "var(--verified)",
  radar: "var(--classified)",
  audio: "var(--plasma-700)",
  "physical trace": "var(--ink-glow)",
  "electronic signature": "var(--moondust)",
};

export function EvidenceDonut({
  entries,
  total,
}: {
  entries: Entry[];
  total: number;
}) {
  const sorted = [...entries].sort((a, b) => b.count - a.count);
  const tagSum = sorted.reduce((s, e) => s + e.count, 0);
  if (tagSum === 0) {
    return <div>No data</div>;
  }
  const C = 2 * Math.PI * 38; // circumference of r=38 ring
  let offset = 0;
  return (
    <div className="donut">
      <div className="ring">
        <svg viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="38"
            fill="none"
            stroke="var(--meridian)"
            strokeWidth="14"
          />
          {sorted.map((e) => {
            const len = (e.count / tagSum) * C;
            const stroke = COLOR_MAP[e.label] ?? "var(--moondust)";
            const seg = (
              <circle
                key={e.label}
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke={stroke}
                strokeWidth="14"
                strokeDasharray={`${len} ${C - len}`}
                strokeDashoffset={-offset}
                transform="rotate(-90 50 50)"
              />
            );
            offset += len;
            return seg;
          })}
        </svg>
        <div className="ctr">
          <div className="big">{total}</div>
          <div className="sub">Sightings</div>
        </div>
      </div>
      <div className="legend">
        {sorted.map((e) => {
          const pct = ((e.count / tagSum) * 100).toFixed(1);
          return (
            <div className="row" key={e.label}>
              <div
                className="sb"
                style={{ background: COLOR_MAP[e.label] ?? "var(--moondust)" }}
              />
              <div className="lb">{e.label}</div>
              <div className="pc">
                {e.count} · {pct}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
