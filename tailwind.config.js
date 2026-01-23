/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        jules: {
          bg: '#1D0245', // Deep Indigo
          surface: '#2A0A55', // Slightly lighter indigo for cards
          border: '#4B1E7A', // Border color
          primary: '#F3EFFF', // Main text
          accent: '#00D7FF', // Cyan
          purple: '#7B2CBF',
          pink: '#D0B9FF',
          muted: '#9CA3AF',
          error: '#FF6B6B'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp: { '0%': { opacity: 0, transform: 'translateY(10px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } }
      },
      backgroundImage: {
        'hero-glow': 'radial-gradient(circle at 50% 50%, rgba(168, 199, 250, 0.08) 0%, rgba(14, 14, 14, 0) 50%)',
      }
    },
  },
  plugins: [],
};
