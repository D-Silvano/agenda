/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                gold: {
                    50: '#FBFAF3',
                    100: '#F7F3E1',
                    200: '#EFE6C3',
                    light: '#D4AF37', // Metallic Gold
                    DEFAULT: '#B8860B', // Dark Goldenrod
                    dark: '#8B6508',
                },
                brown: {
                    900: '#2C1E16',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
