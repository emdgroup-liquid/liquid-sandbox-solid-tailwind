import type { Component } from 'solid-js'
import Logo from '../../components/Logo/Logo'

const Dashboard: Component = () => {
  return (
    <main class="container mx-auto px-ld-24 pt-ld-40 pb-24 relative max-w-2xl">
      <Logo variant="b2" class="mb-ld-40 text-center" />

      <div class="bg-wht rounded-l shadow-hover p-ld-32 flex flex-col align-center justify-items-center">
        <ld-typo tag="h2" class="mb-ld-32 text-center">
          Hello.
        </ld-typo>
      </div>
    </main>
  )
}

export default Dashboard
