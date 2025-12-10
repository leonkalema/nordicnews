/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        'nordic-blue': '#0D3B66',
        'off-white': '#F8F8F8',
        'arctic-gray': '#CFD8DC',
        'breaking-red': '#DC2626',
      },
      fontFamily: {
        'sans': ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'serif': ['Playfair Display', 'Georgia', 'ui-serif', 'serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')],
};
