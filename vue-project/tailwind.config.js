/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          'elegant-black': '#0a0a0a',
          'elegant-gray': '#1a1a1a',
          'elegant-light': '#f5f5f5',
          'elegant-white': '#ffffff',
        },
        fontFamily: {
          'elegant': ['Playfair Display', 'serif'],
          'body': ['Inter', 'sans-serif'],
        },
      },
    },
    plugins: [],
}