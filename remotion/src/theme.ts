// Murmura Labs design tokens — kept in sync with src/index.css

export const COLORS = {
  linen: "#FFE4CC",
  sand: "#c6a181",
  driftwood: "#7f5e46",
  walnut: "#3f2a1c",
  espresso: "#190f0a",
  emerald: {
    bg: "rgba(16, 185, 129, 0.15)",
    border: "rgba(16, 185, 129, 0.3)",
    text: "#047857",
    dot: "#10b981",
  },
} as const;

export const FONTS = {
  display: "Quicksand, system-ui, sans-serif",
  sans: "Inter, system-ui, sans-serif",
  mono: "JetBrains Mono, ui-monospace, monospace",
} as const;
