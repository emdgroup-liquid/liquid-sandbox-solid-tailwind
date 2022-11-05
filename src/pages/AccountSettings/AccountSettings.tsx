import Sidenav from '../../components/Sidenav/Sidenav'
import TextInput from '../../components/TextInput/TextInput'
import { initStore as initSettingsStore } from '../../services/settings'
import { initStore as initTodoStore, todos } from '../../services/todo'
import { updateUser, getSession } from '../../services/user'
import { parsePath } from '../../utils/path'
import { useLocation, useNavigate } from '@solidjs/router'
import { createFormControl } from 'solid-forms'
import {
  createEffect,
  createMemo,
  createSignal,
  Show,
  type Component,
} from 'solid-js'

const AccountSettings: Component = () => {
  let emailFormRef: HTMLFormElement

  const navigate = useNavigate()

  const [loading, setLoading] = createSignal(true)

  const location = useLocation()
  const pathname = createMemo(() => parsePath(location.pathname))

  const emailControl = createFormControl('', {
    required: true,
    validators: (value: string) => {
      if (value.length === 0) return { missing: true }
      if (!value.includes('@')) return { invalid: true }
      return null
    },
  })

  createEffect(async () => {
    const email = await getSession()
    if (!email) {
      navigate('/login', { replace: true })
    } else {
      emailControl.setValue(email)
      initTodoStore()
      await initSettingsStore()
      setLoading(false)
    }
  })

  const updateEmail = async (ev: Event) => {
    ev.preventDefault()
    emailControl.markTouched(true)

    if (!emailControl.isValid) {
      setTimeout(() => {
        emailFormRef.querySelector<HTMLInputElement>('.ld-input input')?.focus()
      }, 100)
      return
    }

    dispatchEvent(new CustomEvent('ldNotificationClear'))
    emailControl.markSubmitted(true)

    const email = emailControl.value

    let updateSuccessfull = false
    try {
      await updateUser({ email })
      updateSuccessfull = true
    } catch (err) {
      dispatchEvent(
        new CustomEvent('ldNotificationAdd', {
          detail: {
            content: (err as Error)?.message || 'Failed updating email.',
            type: 'alert',
          },
        })
      )
    }

    emailControl.markSubmitted(false)

    if (updateSuccessfull) {
      dispatchEvent(
        new CustomEvent('ldNotificationAdd', {
          detail: {
            content: 'Email has been updated.',
            type: 'info',
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
            Account Settings
          </ld-typo>

          <ld-card size="sm">
            <form
              autocomplete="on"
              class="flex flex-col sm:flex-row w-full gap-ld-16 sm:grid-cols-2"
              novalidate
              onSubmit={updateEmail}
              ref={(el) => (emailFormRef = el)}
            >
              <TextInput
                class="grow"
                autocomplete="email"
                autofocus
                control={emailControl}
                label="Email"
                name="name"
                tone="dark"
                type="email"
                tooltip={
                  <ld-tooltip
                    arrow
                    position="right bottom"
                    trigger-type="click"
                  >
                    <ld-typo>
                      Your Email is used to log in into your account as well as
                      to send you notifications. You can change your
                      notification settings{' '}
                      <ld-link
                        onClick={() => navigate('/notification-settings')}
                      >
                        here
                      </ld-link>
                      .
                    </ld-typo>
                  </ld-tooltip>
                }
              />

              <ld-button
                class="self-end w-full sm:w-auto"
                onClick={updateEmail}
                progress={emailControl.isSubmitted ? 'pending' : undefined}
              >
                Update Email
              </ld-button>
            </form>
          </ld-card>
        </Show>
      </main>
    </div>
  )
}

export default AccountSettings
