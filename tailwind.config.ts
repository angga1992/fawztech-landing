import type { Config } from "tailwindcss";

// Semua warna merujuk ke variabel di app/styles/tokens.css (sumber kebenaran).
const v = (name: string) => `var(--fawz-${name})`;

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./content/**/*.ts", "./lib/**/*.ts"],
  theme: {
    screens: {
      xs: "360px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1440px",
    },
    extend: {
      colors: {
        navy: { 900: v("navy-900"), 700: v("navy-700"), 500: v("navy-500") },
        amber: { 500: v("amber-500"), 200: v("amber-200") },
        teal: { 600: v("teal-600"), 400: v("teal-400") },
        mist: { 100: v("mist-100") },
        surface: {
          DEFAULT: v("surface"),
          raised: v("surface-raised"),
          sunken: v("surface-sunken"),
        },
        ink: { DEFAULT: v("ink"), muted: v("ink-muted") },
        line: { DEFAULT: v("line"), strong: v("line-strong") },
        action: v("action"),
        "on-action": v("on-action"),
        "on-accent": v("on-accent"),
        link: v("link"),
        focus: v("focus-ring"),
        danger: v("danger"),
      },
      borderRadius: {
        sm: v("radius-sm"),
        md: v("radius-md"),
        lg: v("radius-lg"),
        pill: "999px",
      },
      fontFamily: {
        sans: ["var(--fawz-font-sans)"],
        mono: ["var(--fawz-font-mono)"],
      },
      fontSize: {
        "display-xl": ["56px", { lineHeight: "60px", fontWeight: "800", letterSpacing: "-0.025em" }],
        "display-xl-sm": ["40px", { lineHeight: "44px", fontWeight: "800", letterSpacing: "-0.025em" }],
        "display-lg": ["40px", { lineHeight: "46px", fontWeight: "800", letterSpacing: "-0.02em" }],
        "display-lg-sm": ["32px", { lineHeight: "38px", fontWeight: "800", letterSpacing: "-0.02em" }],
        "display-md": ["28px", { lineHeight: "34px", fontWeight: "700", letterSpacing: "-0.01em" }],
        headline: ["20px", { lineHeight: "28px", fontWeight: "700" }],
        body: ["16px", { lineHeight: "26px", fontWeight: "400" }],
        "body-sm": ["14px", { lineHeight: "22px", fontWeight: "400" }],
        label: ["13px", { lineHeight: "18px", fontWeight: "600", letterSpacing: "0.01em" }],
        code: ["13px", { lineHeight: "20px", fontWeight: "500" }],
      },
      spacing: {
        header: "var(--header-h)",
      },
      maxWidth: {
        content: "1200px",
      },
    },
  },
  plugins: [],
};

export default config;
