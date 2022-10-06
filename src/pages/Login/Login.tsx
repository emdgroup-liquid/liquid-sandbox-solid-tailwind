import type { Component } from 'solid-js'
import { createEffect } from 'solid-js'
import { createFormGroup, createFormControl } from 'solid-forms'
import Aside from '../../components/Aside/Aside'
import Logo from '../../components/Logo/Logo'
import TextInput from '../../components/TextInput/TextInput'
import { useNavigate } from '@solidjs/router'

const Login: Component = () => {
  const navigate = useNavigate()

  const group = createFormGroup({
    email: createFormControl(localStorage.getItem('user_email') || '', {
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

  // This will automatically re-run whenever `group.isDisabled`, `group.isValid` or `group.value` change
  createEffect(() => {
    if (group.isDisabled || !group.isValid) return
  })

  const onSubmit = async (ev: Event) => {
    ev.preventDefault()
    if (group.isSubmitted) return

    if (!group.isValid) {
      dispatchEvent(
        new CustomEvent('ldNotificationAdd', {
          detail: {
            content: 'The login data is invalid.',
            type: 'alert',
          },
        })
      )
      return
    }

    dispatchEvent(new CustomEvent('ldNotificationClear'))

    // Simulate asynchronous fetch.
    group.markSubmitted(true)
    const { email, password } = group.value
    await new Promise((resolve) => setTimeout(resolve, 500))
    group.markSubmitted(false)

    const isLoginSuccessful =
      email === localStorage.getItem('user_email') &&
      password === localStorage.getItem('user_password')

    if (isLoginSuccessful) {
      navigate('/home', { replace: true })
    } else {
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

      <main class="flex flex-grow justify-center self-center px-ld-24 py-ld-40 sm:px-ld-40 min-h-screen shadow-hover">
        <div class="container flex-grow mx-auto relative max-w-2xl flex flex-col">
          <Logo
            tag="div"
            href="/"
            class="mb-ld-16 self-start block lg:hidden"
          />

          <div class="my-auto">
            <ld-typo variant="h1" class="block my-ld-40">
              Login
            </ld-typo>

            <form
              class="grid w-full grid-cols-1 md:grid-cols-1 gap-ld-24 pb-ld-40"
              onSubmit={onSubmit}
            >
              <TextInput
                control={group.controls.email}
                label="Email"
                name="name"
                placeholder="e.g. jason.parse@example.com"
                tone="dark"
                type="email"
              />

              <TextInput
                control={group.controls.password}
                label="Password"
                name="password"
                placeholder="••••••••••••"
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
        </div>
      </main>
    </div>
  )
}

export default Login
