import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      // ====================================================================
      // BRAND TOKENS — no arbitrary values elsewhere
      // ====================================================================
      colors: {
        brand: {
          gold:       "#F59E0B",
          "gold-50":  "#FFFBEB",
          "gold-100": "#FEF3C7",
          "gold-200": "#FDE68A",
          "gold-300": "#FCD34D",
          "gold-400": "#FBBF24",
          "gold-500": "#F59E0B",
          "gold-600": "#D97706",
          "gold-700": "#B45309",
          "gold-800": "#92400E",
          "gold-900": "#78350F",
        },
        surface: {
          dark:       "#050505",
          darkAlt:    "#0A0A0A",
          darkCard:   "#111111",
          darkBorder: "#1F1F1F",
          darkHover:  "#2A2A2A",
        },
        neutral: {
          50:  "#FAFAFA",
          100: "#F5F5F5",
          200: "#E5E5E5",
          300: "#D4D4D4",
          400: "#A3A3A3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
          950: "#0A0A0A",
        },
      },

      // ====================================================================
      // TYPOGRAPHY TOKENS — Satoshi (display/headings), Inter (body/UI)
      // ====================================================================
      fontFamily: {
        display: ["Satoshi", "system-ui", "sans-serif"],
        body:    ["Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["4.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
        "display-lg": ["3.75rem", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
        "display-md": ["3rem",    { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "700" }],
        "display-sm": ["2.25rem", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "600" }],
        "heading-xl": ["2rem",    { lineHeight: "1.25", letterSpacing: "-0.01em", fontWeight: "600" }],
        "heading-lg": ["1.5rem",  { lineHeight: "1.3", letterSpacing: "0em",     fontWeight: "600" }],
        "heading-md": ["1.25rem", { lineHeight: "1.4", letterSpacing: "0em",     fontWeight: "600" }],
        "heading-sm": ["1.125rem",{ lineHeight: "1.4", letterSpacing: "0em",     fontWeight: "600" }],
        "body-lg":    ["1.125rem",{ lineHeight: "1.6", letterSpacing: "0em",     fontWeight: "400" }],
        "body-md":    ["1rem",    { lineHeight: "1.6", letterSpacing: "0em",     fontWeight: "400" }],
        "body-sm":    ["0.875rem",{ lineHeight: "1.5", letterSpacing: "0em",     fontWeight: "400" }],
        "caption":    ["0.75rem", { lineHeight: "1.5", letterSpacing: "0.02em",  fontWeight: "400" }],
      },
      fontWeight: {
        regular: "400",
        medium:  "500",
        semibold: "600",
        bold:    "700",
      },

      // ====================================================================
      // GRADIENTS
      // ====================================================================
      backgroundImage: {
        "gold-glow":     "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
        "dark-glow":     "linear-gradient(135deg, #1F1F1F 0%, #050505 100%)",
        "gold-fade":     "linear-gradient(180deg, #F59E0B 0%, rgba(245,158,11,0) 100%)",
        "gold-text":     "linear-gradient(135deg, #F59E0B 0%, #FCD34D 50%, #F59E0B 100%)",
        "card-gradient": "linear-gradient(135deg, #111111 0%, #0A0A0A 100%)",
      },

      // ====================================================================
      // RADII
      // ====================================================================
      borderRadius: {
        none:   "0",
        sm:     "0.25rem",
        md:     "0.375rem",
        lg:     "0.5rem",
        xl:     "0.75rem",
        "2xl":  "1rem",
        "3xl":  "1.25rem",
        "4xl":  "2rem",
        full:   "9999px",
      },

      // ====================================================================
      // SHADOWS
      // ====================================================================
      boxShadow: {
        "card":          "0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.6)",
        "card-hover":    "0 4px 6px rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.6)",
        "gold-glow":     "0 0 20px rgba(245,158,11,0.25), 0 0 40px rgba(245,158,11,0.1)",
        "gold-glow-lg":  "0 0 30px rgba(245,158,11,0.3), 0 0 60px rgba(245,158,11,0.15)",
        "elevated":      "0 10px 15px rgba(0,0,0,0.5), 0 4px 6px rgba(0,0,0,0.4)",
        "modal":         "0 20px 25px rgba(0,0,0,0.6), 0 10px 10px rgba(0,0,0,0.4)",
      },

      // ====================================================================
      // ANIMATION / TRANSITION
      // ====================================================================
      transitionDuration: {
        fast:   "150ms",
        normal: "300ms",
        slow:   "500ms",
      },
      transitionTimingFunction: {
        "out-expo":  "cubic-bezier(0.19, 1, 0.22, 1)",
        "in-out-cubic": "cubic-bezier(0.65, 0, 0.35, 1)",
      },
      keyframes: {
        slideLeft: {
          "0%": { transform: "translateX(1rem)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideRight: {
          "0%": { transform: "translateX(-1rem)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        menuIn: {
          "0%": { opacity: "0", transform: "translateX(-100%)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "slide-left": "slideLeft 300ms cubic-bezier(0.19, 1, 0.22, 1) forwards",
        "slide-right": "slideRight 300ms cubic-bezier(0.19, 1, 0.22, 1) forwards",
        "slide-in": "slideIn 300ms ease-out forwards",
        "menu-in": "menuIn 300ms ease-out forwards",
        marquee: "marquee 25s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
