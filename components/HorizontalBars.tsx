// Server-component-safe (no "use client" — pure rendering, no event handlers).

export interface BarEntry {
  label: string;
  count: number;
  /** Optional subdued tag rendered next to the label (e.g. ISO country code). */
  code?: string;
}

export function HorizontalBars({
  entries,
  total,
  accent = "var(--amber)",
  labelWidth = "minmax(110px, 180px)",
}: {
  entries: BarEntry[];
  total?: number;
  accent?: string;
  labelWidth?: string;
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
          <div
            key={e.label + (e.code ?? "")}
            className="grid items-center gap-3"
            style={{ gridTemplateColumns: `${labelWidth} 1fr 40px` }}
          >
            <div
              className="truncate flex items-baseline gap-2"
              style={{ fontSize: "12px", color: "var(--fg-primary)" }}
              title={e.label}
            >
              <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}>
                {e.label || "—"}
              </span>
              {e.code && (
                <span
                  className="font-mono"
                  style={{
                    fontSize: "9px",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "var(--fg-muted)",
                    flexShrink: 0,
                  }}
                >
                  {e.code}
                </span>
              )}
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
