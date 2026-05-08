import Link from "next/link";

export interface BarListEntry {
  label: string;
  count: number;
  rank?: string | number;
  code?: string;
  tone?: "cy" | "am" | "un" | "gn";
  href?: string;
}

export function BarList({ entries }: { entries: BarListEntry[] }) {
  if (entries.length === 0) {
    return (
      <div
        className="font-mono py-6 text-center"
        style={{
          fontSize: "10px",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "var(--penumbra)",
        }}
      >
        No data
      </div>
    );
  }
  const max = Math.max(...entries.map((e) => e.count));
  return (
    <div className="bar-list">
      {entries.map((e, i) => {
        const pct = max > 0 ? (e.count / max) * 100 : 0;
        const barClass = e.tone ? `${e.tone}` : "";
        const valClass = e.tone ?? "";
        const RowTag: React.ElementType = e.href ? Link : "div";
        const rowProps = e.href ? { href: e.href } : {};
        return (
          <RowTag
            key={`${e.label}-${i}`}
            className="bar-row"
            style={{
              ...(e.href
                ? { textDecoration: "none", color: "inherit", cursor: "pointer" }
                : {}),
            }}
            {...rowProps}
          >
            <span className="rank">{e.rank ?? ""}</span>
            <span className="name">{e.label}</span>
            <div className="bar">
              <span className={barClass} style={{ width: `${pct}%` }} />
            </div>
            <span className={`val ${valClass}`}>
              {e.count.toLocaleString()}
              {e.code && (
                <span
                  style={{
                    marginLeft: "8px",
                    color: "var(--penumbra)",
                    fontSize: "9px",
                    letterSpacing: "0.18em",
                  }}
                >
                  {e.code}
                </span>
              )}
            </span>
          </RowTag>
        );
      })}
    </div>
  );
}
