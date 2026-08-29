import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#080B11",
        surface: {
          50: "#1A2234",
          100: "#141B2A",
          200: "#0F1522",
          300: "#0B0F19",
          DEFAULT: "#0F1522",
          elevated: "#182032",
          border: "#202B42",
          borderLight: "#2E3D5C",
        },
        brand: {
          cyan: "#00F0FF",
          gold: "#FFB800",
          crimson: "#FF334B",
          emerald: "#00E676",
          purple: "#9D4EDD",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "'Segoe UI'",
          "Roboto",
          "sans-serif",
        ],
        display: [
          "Rajdhani",
          "'Trebuchet MS'",
          "Impact",
          "sans-serif",
        ],
        mono: [
          "'JetBrains Mono'",
          "'SF Mono'",
          "Menlo",
          "Consolas",
          "monospace",
        ],
      },
      animation: {
        "pulse-subtle": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "live-glow": "liveGlow 2s ease-in-out infinite alternate",
        "glow-cyan": "glowCyan 2s ease-in-out infinite alternate",
      },
      keyframes: {
        liveGlow: {
          "0%": { boxShadow: "0 0 4px rgba(255, 51, 75, 0.4)" },
          "100%": { boxShadow: "0 0 14px rgba(255, 51, 75, 0.85)" },
        },
        glowCyan: {
          "0%": { boxShadow: "0 0 4px rgba(0, 240, 255, 0.3)" },
          "100%": { boxShadow: "0 0 12px rgba(0, 240, 255, 0.75)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
