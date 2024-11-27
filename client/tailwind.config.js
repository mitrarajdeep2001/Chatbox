/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", ...defaultTheme.fontFamily.sans], // Set Poppins as default sans font
      },
      colors: {
        light: {
          primary: "#fcfcfc",
          secondary: "#f3f3f3",
          tertiary: "#e5e5e5",

          chat_primary: "#d9fdd3",
          chat_secondary: "#e9fbe6",
          chat_tertiary: "#06cf9c",
        },
        dark: {
          primary: "#2c2c2c",
          secondary: "#202020",
          tertiary: "#515151",

          chat_primary: "#005c4b",
          chat_secondary: "#1c6c5e",
          chat_tertiary: "#06cf9c",
        },
      },
      backgroundImage: {
        chat_doodles_light:
          "linear-gradient(rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)), url('../src/assets/chat_bg.svg')",
        chat_doodles_dark:
          "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('../src/assets/chat_bg.svg')",
      },
    },
  },
};
