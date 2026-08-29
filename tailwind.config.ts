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
        background: "#07090E",
        surface: {
          50: "#1A2234",
          100: "#121724",
          200: "#0D111A",
          300: "#080B12",
          DEFAULT: "#0D111A",
          elevated: "#182032",
          border: "#1C2438",
          borderLight: "#283450",
        },
        brand: {
          crimson: "#FF1E44",
          crimsonDark: "#D90429",
          crimsonLight: "#FF4D6D",
          ruby: "#E11D48",
          gold: "#F59E0B",
          emerald: "#10B981",
          cyan: "#06B6D4",
          purple: "#8B5CF6",
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
        "glow-crimson": "glowCrimson 2s ease-in-out infinite alternate",
      },
      keyframes: {
        liveGlow: {
          "0%": { boxShadow: "0 0 4px rgba(255, 30, 68, 0.4)" },
          "100%": { boxShadow: "0 0 16px rgba(255, 30, 68, 0.85)" },
        },
        glowCrimson: {
          "0%": { boxShadow: "0 0 4px rgba(255, 30, 68, 0.3)" },
          "100%": { boxShadow: "0 0 14px rgba(255, 30, 68, 0.75)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
