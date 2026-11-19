/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        coy: {
          bg: '#FAF6F0',
          ink: '#1A1715',
          text: '#1A1715',
          muted: '#7A726D',
          accent: '#D6455D',
          'accent-hover': '#BF374E',
          'accent-soft': '#FBECEF',
          border: '#E8E2D8',
          card: '#FFFFFF',
          surface: '#F4EFE6',
        }
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['DM Sans', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'card': '20px',
        'chip': '8px',
      },
      boxShadow: {
        'card-soft': '0 10px 30px -12px rgba(26, 23, 21, 0.08), 0 2px 6px -1px rgba(26, 23, 21, 0.04)',
      },
    },
  },
  plugins: [],
}
