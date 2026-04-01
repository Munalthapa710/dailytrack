import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1D2433",
        mist: "#F4E6D2",
        primary: "#173B42",
        accent: "#D29A3A",
        danger: "#BE5B4B"
      },
      fontFamily: {
        sans: ["Aptos", "Trebuchet MS", "Segoe UI", "sans-serif"],
        display: ["Iowan Old Style", "Palatino Linotype", "Book Antiqua", "Georgia", "serif"]
      },
      boxShadow: {
        panel: "0 28px 80px rgba(20, 33, 52, 0.12)",
        lift: "0 18px 44px rgba(23, 59, 66, 0.18)"
      }
    }
  },
  plugins: []
};

export default config;
