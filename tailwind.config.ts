import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: {
          950: "#f5f1e8",
          900: "#ece7da",
          800: "#ddd6c5",
          700: "#cbc3ae",
          600: "#a39c89",
        },
        ink: {
          DEFAULT: "#0d0d18",
          dim: "#3f3d4a",
          mute: "#7a7787",
        },
        electric: "#2842e6",
        violet: "#6d28d9",
        plasma: "#5b21b6",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.06em",
      },
      animation: {
        "spin-slow": "spin 24s linear infinite",
        "pulse-slow": "pulse 6s cubic-bezier(0.4,0,0.6,1) infinite",
        marquee: "marquee 40s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
