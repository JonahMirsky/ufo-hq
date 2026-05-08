"use client";

import { useEffect, useState } from "react";

export function TelemetryStrip({
  docCount,
  sightingCount,
  generatedAt,
}: {
  docCount: number;
  sightingCount: number;
  generatedAt: string;
}) {
  const [now, setNow] = useState<string>("");

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const utc = d.toISOString().slice(11, 19);
      setNow(utc);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const generatedDate = generatedAt.slice(0, 10);

  return (
    <div
      className="font-mono"
      style={{
        background: "var(--bg-panel)",
        borderBottom: "1px solid var(--border-faint)",
        padding: "6px 24px",
        fontSize: "9px",
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: "var(--fg-muted)",
        display: "flex",
        gap: "20px",
        flexWrap: "wrap",
        alignItems: "center",
        position: "relative",
        zIndex: 25,
      }}
    >
      <span className="flex items-center gap-2">
        <span className="status-dot" style={{ background: "var(--status-resolved)", boxShadow: "0 0 4px var(--status-resolved)" }} />
        <span style={{ color: "var(--fg-secondary)" }}>SYS NOMINAL</span>
      </span>
      <span>CORPUS v0.1</span>
      <span>
        DOCS · <span style={{ color: "var(--amber)" }}>{docCount}</span>
      </span>
      <span>
        SIGHTINGS · <span style={{ color: "var(--cyan)" }}>{sightingCount}</span>
      </span>
      <span>SOURCE · WAR.GOV/UFO</span>
      <span>SYNC · {generatedDate}</span>
      <span style={{ marginLeft: "auto" }} suppressHydrationWarning>
        UTC <span style={{ color: "var(--fg-secondary)", fontVariantNumeric: "tabular-nums" }}>
          {now || "--:--:--"}
        </span>
      </span>
    </div>
  );
}
