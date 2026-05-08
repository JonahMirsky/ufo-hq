"use client";

export function HorizontalBars({
  entries,
  total,
  accent = "var(--amber)",
}: {
  entries: { label: string; count: number }[];
  total?: number;
  accent?: string;
}) {
  if (entries.length === 0) {
    return (
      <div
        className="font-mono text-center py-6"
        style={{
          fontSize: "10px",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "var(--fg-muted)",
        }}
      >
        NO DATA
      </div>
    );
  }
  const max = Math.max(...entries.map((e) => e.count));
  return (
    <div className="flex flex-col gap-2">
      {entries.map((e) => {
        const pct = (e.count / max) * 100;
        return (
          <div key={e.label} className="grid items-center gap-3" style={{ gridTemplateColumns: "minmax(80px, 140px) 1fr 40px" }}>
            <div
              className="font-mono truncate"
              style={{
                fontSize: "11px",
                letterSpacing: "0.06em",
                color: "var(--fg-secondary)",
                textTransform: "uppercase",
              }}
              title={e.label}
            >
              {e.label || "—"}
            </div>
            <div
              style={{
                background: "var(--bg-elevated)",
                height: "10px",
                borderRadius: "2px",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <div
                style={{
                  width: `${pct}%`,
                  height: "100%",
                  background: accent,
                  boxShadow: `0 0 8px ${accent}40`,
                  transition: "width 0.6s var(--ease-cosmic)",
                }}
              />
            </div>
            <div
              className="font-mono text-right"
              style={{ fontSize: "11px", color: "var(--fg-primary)", fontVariantNumeric: "tabular-nums" }}
            >
              {e.count}
            </div>
          </div>
        );
      })}
      {total !== undefined && (
        <div
          className="font-mono text-right mt-2"
          style={{
            fontSize: "9px",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--fg-muted)",
            borderTop: "1px solid var(--border-faint)",
            paddingTop: "8px",
          }}
        >
          n = {total}
        </div>
      )}
    </div>
  );
}
