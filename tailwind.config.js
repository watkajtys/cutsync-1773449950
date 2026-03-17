/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#2b6cee",
        "surface": "#0c0e14",
        "surface-accent": "#161922",
        "border-subtle": "#242936",
        "markup-green": "#39ff14",
        "background-light": "#f5f7f8",
        "background-dark": "#060a0d",
        "panel-dark": "#0d1217",
      },
      fontFamily: {
        "display": ["Inter", "sans-serif"],
        "mono": ["Roboto Mono", "monospace"]
      },
      borderRadius: {"DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px"},
    },
  },
  plugins: [],
}
