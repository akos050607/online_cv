/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            colors: {
                'nothing-red': '#cc0000',
            },
            fontFamily: {
                sans: ['"Inter"', 'sans-serif'],
                mono: ['"DotGothic16"', 'monospace'], 
                serif: ['"Playfair Display"', 'serif'],
            }
        },
    },
    plugins: [],
}