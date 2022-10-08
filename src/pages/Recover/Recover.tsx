import Aside from '../../components/Aside/Aside'
import Logo from '../../components/Logo/Logo'
import TextInput from '../../components/TextInput/TextInput'
import { createFormGroup, createFormControl } from 'solid-forms'
import type { Component } from 'solid-js'
import { createEffect, createSignal, Show } from 'solid-js'

const Login: Component = () => {
  let formRef: HTMLFormElement

  const [recoveryPending, setRecoveryPending] = createSignal(false)

  const group = createFormGroup({
    email: createFormControl(localStorage.getItem('user_email') || '', {
      required: true,
      validators: (value: string) => {
        if (value.length === 0) return { missing: true }
        if (!value.includes('@')) return { invalid: true }
        return null
      },
    }),
  })

  // This will automatically re-run whenever `group.isDisabled`, `group.isValid` or `group.value` change
  createEffect(() => {
    if (group.isDisabled || !group.isValid) return
  })

  const onSubmit = async (ev: Event) => {
    ev.preventDefault()
    if (group.isSubmitted) return

    group.controls.email.markTouched(true)

    if (!group.isValid) {
      setTimeout(() => {
        formRef
          .querySelector<HTMLInputElement>('.ld-input--invalid input')
          ?.focus()
      }, 100)
      return
    }

    dispatchEvent(new CustomEvent('ldNotificationClear'))

    // Simulate asynchronous fetch.
    group.markSubmitted(true)
    const { email } = group.value
    await new Promise((resolve) => setTimeout(resolve, 500))
    group.markSubmitted(false)

    const isValidEmail = email === localStorage.getItem('user_email')

    if (isValidEmail) {
      setRecoveryPending(true)
    } else {
      dispatchEvent(
        new CustomEvent('ldNotificationAdd', {
          detail: {
            content: 'An account with this email does not exist.',
            type: 'alert',
          },
        })
      )
    }
  }

  return (
    <div class="flex w-full">
      <Aside>
        <Logo tag="div" href="/" class="mb-ld-16" />
      </Aside>

      <main class="flex flex-grow justify-center self-center px-ld-24 py-ld-40 min-h-screen sm:px-ld-40 lg:min-h-fit">
        <div class="container flex-grow mx-auto relative max-w-2xl flex flex-col">
          <Logo
            tag="div"
            href="/"
            class="mb-ld-16 self-start block lg:hidden"
          />

          <div class="my-auto" role="region" aria-live="polite">
            <Show
              when={!recoveryPending()}
              fallback={
                <>
                  <ld-typo variant="h1" class="block my-ld-40">
                    You've got mail
                  </ld-typo>

                  <ld-typo class="block mb-ld-32">
                    We have sent you a password reset link via email.
                  </ld-typo>

                  <ld-link href="/login">Back to Login</ld-link>
                </>
              }
            >
              <ld-typo variant="h1" class="block my-ld-40">
                Recover your account
              </ld-typo>

              <ld-typo class="block mb-ld-32">
                We can help you reset your password. Enter your account email,
                so that we can send you a password reset link.
              </ld-typo>

              <form
                class="grid w-full grid-cols-1 md:grid-cols-1 gap-ld-24 pb-ld-40"
                noValidate
                onSubmit={onSubmit}
                ref={(el) => (formRef = el)}
              >
                <TextInput
                  control={group.controls.email}
                  label="Account email"
                  name="name"
                  placeholder="e.g. jason.parse@example.com"
                  tone="dark"
                  type="email"
                />

                <ld-button
                  mode="highlight"
                  onClick={onSubmit}
                  progress={group.isSubmitted ? 'pending' : undefined}
                >
                  <span class="px-8">Send </span>
                </ld-button>
              </form>

              <ld-link href="/login">Back to Login</ld-link>
            </Show>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Login
