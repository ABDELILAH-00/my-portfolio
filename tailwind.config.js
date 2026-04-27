/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#3D5B82', // Portfolio base — slate blue
        surface: '#324d70', // Deeper panels / footer band
        card: {
          DEFAULT: '#37557a',
          raised: '#3f5f88',
          soft: 'rgba(55, 85, 122, 0.82)',
        },
        accent: {
          DEFAULT: '#1CEDD0', // Vibrant Teal
          secondary: '#14B8A6',
        },
        content: {
          primary: '#F8FAFC', // Crisp White
          muted: '#94A3B8',    // Soft Slate
        },
      },
      boxShadow: {
        card: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.04), 0 14px 40px -18px rgba(0, 0, 0, 0.45)',
        'card-tight': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.035), 0 8px 24px -12px rgba(0, 0, 0, 0.4)',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"Fira Code"', 'monospace'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
