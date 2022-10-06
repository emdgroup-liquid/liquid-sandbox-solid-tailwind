import type { Component } from 'solid-js'
import { JSX } from 'solid-js'

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
        style={{
          '--ld-bg-cells-layer-translation-x': '0%',
          '--ld-bg-cells-layer-translation-y': '10%',
          '--ld-bg-cells-layer-size': '250%',
        }}
        class="block absolute inset-0 -z-10"
      />
    </aside>
  )
}

export default Aside
