/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{ts,tsx,js,jsx,css}',
    './components/**/*.{ts,tsx,js,jsx,css}',
    './pages/**/*.{ts,tsx,js,jsx,css}',
    './src/**/*.{ts,tsx,js,jsx,css}'
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio')
  ],
}
