/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'fun': ['Comic Neue', 'cursive'],
      },
      animation: {
        'flip': 'flip 2s ease-in-out',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'shake': 'shake 0.5s ease-in-out',
        'bounce-slow': 'bounce 2s infinite',
        'spin-slow': 'spinY 3s linear infinite',
      },
      keyframes: {
        flip: {
          '0%': { transform: 'translateY(0) rotateY(0deg) scale(1)' },
          '25%': { transform: 'translateY(-60px) rotateY(450deg) scale(1.1)' },
          '50%': { transform: 'translateY(-80px) rotateY(900deg) scale(1.15)' },
          '75%': { transform: 'translateY(-60px) rotateY(1350deg) scale(1.1)' },
          '100%': { transform: 'translateY(0) rotateY(1800deg) scale(1)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-10px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(10px)' },
        },
        spinY: {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(360deg)' },
        }
      }
    },
  },
  plugins: [],
}
