/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{vue,js,ts}",
    "./components/**/*.{vue,js,ts}",
    "./layouts/**/*.{vue,js,ts}",
    "./pages/**/*.{vue,js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#1b2a6b",
          deep: "#0e1840",
        },
        brand: {
          red: "#e3001b",
          "red-hover": "#ff1a35",
          gold: "#c5a55a",
          "gold-light": "#d4ba7a",
        },
      },
      fontFamily: {
        sans: ['"Space Grotesk"', "system-ui", "sans-serif"],
        display: ['"Host Grotesk"', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
