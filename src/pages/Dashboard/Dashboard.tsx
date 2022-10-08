import Logo from '../../components/Logo/Logo'
import { useNavigate } from '@solidjs/router'
import type { Component } from 'solid-js'
import { createEffect } from 'solid-js'

const Dashboard: Component = () => {
  const navigate = useNavigate()

  createEffect(() => {
    if (!localStorage.getItem('user_session')) {
      navigate('/login', { replace: true })
    }
  })

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
