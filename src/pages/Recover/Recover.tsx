import Aside from '../../components/Aside/Aside'
import Logo from '../../components/Logo/Logo'
import TextInput from '../../components/TextInput/TextInput'
import { getSession } from '../../services/user'
import { useNavigate } from '@solidjs/router'
import { createFormGroup, createFormControl } from 'solid-forms'
import { createEffect, createSignal, Show, type Component } from 'solid-js'

const Recover: Component = () => {
  const navigate = useNavigate()
  let formRef: HTMLFormElement

  const [loading, setLoading] = createSignal(true)

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

  createEffect(async () => {
    dispatchEvent(new CustomEvent('ldNotificationClear'))
    const session = await getSession()
    if (session) {
      navigate('/todo', { replace: true })
    }
    setLoading(false)
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
    await new Promise((resolve) => setTimeout(resolve, 500))
    group.markSubmitted(false)

    setRecoveryPending(true)
  }

  return (
    <div class="flex w-full">
      <Aside>
        <Logo tag="div" href="/" class="mb-ld-16" />
      </Aside>

      <main
        aria-busy={loading()}
        aria-live="polite"
        class="flex flex-grow justify-center self-center px-ld-24 py-ld-40 min-h-screen sm:px-ld-40 lg:min-h-fit overflow-auto"
      >
        <div class="container flex-grow mx-auto relative max-w-2xl flex flex-col">
          <Show when={!loading()} fallback={<ld-loading class="m-auto" />}>
            <>
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

                      <ld-link onClick={() => navigate('/login')}>
                        Back to Login
                      </ld-link>
                    </>
                  }
                >
                  <ld-typo variant="h1" class="block my-ld-40">
                    Recover your account
                  </ld-typo>

                  <ld-typo class="block mb-ld-32">
                    We can help you reset your password. Enter your account
                    email, so that we can send you a password reset link.
                  </ld-typo>

                  <form
                    class="grid w-full grid-cols-1 gap-ld-24 pb-ld-40"
                    noValidate
                    onSubmit={onSubmit}
                    ref={(el) => (formRef = el)}
                  >
                    <TextInput
                      autocomplete="email"
                      control={group.controls.email}
                      label="Account email"
                      name="name"
                      tone="dark"
                      type="email"
                    />

                    <ld-button
                      mode="highlight"
                      onClick={onSubmit}
                      progress={group.isSubmitted ? 'pending' : undefined}
                    >
                      <span class="px-8">Send</span>
                    </ld-button>
                  </form>

                  <ld-link onClick={() => navigate('/login')}>
                    Back to Login
                  </ld-link>
                </Show>
              </div>
            </>
          </Show>
        </div>
      </main>
    </div>
  )
}

export default Recover
