/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        wood: {
          50: '#F5EDE3',
          100: '#EDE0C8',
          200: '#D3B98F',
          300: '#C4A06B',
          400: '#A97A48',
          500: '#8A5C34',
          600: '#6B4426',
          700: '#4A2E1A',
          800: '#3E2717',
          900: '#271A11',
          950: '#1B120C',
        },
        oak: {
          300: '#E4C696',
          400: '#D3A868',
          500: '#C08A45',
        },
        cream: {
          50: '#FBF6EE',
          100: '#F5EBDA',
          200: '#EDE0C8',
        },
        red: {
          500: '#B92B37',
          600: '#9C1F2A',
          700: '#7A1620',
          800: '#5E1119',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        sans: ['Manrope', 'sans-serif'],
      },
      keyframes: {
        'scroll-left': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'scroll-left': 'scroll-left 32s linear infinite',
      },
    },
  },
  plugins: [],
}
