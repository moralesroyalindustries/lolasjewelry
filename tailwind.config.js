/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFAF5',
          100: '#FAF5EC',
          200: '#F5ECD8',
          300: '#EFE0C4',
          400: '#E8D3B0',
          500: '#D9BF92',
          600: '#C4A270',
          700: '#A67C46',
          800: '#7A5A2E',
          900: '#4E3A1A',
        },
        gold: {
          50: '#FDF9EC',
          100: '#FAF0CC',
          200: '#F5DE91',
          300: '#EFC84D',
          400: '#E8B520',
          500: '#C9941A',
          600: '#B07513',
          700: '#8B5A0F',
          800: '#6B430C',
          900: '#4A2E08',
        },
        onyx: {
          50: '#F5F5F5',
          100: '#E8E8E8',
          200: '#C8C8C8',
          300: '#A0A0A0',
          400: '#707070',
          500: '#484848',
          600: '#303030',
          700: '#202020',
          800: '#141414',
          900: '#0A0A0A',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Cormorant Garamond"', '"Gill Sans"', 'sans-serif'],
        body: ['"Lato"', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest: '0.25em',
        ultra: '0.35em',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
