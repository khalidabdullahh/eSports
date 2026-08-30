import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--background) / <alpha-value>)",
        surface: {
          50: "rgb(var(--surface-50) / <alpha-value>)",
          100: "rgb(var(--surface-100) / <alpha-value>)",
          200: "rgb(var(--surface-200) / <alpha-value>)",
          300: "rgb(var(--surface-300) / <alpha-value>)",
          DEFAULT: "rgb(var(--surface-200) / <alpha-value>)",
          elevated: "rgb(var(--surface-elevated) / <alpha-value>)",
          border: "rgb(var(--surface-border) / <alpha-value>)",
          borderLight: "rgb(var(--surface-border-light) / <alpha-value>)",
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
        "glow-crimson": "glowCrimson 2.5s ease-in-out infinite alternate",
      },
      keyframes: {
        glowCrimson: {
          "0%": { boxShadow: "0 0 15px rgba(255, 30, 68, 0.25)" },
          "100%": { boxShadow: "0 0 35px rgba(255, 30, 68, 0.55)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
