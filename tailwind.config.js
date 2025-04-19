module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"], 
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      "animation": {
        "shine": "shine 6s linear infinite"
      },
      "keyframes": {
        "shine": {
          "from": {
            "backgroundPosition": "0 0"
          },
          "to": {
            "backgroundPosition": "-400% 0"
          }
        }
      }
    },
  },
  variants: {
    extend: {
      backgroundColor: ["hover"],
    },
  },
  plugins: [],
}


