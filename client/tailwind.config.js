/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "default-gray": "#4B4B4B",
        "gray-brown": "#7B7165",
        "gray-lightest": "#F4F4F4",
        "gray-light": "#E1E1E1",
        "gray-medium": "#ABABAB",
        "gray-dark": "#4B4B4B",
      },
      fontFamily: {
        cavas: ["Cavas", "sans-serif"],
      },
    },
  },
  plugins: [],
};
