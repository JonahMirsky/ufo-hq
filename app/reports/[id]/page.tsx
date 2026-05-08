import Link from "next/link";
import { notFound } from "next/navigation";
import { TopNav } from "../../../components/TopNav";
import { Panel } from "../../../components/Panel";
import { getDocument, getSightingsForDoc, loadDocuments } from "../../../lib/data";
import { AGENCY_COLORS, isOcrPending, shortId } from "../../../lib/format";

export const dynamicParams = true;

export async function generateStaticParams() {
  const docs = await loadDocuments();
  return docs.map((d) => ({ id: d.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const doc = await getDocument(id);
  if (!doc) return { title: "Not Found — UFO HQ" };
  return {
    title: `${doc.title} — UFO HQ`,
    description: doc.summary,
  };
}

export default async function ReportReader({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const doc = await getDocument(id);
  if (!doc) notFound();
  const sightings = await getSightingsForDoc(id);
  const accent = AGENCY_COLORS[doc.agency] ?? "var(--fg-muted)";
  const ocrPending = isOcrPending(doc.summary);

  return (
    <>
      <TopNav />
      <div className="max-w-[1440px] mx-auto px-6 py-8">
        <Link href="/reports" className="btn btn-ghost btn-sm btn-back mb-6">
          <span className="btn-arrow" aria-hidden>←</span>
          <span>BACK TO LIBRARY</span>
        </Link>

        {/* Header strip */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <span className="p-id">{shortId(doc.id)}</span>
            <span
              className="font-mono"
              style={{
                fontSize: "10px",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: accent,
                border: `1px solid ${accent}`,
                padding: "3px 8px",
                borderRadius: "4px",
              }}
            >
              {doc.agency}
            </span>
            <span
              className="font-mono"
              style={{
                fontSize: "10px",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--fg-muted)",
              }}
            >
              {doc.document_type.replace(/_/g, " ")}
            </span>
            {doc.classification_at_creation && doc.classification_at_creation !== "unclassified" && (
              <span
                className="font-mono"
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "var(--status-anomaly)",
                  border: "1px solid var(--status-anomaly)",
                  padding: "3px 8px",
                  borderRadius: "4px",
                  textDecoration: "line-through",
                }}
              >
                {doc.classification_at_creation}
                {doc.classification_caveats?.length
                  ? "//" + doc.classification_caveats.join("/")
                  : ""}
              </span>
            )}
          </div>
          <h1
            className="font-display"
            style={{
              fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
              fontWeight: 500,
              lineHeight: 1.15,
              letterSpacing: "-0.01em",
            }}
          >
            {doc.title}
          </h1>
          {ocrPending && (
            <div
              className="font-mono mt-3"
              style={{
                fontSize: "10px",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "var(--status-anomaly)",
                background: "rgba(198, 69, 69,0.08)",
                border: "1px solid var(--status-anomaly)",
                padding: "8px 12px",
                borderRadius: "var(--r-sm)",
                display: "inline-block",
              }}
            >
              ⚠ OCR pending — encrypted scan, content extracted is metadata only.
              Open at source for full document.
            </div>
          )}
        </div>

        {/* 60/40 split */}
        <div
          className="grid gap-6"
          style={{ gridTemplateColumns: "minmax(0, 3fr) minmax(0, 2fr)" }}
        >
          {/* Source PDF panel */}
          <div style={{ position: "sticky", top: 80, alignSelf: "flex-start" }}>
            <Panel id="PDF-01" title="Source Document">
              <div
                style={{
                  background: "var(--bg-void)",
                  borderRadius: "var(--r-sm)",
                  border: "1px solid var(--border-faint)",
                  padding: "32px 24px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  gap: "16px",
                  minHeight: "320px",
                  justifyContent: "center",
                }}
              >
                <div
                  className="font-mono"
                  style={{
                    fontSize: "9px",
                    letterSpacing: "0.32em",
                    textTransform: "uppercase",
                    color: "var(--fg-muted)",
                  }}
                >
                  PDF · {doc.page_count} page{doc.page_count === 1 ? "" : "s"}
                  {doc.redaction_pct > 0 && ` · ${doc.redaction_pct}% redacted`}
                </div>
                <div
                  className="font-display"
                  style={{
                    fontSize: "20px",
                    fontWeight: 500,
                    lineHeight: 1.3,
                    color: "var(--fg-primary)",
                    maxWidth: "320px",
                  }}
                >
                  {doc.title}
                </div>
                <a
                  href={doc.pdf_url}
                  target="_blank"
                  rel="noopener"
                  className="btn btn-primary"
                  style={{ marginTop: "8px" }}
                >
                  <span>OPEN AT SOURCE</span>
                  <span className="btn-arrow" aria-hidden>↗</span>
                </a>
                <div
                  className="font-mono"
                  style={{
                    fontSize: "9px",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "var(--fg-muted)",
                    marginTop: "4px",
                  }}
                >
                  served by {new URL(doc.pdf_url).host} · we don&apos;t host PDFs
                </div>
              </div>

              {/* Redaction visualization */}
              {doc.redaction_pct > 0 && (
                <div className="mt-4">
                  <div
                    className="font-mono mb-2"
                    style={{
                      fontSize: "9px",
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      color: "var(--fg-muted)",
                    }}
                  >
                    Redaction density
                  </div>
                  <div
                    style={{
                      height: "12px",
                      borderRadius: "2px",
                      background: "var(--bg-elevated)",
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        width: `${doc.redaction_pct}%`,
                        height: "100%",
                        background: "var(--status-anomaly)",
                        opacity: 0.7,
                      }}
                    />
                  </div>
                  <div
                    className="font-mono mt-1 flex justify-between"
                    style={{
                      fontSize: "9px",
                      color: "var(--fg-muted)",
                      letterSpacing: "0.12em",
                    }}
                  >
                    <span>{doc.redaction_pct}% redacted</span>
                    <span>{100 - doc.redaction_pct}% visible</span>
                  </div>
                </div>
              )}
            </Panel>
          </div>

          {/* Side panel */}
          <div className="flex flex-col gap-4">
            <Panel id="SUM-01" title="Summary">
              <p style={{ fontSize: "14px", lineHeight: 1.6, color: "var(--fg-primary)" }}>
                {doc.summary}
              </p>
            </Panel>

            {doc.key_findings?.length > 0 && (
              <Panel id="KEY-01" title="Key Findings">
                <ul className="flex flex-col gap-3">
                  {doc.key_findings.map((finding, i) => (
                    <li
                      key={i}
                      style={{
                        fontSize: "13px",
                        lineHeight: 1.5,
                        color: "var(--fg-secondary)",
                        borderLeft: "1px solid var(--amber-glow)",
                        paddingLeft: "12px",
                      }}
                    >
                      {finding}
                    </li>
                  ))}
                </ul>
              </Panel>
            )}

            {sightings.length > 0 && (
              <Panel
                id={`SGT-${sightings.length.toString().padStart(2, "0")}`}
                title="Sightings"
                subtitle={`${sightings.length} aerial-object observation${sightings.length === 1 ? "" : "s"}`}
              >
                <div className="flex flex-col gap-3">
                  {sightings.map((s, i) => (
                    <SightingMini key={s.id} sighting={s} index={i + 1} />
                  ))}
                </div>
              </Panel>
            )}

            <Panel id="ENT-01" title="Entities">
              <EntityChips label="Locations" items={doc.location_refs} />
              <EntityChips label="Units" items={doc.unit_refs} />
              <EntityChips label="Operations" items={doc.operation_refs} />
              <EntityChips label="Platforms" items={doc.platform_refs} />
              <EntityChips label="Agencies" items={doc.agency_refs} />
            </Panel>

            {doc.notable_quotes?.length > 0 && (
              <Panel id="QUO-01" title="Notable Quotes">
                <div className="flex flex-col gap-3">
                  {doc.notable_quotes.map((q, i) => (
                    <blockquote
                      key={i}
                      className="font-serif italic"
                      style={{
                        fontSize: "16px",
                        lineHeight: 1.5,
                        color: "var(--fg-primary)",
                        borderLeft: "2px solid var(--amber)",
                        paddingLeft: "16px",
                        margin: 0,
                      }}
                    >
                      “{q}”
                    </blockquote>
                  ))}
                </div>
              </Panel>
            )}

            <Panel id="PROV-01" title="Provenance">
              <dl className="grid grid-cols-2 gap-3" style={{ fontSize: "12px" }}>
                <ProvRow label="Published" value={doc.published_at} />
                <ProvRow label="Authored" value={doc.date_authored} />
                <ProvRow
                  label="Lag"
                  value={doc.lag_years !== null ? `${doc.lag_years.toFixed(1)} yr` : null}
                />
                <ProvRow label="Pages" value={String(doc.page_count)} />
                <ProvRow label="Redaction" value={`${doc.redaction_pct}%`} />
                <ProvRow label="External ID" value={doc.external_id} />
                <ProvRow label="Declassified" value={doc.declassified_date} />
                <ProvRow label="Released to" value={doc.approved_for_release_to} />
              </dl>
              {doc.declassified_by && (
                <div
                  style={{
                    marginTop: "12px",
                    paddingTop: "12px",
                    borderTop: "1px solid var(--border-faint)",
                    fontSize: "12px",
                    color: "var(--fg-secondary)",
                  }}
                >
                  Declassified by{" "}
                  <span style={{ color: "var(--fg-primary)" }}>{doc.declassified_by}</span>
                </div>
              )}
              {doc.redaction_codes?.length > 0 && (
                <div
                  style={{
                    marginTop: "12px",
                    fontSize: "10px",
                    fontFamily: "var(--font-mono)",
                    letterSpacing: "0.12em",
                    color: "var(--fg-muted)",
                  }}
                >
                  Exemptions: {doc.redaction_codes.join(" · ")}
                </div>
              )}
            </Panel>
          </div>
        </div>
      </div>
    </>
  );
}

function ProvRow({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <div
        className="font-mono"
        style={{
          fontSize: "9px",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "var(--fg-muted)",
        }}
      >
        {label}
      </div>
      <div style={{ color: value ? "var(--fg-primary)" : "var(--fg-disabled)" }}>
        {value ?? "—"}
      </div>
    </div>
  );
}

function EntityChips({ label, items }: { label: string; items?: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="mb-3 last:mb-0">
      <div
        className="font-mono mb-2"
        style={{
          fontSize: "9px",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "var(--fg-muted)",
        }}
      >
        {label}
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            style={{
              fontSize: "11px",
              padding: "3px 10px",
              borderRadius: "4px",
              border: "1px solid var(--border-strong)",
              color: "var(--fg-secondary)",
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function SightingMini({
  sighting,
  index,
}: {
  sighting: import("../../../lib/types").Sighting;
  index: number;
}) {
  return (
    <div
      style={{
        background: "var(--bg-elevated)",
        borderRadius: "var(--r-sm)",
        border: "1px solid var(--border-faint)",
        padding: "12px",
      }}
    >
      <div className="flex items-baseline gap-3 mb-2">
        <span
          className="font-mono"
          style={{
            fontSize: "9px",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--amber)",
          }}
        >
          SGT-{String(index).padStart(2, "0")}
        </span>
        <span
          className="font-mono"
          style={{
            fontSize: "10px",
            letterSpacing: "0.12em",
            color: "var(--fg-muted)",
          }}
        >
          {sighting.occurred_at?.slice(0, 10) ?? "—"} · {sighting.location_text ?? "—"}
        </span>
      </div>
      <p style={{ fontSize: "12px", lineHeight: 1.5, color: "var(--fg-primary)", margin: 0 }}>
        {sighting.summary}
      </p>
      <div
        className="flex flex-wrap gap-2 mt-2 font-mono"
        style={{
          fontSize: "9px",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--fg-muted)",
        }}
      >
        {sighting.shape && sighting.shape !== "unknown" && (
          <span style={{ color: "var(--cyan)" }}>shape · {sighting.shape}</span>
        )}
        {sighting.altitude_ft !== null && <span>alt · {sighting.altitude_ft} ft</span>}
        {sighting.evidence_types?.length > 0 && (
          <span>evidence · {sighting.evidence_types.join(" / ")}</span>
        )}
        {sighting.is_aviator && <span style={{ color: "var(--amber)" }}>aviator witness</span>}
      </div>
    </div>
  );
}
