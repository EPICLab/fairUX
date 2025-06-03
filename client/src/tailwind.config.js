/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        blue: {
          50: '#e6f1ff',
          100: '#b8d7ff',
          200: '#8abaff',
          300: '#5c9cff',
          400: '#2e7eff',
          500: '#0060e6',
          600: '#004bb3',
          700: '#003580',
          800: '#00204d',
          900: '#000b1a',
        },
      },
    },
  },
  plugins: [],
}