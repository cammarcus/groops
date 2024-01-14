/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        scale: ['0.75rem', '1rem', '1.25rem', '1.5rem', '1.75rem', '2rem'],
      },
    },
  },
  plugins: [],
}