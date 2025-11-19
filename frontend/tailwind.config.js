// filepath: c:\Users\jeswa\Desktop\AI-Chat\frontend\tailwind.config.js
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: '#3ECF8E', // Supabase green
        dark: {
          background: '#0F1419', // Supabase dark background
          text: '#E6E9EE', // Supabase dark text
        },
        light: {
          background: '#FFFFFF', // Supabase light background
          text: '#0F1419', // Supabase light text
        },
        accent: {
          DEFAULT: '#3ECF8E', // Updated to match Supabase primary
          light: '#4ADE80', // Lighter shade for hover
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Matches Supabase
        mono: ['monospace'],
      },
    },
  },
  plugins: [],
};
