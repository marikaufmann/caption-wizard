/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      screens: {
        laptop: "920px",
      },
      fontFamily: {
        poetsen: ['"Poetsen One"', "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
        japanese: ['"Noto Sans Japanese"'],
        korean: ['"Noto Sans Korean"'],
        greek: ['"GFS Didot"'],
        thai: ["Kanit"],
        hindi: ['"Tiro Devanagari Hindi"'],
      },
      colors: {
        background: '#1C1D21',
        primary: '#116466',
        primaryDarker: '#299393',
        darkGray: '#292A2F',
        darkerGray: '#131417',
        lightGray: '#404349',

      }
    },
  },
  plugins: [],
};
