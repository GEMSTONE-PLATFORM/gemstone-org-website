import type { Metadata } from "next";

import { michroma } from "@/app/fonts";
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
      <body className={michroma.variable}>{children}</body>
    </html>
  );
}
