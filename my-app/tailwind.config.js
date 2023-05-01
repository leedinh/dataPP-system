/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    theme: {
    extend: {
      boxShadow: {
        'lg': '25px 20px 25px -5px rgb(0 0 0 / 0.1)',
      }
    }
  }
  },
  plugins: [],
  corePlugins: {
    preflight: false // <== disable this!
  },
}