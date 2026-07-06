/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        paper: '#FAF8F5',
        terracotta: '#B46A5A',
        sage: '#8B9D77',
        beige: '#E8DED1',
      },
    },
  },
  plugins: [],
};
