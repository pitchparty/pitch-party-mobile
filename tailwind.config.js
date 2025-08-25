/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0056D2', // Primary blue
          light: '#89CFF0', // Soft blue
          dark: '#00274D', // Dark blue
        },
        accent: '#007AFF', // Bright accent blue
        background: {
          light: '#EAF4FF', // Light background blue
          dark: '#1A202C', // Dark mode background
        },
        neutral: {
          gray: '#4A6572', // Neutral gray
        },
      },
    },
  },
  plugins: [],
  corePlugin: {
    borderOpacity: true,
  },
}