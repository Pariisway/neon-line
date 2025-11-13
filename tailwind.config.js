/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./**/*.{ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        neon: '0 0 20px #0ff, 0 0 40px #0ff',
      },
    },
  },
  plugins: [],
};
