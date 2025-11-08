/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1280px',    // override default 2xl (1536px)
        '3xl': '1280px',    // your custom screen behavior at 1540px
      },
    },
    extend: {
      screens: {
        xs: '400px',
        '3xl': '1540px',     // define the custom breakpoint
      },
      keyframes: {
        breathing: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
        ellipsis: {
          "0%": { content: "'.'" },
          "33%": { content: "'..'" },
          "66%": { content: "'...'" },
          "100%": { content: "''" },
        },
      },
      animation: {
        breathing: 'breathing 3s ease-in-out infinite',
        ellipsis: "ellipsis 1.2s infinite steps(1, end)",
      },
    },
  },
  safelist: [
    "bg-indigo-100",
    "bg-indigo-300",
    "bg-green-100",
    "bg-green-300",
    "bg-lime-100",
    "bg-yellow-100",
    "bg-yellow-300",
    "bg-orange-100",
    "bg-pink-100",
  ],
  plugins: [],
}
