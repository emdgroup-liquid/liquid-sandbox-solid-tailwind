import Aside from '../../components/Aside/Aside'
import Logo from '../../components/Logo/Logo'
import TextInput from '../../components/TextInput/TextInput'
import { getSession, loginUser } from '../../services/user'
import { useNavigate } from '@solidjs/router'
import { createFormGroup, createFormControl } from 'solid-forms'
import { createEffect, createSignal, Show, type Component } from 'solid-js'

const Login: Component = () => {
  const navigate = useNavigate()
  let formRef: HTMLFormElement

  const [loading, setLoading] = createSignal(true)

  const group = createFormGroup({
    email: createFormControl('', {
      required: true,
      validators: (value: string) => {
        if (value.length === 0) return { missing: true }
        if (!value.includes('@')) return { invalid: true }
        return null
      },
    }),
    password: createFormControl('', {
      required: true,
      validators: (value: string) => {
        return value.length === 0 ? { missing: true } : null
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
    group.controls.password.markTouched(true)
    if (!group.isValid) {
      setTimeout(() => {
        formRef
          .querySelector<HTMLInputElement>('.ld-input--invalid input')
          ?.focus()
      }, 100)
      return
    }

    dispatchEvent(new CustomEvent('ldNotificationClear'))

    group.markSubmitted(true)
    const { email, password } = group.value
    const isLoginSuccessful = await loginUser(email, password)
    group.markSubmitted(false)

    if (isLoginSuccessful) {
      navigate('/todo', { replace: true })
    } else {
      formRef.querySelector<HTMLInputElement>('input[type="password"]')?.focus()
      dispatchEvent(
        new CustomEvent('ldNotificationAdd', {
          detail: {
            content: 'The login data is incorrect.',
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

      <main
        aria-busy={loading()}
        aria-live="polite"
        class="flex flex-grow justify-center self-center px-ld-24 py-ld-40 sm:px-ld-40 min-h-screen shadow-hover overflow-auto"
      >
        <div class="container flex-grow mx-auto relative max-w-2xl flex flex-col">
          <Show when={!loading()} fallback={<ld-loading class="m-auto" />}>
            <>
              <Logo
                tag="div"
                href="/"
                class="mb-ld-16 self-start block lg:hidden"
              />

              <div class="my-auto">
                <ld-typo variant="h1" class="block mb-ld-40">
                  Login
                </ld-typo>

                <form
                  autocomplete="on"
                  class="grid w-full gap-ld-24 pb-ld-40"
                  novalidate
                  onSubmit={onSubmit}
                  ref={(el) => (formRef = el)}
                >
                  <TextInput
                    autofocus
                    autocomplete="email"
                    control={group.controls.email}
                    label="Email"
                    name="email"
                    tone="dark"
                    type="email"
                  />

                  <TextInput
                    autocomplete="current-password"
                    control={group.controls.password}
                    label="Password"
                    name="password"
                    tone="dark"
                    type="password"
                  />

                  <ld-button
                    mode="highlight"
                    onClick={onSubmit}
                    progress={group.isSubmitted ? 'pending' : undefined}
                  >
                    <span class="px-8">Login</span>
                  </ld-button>

                  {/* We need an additional input to trigger form submission on enter. */}
                  <input class="hidden" type="submit" />
                </form>

                <div>
                  <ld-typo variant="body-m" tag="h2">
                    Don't have an account yet?&ensp;
                    <ld-link href="/signup">Sign&nbsp;up&nbsp;here.</ld-link>
                  </ld-typo>

                  <ld-typo>
                    Problems signing in?&ensp;
                    <ld-link href="/recover">Recover your account.</ld-link>
                  </ld-typo>
                </div>
              </div>
            </>
          </Show>
        </div>
      </main>
    </div>
  )
}

export default Login
