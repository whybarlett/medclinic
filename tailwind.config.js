/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#003D9C', 50: '#E6EEFF', 100: '#CCDCFF', 500: '#003D9C', 600: '#003185', 700: '#00256E' },
        secondary: { DEFAULT: '#00AEEF', light: '#33BEFF', dark: '#0090C7' },
        success: '#27AE60',
        warning: '#F2C94C',
        error: '#EB5757',
        textPrimary: '#1A1A1A',
        textSecondary: '#6B7280',
        background: '#F8FAFC',
        border: '#E5E7EB',
      },
      fontFamily: {
        sans: ['Golos Text', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        btn: '8px', card: '16px', input: '8px', modal: '20px',
      },
      boxShadow: {
        card: '0 4px 24px rgba(0,61,156,0.08)',
        header: '0 2px 20px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 40px rgba(0,61,156,0.16)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in-left': 'slideInLeft 0.35s ease-out',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(30px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideInLeft: { from: { opacity: '0', transform: 'translateX(-100%)' }, to: { opacity: '1', transform: 'translateX(0)' } },
      },
    },
  },
  plugins: [],
}


