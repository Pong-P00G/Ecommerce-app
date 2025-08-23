/** @type {import('tailwindcss').Config} */
export default {
        content: [
            "./index.html",
            "./src/**/*.{vue,js,ts,jsx,tsx}",
        ],
    theme: {
    extend: {
        colors: {
            'apricot': '#FBCEB1',
            'apricot-2': '#FCD0B1',
            'apricot-3': '#FCD1B1',
            'apricot-4': '#FDD3B1',
            'light-orange': '#FDD5B1',
            'light-orange-2': '#FED6B1',
            'light-orange-3': '#FED8B1',
        },
        backgroundImage: {
            'gradient-top': 'linear-gradient(to top, #FBCEB1, #FCD0B1, #FCD1B1, #FDD3B1, #FDD5B1, #FED6B1, #FED8B1)',
            'gradient-right': 'linear-gradient(to right, #FBCEB1, #FCD0B1, #FCD1B1, #FDD3B1, #FDD5B1, #FED6B1, #FED8B1)',
            'gradient-bottom': 'linear-gradient(to bottom, #FBCEB1, #FCD0B1, #FCD1B1, #FDD3B1, #FDD5B1, #FED6B1, #FED8B1)',
            'gradient-left': 'linear-gradient(to left, #FBCEB1, #FCD0B1, #FCD1B1, #FDD3B1, #FDD5B1, #FED6B1, #FED8B1)',
            'gradient-tr': 'linear-gradient(to top right, #FBCEB1, #FCD0B1, #FCD1B1, #FDD3B1, #FDD5B1, #FED6B1, #FED8B1)',
            'gradient-br': 'linear-gradient(to bottom right, #FBCEB1, #FCD0B1, #FCD1B1, #FDD3B1, #FDD5B1, #FED6B1, #FED8B1)',
            'gradient-tl': 'linear-gradient(to top left, #FBCEB1, #FCD0B1, #FCD1B1, #FDD3B1, #FDD5B1, #FED6B1, #FED8B1)',
            'gradient-bl': 'linear-gradient(to bottom left, #FBCEB1, #FCD0B1, #FCD1B1, #FDD3B1, #FDD5B1, #FED6B1, #FED8B1)',
            'gradient-radial': 'radial-gradient(circle, #FBCEB1, #FCD0B1, #FCD1B1, #FDD3B1, #FDD5B1, #FED6B1, #FED8B1)',
        },
    },
    },
    plugins: [],
}
