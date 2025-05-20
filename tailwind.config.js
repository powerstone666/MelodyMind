/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  mode:'jit',
  theme: {
    extend: {      colors:{
        blue:"#0E9EEF",
        red:"#EE1080",
        yellow:"#FFDc49",
        grey:"#656565",
        "deep-blue":"#010026",
        "deep-grey":"#1F1F1F",
        "opaque-black":"rgba(0,0,0,0.35)",
        // New color palette to match audio player
        "melody-purple": {
          100: "#e5d8e8",
          200: "#cbb1d1",
          300: "#b18abb",
          400: "#9763a4",
          500: "#7d3c8d",
          600: "#6a3071",
          700: "#572455",
          800: "#45183a",
          900: "#2d1e37"
        },
        "melody-pink": {
          100: "#ffd1e0",
          200: "#ffa3c2",
          300: "#ff75a3",
          400: "#ff4785",
          500: "#ff1966",
          600: "#ee1080",
          700: "#d00c63",
          800: "#a30852",
          900: "#770540"
        }
      },      animation: {
        'fadeIn': 'fadeIn 0.5s ease-in-out forwards',
        'slideUp': 'slideUp 0.4s ease-out forwards',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 12s linear infinite',
        'color-cycle': 'colorCycle 8s infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'wave': 'wave 1.2s ease-in-out infinite',
        'blob': 'blob 7s infinite',
        'music-wave': 'musicWave 1.5s ease-in-out infinite',
        'gradient': 'gradient 8s ease infinite',
        'animate-gradient': 'gradient 8s ease infinite',
      },      keyframes: {
        blob: {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        colorCycle: {
          '0%': { borderColor: '#ff3366' },
          '33%': { borderColor: '#ff66cc' },
          '66%': { borderColor: '#ff0099' },
          '100%': { borderColor: '#ff3366' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(255, 0, 102, 0.6)' },
          '100%': { boxShadow: '0 0 20px rgba(255, 0, 102, 0.9)' },
        },        wave: {
          '0%': { transform: 'scaleY(0.3)' },
          '50%': { transform: 'scaleY(1)' },
          '100%': { transform: 'scaleY(0.3)' },
        },
        musicWave: {
          '0%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
          '100%': { transform: 'translateY(0)' },
        },
        gradient: {
          '0%': {
            'background-position': '0% 50%',
          },
          '50%': {
            'background-position': '100% 50%',
          },
          '100%': {
            'background-position': '0% 50%',
          },
        },
      },backgroundImage: (theme)=>( {
        "gradient-rainbow": "linear-gradient(81.66deg, #00b5ee 7.21%, #ff45a4 45.05%, #ffba00 79.07%)",
        "gradient-rainblue": "linear-gradient(90deg, #FF1966 14.53%, #7D3C8D 69.36%, #0E9EEF 117.73%)",
        "gradient-album": "linear-gradient(90deg, #0E9EEF 14.53%, #45183A 69.36%)",
        "gradient-melody": "linear-gradient(90deg, rgba(45,30,55,0.98) 0%, rgba(95,44,88,0.98) 100%)",
        "gradient-melody-hover": "linear-gradient(90deg, rgba(69,24,58,0.9) 0%, rgba(125,60,141,0.9) 100%)"
      }),
      fontFamily: {
        playfair: ["Playfair Display", "serif"],
        opensans: ["Open Sans", "sans-serif"],
      },
      content: {
       
      },
      screens: {
        xs: "480px",
        sm: "768px",
        md: "1060px"
      },
      scale: {
        '103': '1.03',
      },
    },
  },
  plugins: [],
}

