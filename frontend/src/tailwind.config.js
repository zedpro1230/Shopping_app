/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      screens: {
        xs: "475px",
      },
    },
  },
  plugins: [],
  corePlugins: {
    // Ensure all core plugins are enabled
    preflight: true,
  },
};
