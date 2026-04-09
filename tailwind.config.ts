import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pro: {
          bg: "#0d1117",
          surface: "#161b22",
          card: "#1c2230",
          border: "#30363d",
          accent: "#00ff99",
          "accent-dim": "#00cc77",
          cyan: "#00e5ff",
          text: "#f0f0f5",
          muted: "rgba(255,255,255,0.4)",
          subtle: "rgba(255,255,255,0.12)",
        },
        nomade: {
          bg: "#faf7f0",
          surface: "#ffffff",
          card: "#fffdf7",
          border: "rgba(245,158,11,0.15)",
          accent: "#f59e0b",
          "accent-dim": "#d97706",
          teal: "#0d9488",
          coral: "#f97316",
          text: "#1c1917",
          muted: "#78716c",
          subtle: "rgba(28,25,23,0.08)",
        },
      },
      fontFamily: {
        mono: ["var(--font-mono)", "JetBrains Mono", "Fira Code", "monospace"],
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "cursor-blink": "blink 1s step-end infinite",
        float: "float 6s ease-in-out infinite",
        aurora: "aurora 5s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        aurora: {
          "0%, 100%": { opacity: "0.12", transform: "scale(1) translate(-50%, -50%)" },
          "50%": { opacity: "0.2", transform: "scale(1.1) translate(-47%, -47%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
