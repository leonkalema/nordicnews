/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        'nordic-blue': '#0D3B66',
        'off-white': '#F8F8F8',
        'arctic-gray': '#CFD8DC',
      },
      fontFamily: {
        'sans': ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')],
};
