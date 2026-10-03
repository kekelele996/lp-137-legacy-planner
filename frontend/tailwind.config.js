/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
        },
        warm: {
          50: '#fef7ed',
          100: '#fdecd3',
          200: '#fad5a6',
          300: '#f6b86e',
          400: '#f19338',
          500: '#ee7711',
          600: '#de5d09',
          700: '#b94708',
          800: '#93390f',
          900: '#773010',
        }
      }
    },
  },
  plugins: [],
}
