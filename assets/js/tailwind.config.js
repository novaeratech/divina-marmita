/* ============================================================
   SANTO DOCE — Tailwind Play CDN config
   Deve ser carregado APÓS o script do CDN do Tailwind.
   Mapeia os tokens da marca para utilitários do Tailwind.
   ============================================================ */
tailwind.config = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0E5A43",
          dark: "#0A4835",
          soft: "#E7F0EC",
        },
        gold: {
          DEFAULT: "#C99A2E",
          dark: "#A87F1F",
          soft: "#F6EDD6",
        },
        background: "#F7F1EB",
        surface: "#EFE5DA",
        accent: "#8E6847",
        ink: {
          DEFAULT: "#2D2D2D", // text primary
          soft: "#5C5C5C",    // text secondary
        },
        line: {
          DEFAULT: "#E3D8CB",
          strong: "#D8C9B8",
        },
        success: { DEFAULT: "#4E8F5B", soft: "#E8F3EB" },
        error: { DEFAULT: "#D64545", soft: "#FBEAEA" },
      },
      fontFamily: {
        heading: ['"Cormorant Garamond"', "Georgia", "serif"],
        body: ['"Poppins"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      fontSize: {
        display: ["4rem", { lineHeight: "1.1", fontWeight: "700" }],
        h1: ["3.5rem", { lineHeight: "1.15", fontWeight: "700" }],
        h2: ["2.625rem", { lineHeight: "1.2", fontWeight: "600" }],
        h3: ["2.125rem", { lineHeight: "1.2", fontWeight: "600" }],
        h4: ["1.75rem", { lineHeight: "1.25", fontWeight: "600" }],
        h5: ["1.5rem", { lineHeight: "1.3", fontWeight: "600" }],
        "body-lg": ["1.25rem", { lineHeight: "1.6" }],
        body: ["1.125rem", { lineHeight: "1.6" }],
        "body-sm": ["1rem", { lineHeight: "1.6" }],
        caption: ["0.875rem", { lineHeight: "1.5" }],
      },
      spacing: {
        1: "4px",
        2: "8px",
        3: "16px",
        4: "24px",
        5: "32px",
        6: "40px",
        7: "48px",
        8: "56px",
        9: "64px",
        10: "80px",
        11: "96px",
        12: "120px",
      },
      borderRadius: {
        xs: "4px",
        sm: "8px",
        md: "12px",
        lg: "20px",
        xl: "32px",
        full: "999px",
      },
      boxShadow: {
        xs: "0 1px 2px rgba(45,45,45,0.04)",
        sm: "0 2px 8px rgba(45,45,45,0.05)",
        md: "0 8px 24px rgba(45,45,45,0.06)",
        lg: "0 16px 40px rgba(45,45,45,0.08)",
      },
      maxWidth: {
        container: "1280px",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22, 0.61, 0.36, 1)",
      },
      transitionDuration: {
        250: "250ms",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 250ms cubic-bezier(0.22,0.61,0.36,1) both",
        "fade-up": "fade-up 300ms cubic-bezier(0.22,0.61,0.36,1) both",
        "scale-in": "scale-in 200ms cubic-bezier(0.22,0.61,0.36,1) both",
        "slide-in-right": "slide-in-right 300ms cubic-bezier(0.22,0.61,0.36,1) both",
      },
    },
  },
};
