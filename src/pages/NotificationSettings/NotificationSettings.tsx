import Sidenav from '../../components/Sidenav/Sidenav'
import {
  initStore as initSettingsStore,
  settings,
  updateSettings,
} from '../../services/settings'
import { initStore as initTodoStore, todos } from '../../services/todo'
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

const NotificationSettings: Component = () => {
  const navigate = useNavigate()

  const [loading, setLoading] = createSignal(true)

  const location = useLocation()
  const pathname = createMemo(() => parsePath(location.pathname))

  createEffect(async () => {
    if (!(await getSession())) {
      navigate('/login', { replace: true })
    } else {
      initTodoStore()
      await initSettingsStore()
      setLoading(false)
    }
  })

  const update = async () => {
    try {
      await updateSettings(
        'notificationsEnabled',
        !settings.notificationsEnabled
      )
      dispatchEvent(
        new CustomEvent('ldNotificationAdd', {
          detail: {
            content: 'Task has been updated.',
            type: 'info',
          },
        })
      )
    } catch (err) {
      dispatchEvent(
        new CustomEvent('ldNotificationAdd', {
          detail: {
            content: (err as Error)?.message || 'Failed updating task.',
            type: 'alert',
          },
        })
      )
    }
  }

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
            Notification Settings
          </ld-typo>

          <ld-typo class="mb-6">
            We will send you a notification Email to your account Email address
            for each task reminder that you have set up.
          </ld-typo>

          <ld-card size="sm">
            <ld-label class="w-full px-ld-4" position="left" size="m">
              I'd like to receive a notifications via email.
              <ld-toggle
                checked={settings.notificationsEnabled}
                class="ml-auto"
                onChange={update}
              />
            </ld-label>
          </ld-card>
        </Show>
      </main>
    </div>
  )
}

export default NotificationSettings
