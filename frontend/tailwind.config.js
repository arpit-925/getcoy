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
          pink: '#F53683',
          'pink-hover': '#E02674',
          'pink-light': '#FFF0F5',
          'pink-soft': '#FDE8EF',
          bg: '#FAF8FC',
          card: '#FFFFFF',
          text: '#19151F',
          muted: '#716B7B',
          border: '#EDE8F2',
          subtle: '#F3EFF8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'coy-card': '0 12px 35px -8px rgba(25, 21, 31, 0.08), 0 4px 12px -2px rgba(25, 21, 31, 0.04)',
        'coy-pink': '0 10px 25px -5px rgba(245, 54, 131, 0.35)',
        'coy-pass': '0 10px 25px -5px rgba(113, 107, 123, 0.25)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}

