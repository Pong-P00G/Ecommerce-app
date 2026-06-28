/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          'primary': '#000000',
          'secondary': '#ffffff',
          'neutral-100': '#fafafa',
          'neutral-200': '#f5f5f5',
          'neutral-300': '#e5e5e5',
          'neutral-400': '#a3a3a3',
          'neutral-500': '#737373',
          'neutral-600': '#525252',
          'neutral-700': '#404040',
          'neutral-800': '#262626',
          'neutral-900': '#171717',
        },
        fontFamily: {
          'elegant': ['Playfair Display', 'serif'],
          'body': ['Inter', 'sans-serif'],
        },
      },
    },
    plugins: [],
}