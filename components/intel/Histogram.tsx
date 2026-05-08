interface Entry {
  label: string;
  count: number;
}

export function Histogram({
  entries,
  tone = "cy",
  emphasizeMax = false,
  height = 130,
}: {
  entries: Entry[];
  tone?: "cy" | "am" | "un";
  emphasizeMax?: boolean;
  height?: number;
}) {
  if (entries.length === 0 || entries.every((e) => e.count === 0)) {
    return (
      <div
        className="font-mono py-6 text-center"
        style={{
          fontSize: "10px",
          letterSpacing: "0.22em",
          color: "var(--penumbra)",
          textTransform: "uppercase",
        }}
      >
        Awaiting data
      </div>
    );
  }
  const max = Math.max(...entries.map((e) => e.count));
  const maxLabel = entries.reduce((p, c) => (c.count > p.count ? c : p), entries[0]).label;
  return (
    <>
      <div className="hist" style={{ height: `${height}px` }}>
        {entries.map((e) => {
          const h = max > 0 ? (e.count / max) * 100 : 0;
          const isMax = emphasizeMax && e.label === maxLabel;
          const cls = isMax ? "am" : tone === "am" ? "am" : tone === "un" ? "un" : "";
          return (
            <span
              key={e.label}
              className={cls}
              style={{ height: `${Math.max(h, 1.5)}%` }}
              title={`${e.label}: ${e.count}`}
            />
          );
        })}
      </div>
      <div className="hist-axis">
        {entries.map((e) => (
          <span key={`a-${e.label}`}>{e.label}</span>
        ))}
      </div>
    </>
  );
}
