import type { Metadata } from "next";
import "./globals.css";
import { TelemetryStrip } from "../components/TelemetryStrip";
import { loadDocuments, loadMetrics, loadSightings } from "../lib/data";

export const metadata: Metadata = {
  title: "UFO HQ — An archive of the unresolved",
  description:
    "Every document the United States government released about UAP in October 2025, structured.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [docs, sightings, metrics] = await Promise.all([
    loadDocuments(),
    loadSightings(),
    loadMetrics(),
  ]);

  return (
    <html lang="en">
      <body>
        <TelemetryStrip
          docCount={docs.length}
          sightingCount={sightings.length}
          generatedAt={metrics.generated_at}
        />
        <main>{children}</main>
      </body>
    </html>
  );
}
