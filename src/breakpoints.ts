// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore-next
import tailwindConfig from '../tailwind.config.js'
import resolveConfig from 'tailwindcss/resolveConfig'

const fullConfig = resolveConfig(tailwindConfig)

const breakpoints = { ...fullConfig.theme?.screens } as {
  [key: string]: string
}

export default breakpoints
