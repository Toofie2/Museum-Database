/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "default-gray": "#4B4B4B",
        "gray-brown": "#7B7165",
      },
      fontFamily: {
        cavas: ["Cavas", "sans-serif"],
      },
    },
  },
  plugins: [],
};
