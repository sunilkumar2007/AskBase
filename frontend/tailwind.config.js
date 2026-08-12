/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        askbase: {
          crimson: '#CB2958',
          'crimson-hover': '#A91F49',
          'crimson-light': '#FDF2F5',
          'crimson-border': '#F9D5E0',
          charcoal: '#1D242E',
          'charcoal-light': '#2A3340',
          gray: '#6B7280',
          border: '#DDDDDD',
          soft: '#EEEEEE',
          bg: '#FAFAFA',
        },
        primary: {
          50: '#FDF2F5',
          100: '#F9D5E0',
          500: '#CB2958',
          600: '#CB2958',
          700: '#A91F49',
          800: '#88183A',
          900: '#1D242E',
        },
      },
    },
  },
  plugins: [],
}
