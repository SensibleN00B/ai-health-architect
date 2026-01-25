/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                teal: {
                    950: '#031716', // Deep teal background
                    900: '#032F30', // Dark teal
                    700: '#0A7075', // Medium teal
                    500: '#0C969C', // Bright teal
                    300: '#6BA3BE', // Light cyan
                    600: '#274D60', // Blue-gray
                },
            },
        },
    },
    plugins: [],
}
