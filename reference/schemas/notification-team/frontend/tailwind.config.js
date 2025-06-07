/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#B51D4C",
        accent: "#0891B2",
        "primary-dark": "#9A1940",
        "accent-dark": "#0E7490",
      },
      fontFamily: {
        sans: ["Gotham", "Raleway", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
