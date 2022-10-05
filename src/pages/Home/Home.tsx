import type { Component } from 'solid-js'

const Home: Component = () => {
  return (
    <div>
      <ld-typo
        variant="b1"
        class="text-vy mb-ld-40 text-center"
        aria-label="Uxer Experience, Stragegy and Design To-Do"
      >
        UXSD TO&hairsp;DO
      </ld-typo>

      <div class="bg-wht rounded-l shadow-hover p-ld-32 flex flex-col align-center justify-items-center">
        <ld-typo variant="h2" class="mb-ld-32 text-center">
          Get things done fast!
        </ld-typo>

        <ld-button href="/login" mode="highlight" class="mx-auto">
          <span class="px-8">Get started</span>
        </ld-button>
      </div>
    </div>
  )
}

export default Home
