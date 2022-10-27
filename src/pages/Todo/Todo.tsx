import AddTodo from '../../components/AddTodo/AddTodo'
import Sidenav from '../../components/Sidenav/Sidenav'
import { getSession } from '../../services/user'
import { useNavigate } from '@solidjs/router'
import type { Component } from 'solid-js'
import { createEffect, createSignal, Show } from 'solid-js'

const Todo: Component = () => {
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
    <div class="w-full min-h-screen relative flex bg-neutral-010">
      <Sidenav />
      <main
        aria-busy={loading()}
        aria-live="polite"
        class="flex flex-col px-ld-24 py-ld-40 relative min-h-screen flex-grow"
      >
        <Show when={!loading()} fallback={<ld-loading class="m-auto" />}>
          <>
            <ld-typo variant="h2" tag="h1" class="mt-6 xs:mt-1 mb-6">
              Upcomming
            </ld-typo>
            <AddTodo class="w-full" />
          </>
        </Show>
      </main>
    </div>
  )
}

export default Todo
