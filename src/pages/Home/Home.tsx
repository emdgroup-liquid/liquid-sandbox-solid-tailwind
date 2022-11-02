import Logo from '../../components/Logo/Logo'
import { type Component } from 'solid-js'

const Home: Component = () => {
  return (
    <>
      <main class="container mx-auto px-ld-24 pt-ld-40 pb-24 relative max-w-2xl">
        <Logo variant="b2" class="mb-ld-40 text-center" />

        <div class="bg-wht rounded-l shadow-hover p-ld-32 flex flex-col align-center justify-items-center">
          <ld-typo tag="h2" class="mb-ld-32 text-center">
            Demo task management application for accessibility focused user
            testings.
          </ld-typo>

          <ld-button href="/login" mode="highlight" class="mx-auto">
            <span class="px-8">Get started</span>
          </ld-button>
        </div>
      </main>
      <ld-bg-cells
        style={{
          '--ld-bg-cells-layer-translation-x': '-90%',
          '--ld-bg-cells-layer-translation-y': '30%',
          '--ld-bg-cells-layer-size': '330%',
          '--ld-bg-cells-secondary-layer-size': '190%',
          '--ld-bg-cells-secondary-layer-translation-y': '-10%',
          '--ld-bg-cells-secondary-layer-translation-x': '-30%',
        }}
        three-layers
        class="block absolute inset-0 -z-10"
      />
    </>
  )
}

export default Home
