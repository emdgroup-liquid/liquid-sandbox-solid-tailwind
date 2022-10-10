import liquidPreset from '@emdgroup-liquid/liquid/dist/css/tailwind-preset.js'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  presets: [liquidPreset],
}
