module.exports = {
  content: ["./index.html", "./src/**/*.{vue,ts,tsx}"] ,
  theme: {
    extend: {
      colors: {
        ink: "rgb(var(--c-ink) / <alpha-value>)",
        paper: "rgb(var(--c-paper) / <alpha-value>)",
        accent: "rgb(var(--c-accent) / <alpha-value>)",
        mist: "rgb(var(--c-mist) / <alpha-value>)"
      },
      borderRadius: {
        xl2: "1.25rem"
      }
    }
  },
  plugins: []
};
