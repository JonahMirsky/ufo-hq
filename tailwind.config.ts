import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "var(--bg-void)",
        panel: "var(--bg-panel)",
        elevated: "var(--bg-elevated)",
        overlay: "var(--bg-overlay)",
        amber: { DEFAULT: "var(--amber)", soft: "var(--amber-soft)", glow: "var(--amber-glow)" },
        cyan: { DEFAULT: "var(--cyan)", soft: "var(--cyan-soft)", glow: "var(--cyan-glow)" },
        fg: {
          primary: "var(--fg-primary)",
          secondary: "var(--fg-secondary)",
          muted: "var(--fg-muted)",
          disabled: "var(--fg-disabled)",
        },
        border: { faint: "var(--border-faint)", strong: "var(--border-strong)", rail: "var(--border-rail)" },
        status: {
          resolved: "var(--status-resolved)",
          anomaly: "var(--status-anomaly)",
          pending: "var(--status-pending)",
          monitoring: "var(--status-monitoring)",
        },
      },
      fontFamily: {
        display: "var(--font-display)",
        serif: "var(--font-serif)",
        body: "var(--font-body)",
        mono: "var(--font-mono)",
      },
      borderRadius: {
        sm: "var(--r-sm)",
        md: "var(--r-md)",
        lg: "var(--r-lg)",
        xl: "var(--r-xl)",
      },
      transitionTimingFunction: {
        cosmic: "cubic-bezier(0.16, 1, 0.3, 1)",
        arrival: "cubic-bezier(0.7, 0, 0.3, 1)",
      },
    },
  },
};
export default config;
