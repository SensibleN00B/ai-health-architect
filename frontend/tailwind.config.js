/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#13b9a5",
                "background-light": "#f6f8f8",
                "background-dark": "#051a1a",
                teal: {
                    950: '#031716', // Deep teal background
                    900: '#032F30', // Dark teal
                    700: '#0A7075', // Medium teal
                    500: '#0C969C', // Bright teal
                    300: '#6BA3BE', // Light cyan
                    600: '#274D60', // Blue-gray
                },
            },
            fontFamily: {
                display: ["Manrope", "sans-serif"],
            },
            backgroundImage: {
                "gradient-premium": "linear-gradient(180deg, #0a2e2e 0%, #051a1a 100%)",
            },
        },
    },
    plugins: [],
}
