import Link from "next/link";

const NAV = [
  { href: "/media", label: "MEDIA" },
  { href: "/intel", label: "INTEL" },
  { href: "/timeline", label: "TIMELINE" },
  { href: "/reports", label: "REPORTS" },
  { href: "/search", label: "SEARCH" },
  { href: "/about", label: "ABOUT" },
];

export function TopNav() {
  return (
    <header
      className="sticky top-0 z-30"
      style={{
        background: "rgba(11,13,17,0.92)",
        borderBottom: "1px solid var(--border-faint)",
        backdropFilter: "saturate(180%)",
      }}
    >
      <div className="max-w-[1440px] mx-auto px-6 py-3 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="font-mono text-fg-primary"
          style={{
            fontSize: "12px",
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            textDecoration: "none",
          }}
        >
          UFO-HQ
        </Link>
        <nav className="flex items-center gap-6">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-mono"
              style={{
                fontSize: "11px",
                letterSpacing: "0.18em",
                color: "var(--fg-secondary)",
                textDecoration: "none",
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div
          className="hidden md:flex items-center gap-2"
          style={{ fontSize: "9px", color: "var(--fg-muted)" }}
        >
          <span className="status-dot amber" />
          <span style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.18em" }}>
            CORPUS v0.1
          </span>
        </div>
      </div>
    </header>
  );
}
