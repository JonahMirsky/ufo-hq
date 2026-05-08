interface Entry {
  label: string;
  count: number;
}

const COLOR_MAP: Record<string, { fill: string; ink: string }> = {
  "white / silver": { fill: "#e8eaed", ink: "#001017" },
  metallic: { fill: "#5d6c8c", ink: "#fff" },
  "orange / amber": { fill: "var(--amber)", ink: "#1a0e00" },
  "red / crimson": { fill: "var(--classified)", ink: "#1a0000" },
  "dark / black": { fill: "#1a2238", ink: "var(--moondust)" },
  green: { fill: "var(--verified)", ink: "#00200f" },
  blue: { fill: "var(--plasma)", ink: "#001017" },
  "multi-color": { fill: "var(--unknown)", ink: "#150033" },
};

export function ColorStack({ entries }: { entries: Entry[] }) {
  const total = entries.reduce((s, e) => s + e.count, 0);
  if (total === 0) {
    return (
      <div
        className="font-mono py-4 text-center"
        style={{
          fontSize: "10px",
          letterSpacing: "0.22em",
          color: "var(--penumbra)",
        }}
      >
        Awaiting color data
      </div>
    );
  }
  return (
    <>
      <div className="color-stack" style={{ marginBottom: "10px" }}>
        {entries.map((e) => {
          const pct = (e.count / total) * 100;
          const c = COLOR_MAP[e.label] ?? { fill: "var(--meridian)", ink: "var(--moondust)" };
          return (
            <span
              key={e.label}
              style={{
                width: `${pct}%`,
                background: c.fill,
                color: c.ink,
              }}
              title={`${e.label}: ${e.count}`}
            >
              {pct >= 8 ? `${Math.round(pct)}%` : ""}
            </span>
          );
        })}
      </div>
      <div
        className="flex justify-between font-mono"
        style={{
          fontSize: "9px",
          color: "var(--moondust)",
          letterSpacing: "0.05em",
          marginBottom: "16px",
        }}
      >
        {entries.map((e) => (
          <span key={`c-${e.label}`}>{e.count}</span>
        ))}
      </div>
    </>
  );
}
