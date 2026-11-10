import type { Metadata } from "next";

import { assetConfig, siteConfig } from "@/config";
import { buildMetadata } from "@/lib/metadata";

import "./globals.css";

export const metadata: Metadata = buildMetadata(siteConfig, assetConfig);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
