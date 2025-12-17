/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          dark: '#2e2e2e',
          DEFAULT: '#3e3e3e',
        },
        accent: {
          DEFAULT: '#d4a574',
          dark: '#b8956a',
        },
        light: {
          bg: '#f9f8f6',
          border: '#f0ede7',
        },
      },
      fontFamily: {
        sans: ['Jost', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 2px 8px rgba(0,0,0,0.04)',
        card: '0 5px 20px rgba(0,0,0,0.08)',
        hover: '0 15px 40px rgba(0,0,0,0.15)',
      },
    },
  },
  plugins: [],
};
