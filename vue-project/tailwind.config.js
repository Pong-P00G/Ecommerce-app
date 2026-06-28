/** @type {import('tailwindcss').Config} */
// TailwindCSS v4 reads theme tokens from @theme in CSS.
// This config keeps the content scanning + legacy compatibility shim.
export default {
    content: [
      "./index.html",
      "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {},
    },
    plugins: [],
}
