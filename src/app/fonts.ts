import localFont from "next/font/local";

/**
 * Michroma is an OFL-licensed display typeface used for GEMSTONE headings.
 * The official GEMSTONE SVG logos remain the source of the Tachyon wordmark.
 */
export const michroma = localFont({
  src: "./fonts/michroma-regular.woff2",
  variable: "--font-michroma",
  display: "swap",
  weight: "400",
  style: "normal",
});
