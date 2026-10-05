import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}", "./Context/**/*.{js,jsx}"],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: ["light"],
  },
  plugins: [daisyui],
};
