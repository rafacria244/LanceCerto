/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-blue': '#2D3E50',
        'vibrant-green': '#18D26E',
        'light-gray': '#F4F7FA',
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'Poppins', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

