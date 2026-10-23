/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './app.vue',
    './plugins/**/*.{js,ts}'
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Baloo 2"', 'cursive'],
        body: ['Nunito', 'sans-serif']
      },
      colors: {
        // Palet "Colorful Clean" (Stitch) — lihat stitch-export/colorful_clean/DESIGN.md
        primary: '#006591',
        psky: '#0EA5E9',
        'psky-light': '#38BDF8',
        pfixed: '#C9E6FF',
        panel: '#EEF4FF',
        ink: '#111C29',
        canvas: '#FFFBF3'
      }
    }
  },
  plugins: []
}
