/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // ¡Esta línea es vital!
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4F46E5", // Un violeta/azul moderno
        secondary: "#EC4899", // Un rosa para gradientes
      }
    },
  },
  plugins: [],
}