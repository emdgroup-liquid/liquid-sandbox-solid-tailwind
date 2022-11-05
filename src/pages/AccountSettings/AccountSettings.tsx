import PasswordRating from '../../components/PasswordRating/PasswordRating'
import Sidenav from '../../components/Sidenav/Sidenav'
import TextInput from '../../components/TextInput/TextInput'
import { initStore as initSettingsStore } from '../../services/settings'
import { initStore as initTodoStore, todos } from '../../services/todo'
import { deleteUser, getSession, updateUser } from '../../services/user'
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
  let confirmDeleteModalRef: HTMLLdModalElement
  let emailFormRef: HTMLFormElement
  let passwordFormRef: HTMLFormElement

  const navigate = useNavigate()

  const [loading, setLoading] = createSignal(true)

  const [deleting, setDeleting] = createSignal(false)

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

  const passwordControl = createFormControl('', {
    required: true,
    validators: (value: string) => {
      return value.length === 0 ? { missing: true } : null
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

  const updatePassword = async (ev: Event) => {
    ev.preventDefault()
    passwordControl.markTouched(true)

    if (!passwordControl.isValid) {
      setTimeout(() => {
        passwordFormRef
          .querySelector<HTMLInputElement>('.ld-input input')
          ?.focus()
      }, 100)
      return
    }

    dispatchEvent(new CustomEvent('ldNotificationClear'))
    passwordControl.markSubmitted(true)

    const password = passwordControl.value

    let updateSuccessfull = false
    try {
      await updateUser({ password })
      updateSuccessfull = true
    } catch (err) {
      dispatchEvent(
        new CustomEvent('ldNotificationAdd', {
          detail: {
            content: (err as Error)?.message || 'Failed updating password.',
            type: 'alert',
          },
        })
      )
    }

    passwordControl.markSubmitted(false)

    if (updateSuccessfull) {
      dispatchEvent(
        new CustomEvent('ldNotificationAdd', {
          detail: {
            content: 'Password has been updated.',
            type: 'info',
          },
        })
      )
    }
  }

  const invokeDeletionConfirmationDialog = () => {
    if (deleting()) return

    dispatchEvent(new CustomEvent('ldNotificationClear'))
    confirmDeleteModalRef.showModal()
  }

  const deleteAccount = async () => {
    if (deleting()) return

    dispatchEvent(new CustomEvent('ldNotificationClear'))

    setDeleting(true)
    try {
      await deleteUser()
      navigate('/login')
    } catch (err) {
      dispatchEvent(
        new CustomEvent('ldNotificationAdd', {
          detail: {
            content: (err as Error)?.message || 'Failed deleting account.',
            type: 'alert',
          },
        })
      )
    }
    setDeleting(false)
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

          <ld-card size="sm" class="mb-ld-16">
            <form
              aria-label="Update Email address"
              autocomplete="on"
              class="grid sm:grid-cols-[minmax(0,_1fr)_12rem] w-full gap-ld-16"
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

          <ld-card class="mb-ld-16" size="sm">
            <form
              aria-label="Update password"
              autocomplete="on"
              class="grid sm:grid-cols-[minmax(0,_1fr)_12rem] w-full gap-ld-16"
              novalidate
              onSubmit={updatePassword}
              ref={(el) => (passwordFormRef = el)}
            >
              <div class="grid grow">
                <TextInput
                  class="w-full"
                  autocomplete="password"
                  autofocus
                  control={passwordControl}
                  label="New password"
                  name="name"
                  tone="dark"
                  type="password"
                />
                <PasswordRating
                  class="flex flex-wrap transition-opacity items-baseline"
                  passwordValue={passwordControl.value}
                />
              </div>

              <ld-button
                class="self-start mt-ld-24 w-full sm:w-auto -translate-y-ld-2"
                onClick={updatePassword}
                progress={passwordControl.isSubmitted ? 'pending' : undefined}
              >
                Update Password
              </ld-button>
            </form>
          </ld-card>

          <ld-card size="sm">
            <ld-typo tag="h2" class="text-thm-error mb-ld-12" variant="h4">
              Danger zone
            </ld-typo>
            <div class="grid sm:grid-cols-[12rem_minmax(0,_1fr)] w-full gap-ld-16">
              <ld-button
                mode="danger"
                onClick={invokeDeletionConfirmationDialog}
              >
                Delete account
              </ld-button>
            </div>
            <ld-modal
              class="[&::part(footer)]:grid-cols-1"
              onLdmodalclosed={() => {
                // TODO: set focus
              }}
              ref={(el: HTMLLdModalElement) => (confirmDeleteModalRef = el)}
            >
              <ld-typo slot="header">Are you sure?</ld-typo>
              <ld-typo class="text-center">
                You won't be able to undo this action.
              </ld-typo>
              <div slot="footer" class="grid grid-cols-2 gap-ld-12 w-full">
                <ld-button
                  mode="ghost"
                  onClick={() => {
                    confirmDeleteModalRef.close()
                  }}
                >
                  Cancel
                </ld-button>
                <ld-button
                  mode="danger"
                  onClick={async () => {
                    await deleteAccount()
                    confirmDeleteModalRef.close()
                  }}
                  progress={deleting() ? 'pending' : undefined}
                >
                  Delete account
                </ld-button>
              </div>
            </ld-modal>
          </ld-card>
        </Show>
      </main>
    </div>
  )
}

export default AccountSettings
