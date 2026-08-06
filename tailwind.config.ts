import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ember: {
          50: "#fff7ed",
          500: "#ea580c",
          600: "#c2410c",
        },
      },
    },
  },
  plugins: [],
};
export default config;
