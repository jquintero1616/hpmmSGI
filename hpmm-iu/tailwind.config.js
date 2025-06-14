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
        "hpmm-azul-claro": "#2727c9", // Gris oscuro
        "hpmm-azul-oscuro": "#1b1ba1", // Gris claro
        "hpmm-rojo-oscuro": "#840808", // Gris claro
        "hpmm-rojo-claro": "#c10505", // Gris claro
        "hpmm-verde-claro": "#22c55e",
        "hpmm-azul":  "#3b82f6", // Azul vivo
        "hpmm-rojo":  "#ef4444", // Rojo intenso
        "hpmm-amarillo-claro": "#c7af12", // Amarillo brillante
        "hpmm-amarillo-oscuro": "#95830e", // Gris oscuro

        
      },
    },
  },
  plugins: [],
})
