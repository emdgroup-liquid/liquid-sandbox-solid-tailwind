import Sidenav from '../../components/Sidenav/Sidenav'
import { initStore, todos } from '../../services/todo'
import { getSession } from '../../services/user'
import { parsePath } from '../../utils/path'
import { useLocation, useNavigate } from '@solidjs/router'
import {
  createEffect,
  createMemo,
  createSignal,
  Show,
  type Component,
} from 'solid-js'

const AccountSettings: Component = () => {
  const navigate = useNavigate()

  const [loading, setLoading] = createSignal(true)

  const location = useLocation()
  const pathname = createMemo(() => parsePath(location.pathname))

  createEffect(async () => {
    if (!(await getSession())) {
      navigate('/login', { replace: true })
    } else {
      setLoading(false)
      await initStore()
    }
  })

  return (
    <div class="w-full min-h-screen relative flex bg-neutral-010">
      <Sidenav todos={todos} pathname={pathname} />
      <main
        style={{
          'max-width': 'max(80vw, 80rem)',
        }}
        aria-busy={loading()}
        aria-live="polite"
        class="flex flex-col mx-auto px-ld-24 py-ld-40 relative h-screen flex-grow overflow-auto"
      >
        <Show when={!loading()} fallback={<ld-loading class="m-auto" />}>
          <ld-typo variant="h2" tag="h1" class="mt-6 xs:mt-1 mb-6">
            Account Settings
          </ld-typo>
        </Show>
      </main>
    </div>
  )
}

export default AccountSettings
