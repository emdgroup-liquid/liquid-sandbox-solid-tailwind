import '@emdgroup-liquid/liquid/dist/css/liquid.global.css'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.__LD_ASSET_PATH__ = window.location.origin

const loaded = new Set<string>()

export const loadComponents = async (components: string[]) => {
  await Promise.all(
    components.map((component) => {
      if (loaded.has(component)) return
      loaded.add(component)
      return import(
        `../node_modules/@emdgroup-liquid/liquid/dist/components/${component}.js`
      )
    })
  )
}
