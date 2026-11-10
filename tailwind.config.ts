import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
        "2xl": "3rem",
      },
    },
    extend: {
      colors: {
        gemstone: {
          bg: "rgb(var(--gemstone-bg-rgb) / <alpha-value>)",
          surface: "rgb(var(--gemstone-surface-rgb) / <alpha-value>)",
          "surface-raised": "rgb(var(--gemstone-surface-raised-rgb) / <alpha-value>)",
          "surface-elevated": "rgb(var(--gemstone-surface-elevated-rgb) / <alpha-value>)",
          cyan: "rgb(var(--gemstone-cyan-rgb) / <alpha-value>)",
          blue: "rgb(var(--gemstone-blue-rgb) / <alpha-value>)",
          accent: "rgb(var(--gemstone-accent-rgb) / <alpha-value>)",
          magenta: "rgb(var(--gemstone-magenta-rgb) / <alpha-value>)",
          text: "rgb(var(--gemstone-text-rgb) / <alpha-value>)",
          muted: "rgb(var(--gemstone-text-muted-rgb) / <alpha-value>)",
          subtle: "rgb(var(--gemstone-text-subtle-rgb) / <alpha-value>)",
          border: "rgb(var(--gemstone-border-rgb) / <alpha-value>)",
          focus: "rgb(var(--gemstone-focus-rgb) / <alpha-value>)",
          danger: "rgb(var(--gemstone-danger-rgb) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ["var(--gemstone-font-sans)"],
        display: ["var(--gemstone-font-display)"],
        mono: ["var(--gemstone-font-mono)"],
      },
      maxWidth: {
        gemstone: "var(--gemstone-content-max)",
        reading: "var(--gemstone-reading-max)",
      },
      spacing: {
        "gemstone-section": "var(--gemstone-section-space)",
      },
      borderRadius: {
        "gemstone-sm": "var(--gemstone-radius-sm)",
        gemstone: "var(--gemstone-radius-md)",
        "gemstone-lg": "var(--gemstone-radius-lg)",
      },
      boxShadow: {
        gemstone: "var(--gemstone-shadow-panel)",
        "gemstone-glow": "var(--gemstone-shadow-glow)",
      },
      backgroundImage: {
        "gemstone-grid":
          "linear-gradient(rgb(var(--gemstone-border-rgb) / 0.08) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--gemstone-border-rgb) / 0.08) 1px, transparent 1px)",
        "gemstone-network":
          "radial-gradient(circle at 12% 18%, rgb(var(--gemstone-cyan-rgb) / 0.18), transparent 22%), radial-gradient(circle at 86% 28%, rgb(var(--gemstone-blue-rgb) / 0.16), transparent 25%), radial-gradient(circle at 58% 82%, rgb(var(--gemstone-magenta-rgb) / 0.1), transparent 22%)",
      },
    },
  },
  plugins: [],
};

export default config;
