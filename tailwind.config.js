const liquidPreset = require('@emdgroup-liquid/liquid/dist/css/tailwind-preset.js')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  presets: [liquidPreset],
}
