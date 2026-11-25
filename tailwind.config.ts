import type { Config } from "tailwindcss";

const config: Config = {
  // Light only: the design is a paper-and-ink system with one dark band. Existing `dark:` classes stay inert.
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F4F6FA",
        surface: "#FFFFFF",
        ink: "#0A0F24",
        navy: "#070B1C",
        soft: "#EAEEF5",
        border: "#D9DFEA",
        line: "#D9DFEA",
        muted: "#566080",
        body: "#2B3350",
        blue: "#1B47FF",
        violet: "#7C4DFF",
        cyan: "#00B8D4",
        coral: "#FF5A79",
        mint: "#12B886",
        amber: "#FFB833",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      maxWidth: { page: "80rem" },
      transitionTimingFunction: { out: "cubic-bezier(0.22, 1, 0.36, 1)" },
    },
  },
  plugins: [],
};
export default config;
