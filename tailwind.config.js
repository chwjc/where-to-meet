/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{vue,ts,js}'],
  theme: {
    extend: {
      colors: {
        primary: '#4A90D9',
        accent: '#F57C00',
        'page-bg': '#F5F6FA',
        'card-bg': '#FFFFFF',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
}
