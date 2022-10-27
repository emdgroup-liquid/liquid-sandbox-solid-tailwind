// @ts-ignore
import liquidPreset from '@emdgroup-liquid/liquid/dist/css/tailwind-preset.cjs'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  presets: [liquidPreset],
  theme: {
    screens: {
      '2xs': '20rem',
      xs: '30rem',
      sm: '40rem',
      md: '48rem',
      lg: '64rem',
      xl: '80rem',
      '2xl': '96rem',
    },
  },
}
