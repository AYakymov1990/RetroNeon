/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        retroBg: '#0B0F14',
        retroText: '#E6EAF0',
        retroAccent: '#29B6F6',
        retroWarn: '#FFD166',
      },
      fontFamily: {
        heading: ['Orbitron', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        neon: '0 0 0 2px rgba(41,182,246,0.85), 0 0 20px rgba(41,182,246,0.55)',
      },
    },
  },
  plugins: [],
}
