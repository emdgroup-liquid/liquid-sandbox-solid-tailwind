import type { Component } from 'solid-js'
import { createEffect } from 'solid-js'
import { createFormGroup, createFormControl } from 'solid-forms'
import { TextInput } from '../../components/TextInput/TextInput'
import { useNavigate } from '@solidjs/router'

const SignUp: Component = () => {
  const navigate = useNavigate()

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
    <form onSubmit={onSubmit}>
      <ld-typo variant="b2" tag="h1" class="text-vy mb-ld-32">
        Sign-Up
      </ld-typo>

      <ld-breadcrumbs
        style={{
          filter:
            'invert(1) hue-rotate(180deg) brightness(1.5) saturate(0.7) drop-shadow(rgba(0, 0, 0, 0.2) 0px 1px 2px)',
        }}
        class="block mb-ld-24"
      >
        <ld-crumb href="/">Home</ld-crumb>
        <ld-crumb href="/login">Login</ld-crumb>
        <ld-crumb href="/signup/">Sign-Up</ld-crumb>
      </ld-breadcrumbs>

      <div class="bg-wht rounded-l shadow-hover p-ld-32 flex flex-col align-center justify-items-center">
        <div class="grid grid-cols-1 md:grid-cols-1 gap-ld-24">
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
            href="/login"
            mode="highlight"
            onClick={onSubmit}
            progress={group.isSubmitted ? 'pending' : undefined}
          >
            <span class="px-8">Create Account</span>
          </ld-button>
        </div>
      </div>
    </form>
  )
}

export default SignUp
