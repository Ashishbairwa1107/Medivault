/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        surface2: 'var(--surface2)',
        border: 'var(--border)',
        text: 'var(--text)',
        text2: 'var(--text2)',
        text3: 'var(--text3)',
        primary: 'var(--primary)',
        'primary-light': 'var(--primary-light)',
        'primary-hover': 'var(--primary-hover)',
        teal: 'var(--teal)',
        'teal-light': 'var(--teal-light)',
        green: 'var(--green)',
        'green-light': 'var(--green-light)',
        amber: 'var(--amber)',
        'amber-light': 'var(--amber-light)',
        red: 'var(--red)',
        'red-light': 'var(--red-light)',
        purple: 'var(--purple)',
        'purple-light': 'var(--purple-light)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Fraunces', 'serif'],
      },
    },
  },
  plugins: [],
}
