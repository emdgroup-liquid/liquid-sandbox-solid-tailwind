import Sidenav from '../../components/Sidenav/Sidenav'
import { getSession } from '../../services/user'
import { useNavigate } from '@solidjs/router'
import type { Component } from 'solid-js'
import { createEffect, createSignal, Show } from 'solid-js'

const ToDo: Component = () => {
  const navigate = useNavigate()

  const [loading, setLoading] = createSignal(true)

  createEffect(() => {
    if (!localStorage.getItem('user_session')) {
      navigate('/login', { replace: true })
    }
  })

  createEffect(async () => {
    dispatchEvent(new CustomEvent('ldNotificationClear'))
    const session = await getSession()
    if (!session) {
      navigate('/login', { replace: true })
    }
    setLoading(false)
  })

  return (
    <div class="w-full min-h-screen relative">
      <Sidenav />
      <main
        aria-busy={loading()}
        aria-live="polite"
        class="container mx-auto px-ld-24 pt-ld-40 pb-24 relative max-w-2xl min-h-screen flex"
      >
        <Show when={!loading()} fallback={<ld-loading class="m-auto" />}>
          <>
            <ld-typo tag="h2" class="mb-ld-32 text-center">
              Hello.
            </ld-typo>
          </>
        </Show>
      </main>
    </div>
  )
}

export default ToDo
