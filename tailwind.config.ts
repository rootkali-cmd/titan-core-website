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
        titan: {
          bg: "#09090b",
          metal: "#94a3b8",
          orange: "#f97316",
        },
      },
      fontFamily: {
        sans: ["var(--font-cairo)", "sans-serif"],
        display: ["var(--font-orbitron)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
