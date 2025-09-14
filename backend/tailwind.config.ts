/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
    './payload/**/*.{js,ts,jsx,tsx}', // Optional: if using custom Payload components
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
