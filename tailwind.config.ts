import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0B0B0F",
        mist: "#F5F1E7",
        primary: "#1A1A1F",
        accent: "#C9A54C",
        danger: "#C24141"
      },
      fontFamily: {
        sans: ["var(--font-sans)"]
      },
      boxShadow: {
        panel: "0 18px 50px rgba(15, 23, 42, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
