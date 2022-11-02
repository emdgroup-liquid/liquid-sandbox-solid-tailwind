import { type JSX, type Component } from 'solid-js'

interface AsideProps {
  class?: string
  classList?: { [k: string]: boolean | undefined }
  children?: JSX.Element
}

const Aside: Component<AsideProps> = (props) => {
  return (
    <aside
      class={
        'relative min-h-screen p-ld-40 w-1/3 hidden lg:block ' + props.class
      }
      classList={{ 'text-vy': true, ...(props.classList || {}) }}
    >
      {props.children}

      <ld-bg-cells
        three-layers
        style={{
          '--ld-bg-cells-layer-translation-x': '-20%',
          '--ld-bg-cells-layer-translation-y': '50%',
          '--ld-bg-cells-layer-size': '410%',
          '--ld-bg-cells-secondary-layer-size': '280%',
          '--ld-bg-cells-secondary-layer-translation-y': '30%',
          '--ld-bg-cells-secondary-layer-translation-x': '0%',
        }}
        class="block absolute inset-0 -z-10"
      />
    </aside>
  )
}

export default Aside
