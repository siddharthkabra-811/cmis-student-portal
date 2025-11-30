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
        maroon: {
          50: '#f8f5f5',
          100: '#f0e9e9',
          200: '#ddc9c9',
          300: '#cba9a9',
          400: '#a66969',
          500: '#500000', // Texas A&M Maroon
          600: '#480000',
          700: '#3c0000',
          800: '#300000',
          900: '#270000',
        },
        gold: {
          50: '#fefbf3',
          100: '#fdf7e6',
          200: '#fbeccb',
          300: '#f8e0af',
          400: '#f3c878',
          500: '#EEB111', // Texas A&M Gold
          600: '#d69f0f',
          700: '#b3850d',
          800: '#8f6a0a',
          900: '#755708',
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
