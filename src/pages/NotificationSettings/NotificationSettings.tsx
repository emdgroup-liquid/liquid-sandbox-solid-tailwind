import { loadComponents } from '../../liquidLoader'
import {
  initStore as initSettingsStore,
  settings,
  updateSettings,
} from '../../services/settings'
import { initStore as initTodoStore } from '../../services/todo'
import { getSession } from '../../services/user'
import { useNavigate } from '@solidjs/router'
import { createEffect, createSignal, Show, type Component } from 'solid-js'

const NotificationSettings: Component = () => {
  loadComponents([
    'ld-button',
    'ld-card',
    'ld-link',
    'ld-loading',
    'ld-modal',
    'ld-tooltip',
    'ld-toggle',
    'ld-typo',
  ])

  const navigate = useNavigate()

  const [loading, setLoading] = createSignal(true)

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
    <main
      aria-busy={loading()}
      aria-live="polite"
      class="flex flex-col max-w-[max(80vw,_80rem)] mx-auto px-ld-24 py-ld-40 relative h-screen flex-grow overflow-auto"
    >
      <Show when={!loading()} fallback={<ld-loading class="m-auto" />}>
        <ld-typo variant="h2" tag="h1" class="mt-6 xs:mt-1 mb-6">
          Notification Settings
        </ld-typo>

        <ld-typo class="mb-2">
          We will send you a notification Email to your account Email address
          for each task reminder that you have set up.
        </ld-typo>

        <ld-typo class="mb-6">
          You can change your email address in your{' '}
          <ld-link onClick={() => navigate('/account-settings')}>
            account settings
          </ld-link>
          .
        </ld-typo>

        <ld-card size="sm">
          <ld-label class="w-full" position="left" size="m">
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
  )
}

export default NotificationSettings
