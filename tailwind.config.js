/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0033A0',    // Meralco deep blue
        secondary: '#007BFF',  // lighter blue for accents
        accent: '#FFCC00',     // Meralco yellow
        background: '#F8F9FA', // light gray/off-white
        textColor: '#212529',  // dark gray/almost black
        success: '#28A745',    // green
        warning: '#FFC107',    // amber
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '8px',
      },
      boxShadow: {
        DEFAULT: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
      transitionDuration: {
        DEFAULT: '300ms',
      },
      transitionTimingFunction: {
        DEFAULT: 'ease',
      },
      opacity: {
        '15': '0.15',
      },
      keyframes: {
        electricity: {
          '0%, 100%': { 
            filter: 'hue-rotate(0deg) brightness(1)', 
            transform: 'scale(1)' 
          },
          '25%': { 
            filter: 'hue-rotate(15deg) brightness(1.2)', 
            transform: 'scale(1.05) translateX(2px)' 
          },
          '50%': { 
            filter: 'hue-rotate(-15deg) brightness(1.1)', 
            transform: 'scale(1.03) translateX(-2px)' 
          },
          '75%': { 
            filter: 'hue-rotate(5deg) brightness(1.3)', 
            transform: 'scale(1.02) translateY(1px)' 
          }
        },
        spark: {
          '0%': { 
            opacity: 0,
            transform: 'scale(0) rotate(0deg)',
          },
          '50%': { 
            opacity: 1,
            transform: 'scale(1) rotate(90deg)',
          },
          '100%': { 
            opacity: 0,
            transform: 'scale(0) rotate(180deg)',
          }
        }
      },
      animation: {
        'electricity': 'electricity 1.5s ease-in-out infinite',
        'spark': 'spark 0.6s ease-in-out forwards',
      }
    },
  },
  plugins: [],
} 