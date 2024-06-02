/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  mode:'jit',
  theme: {
    extend: {
      colors:{
        blue:"#0E9EEF",
        red:"#EE1080",
        yellow:"#FFDc49",
        grey:"#656565",
        "deep-blue":"#010026",
        "deep-grey":"#1F1F1F",
        "opaque-black":"rgba(0,0,0,0.35)"
      },
    },
            backgroundImage: (theme)=>( {
              "gradient-rainbow": "linear-gradient(81.66deg, #00b5ee 7.21%, #ff45a4 45.05%, #ffba00 79.07%)",
              "gradient-rainblue": "linear-gradient(90deg, #24cbff 14.53%, #fc59ff 69.36%, #ffbd0c 117.73%)",
              "gradient-album": "linear-gradient(90deg, #0E9EEF 14.53%, #412C3A 69.36%)"
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
        },
  plugins: [],
}

