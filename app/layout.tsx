import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UFO HQ — An archive of the unresolved",
  description:
    "Every document the United States government released about UAP in October 2025, structured.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
