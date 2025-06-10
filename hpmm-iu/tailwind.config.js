/** @type {import('tailwindcss').Config} */

const withMT = require('@material-tailwind/react/utils/withMT')

export default withMT({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "hpmm-morado-oscuro": "#663399", // Gris oscuro
        "hpmm-morado-claro": "#8f15c3", // Gris oscuro
        hpmm_verde_claro: "#22c55e",
        hpmm_azul:  "#3b82f6", // Azul vivo
        hpmm_rojo:  "#ef4444", // Rojo intenso
        hpmm_rojo_claro: "#22c55e",
      },
    },
  },
  plugins: [],
})
