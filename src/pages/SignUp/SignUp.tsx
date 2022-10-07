import type { Component } from 'solid-js'
import { createFormGroup, createFormControl } from 'solid-forms'
import Aside from '../../components/Aside/Aside'
import Logo from '../../components/Logo/Logo'
import TextInput from '../../components/TextInput/TextInput'
import { createSignal } from 'solid-js'

const SignUp: Component = () => {
  const steps = ['Enter your Email', 'Set password']
  const [currentStep, setCurrentStep] = createSignal(0)

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

  const onSubmitEmail = async () => {
    if (!group.isValid) {
      dispatchEvent(
        new CustomEvent('ldNotificationAdd', {
          detail: {
            content: 'This email is invalid.',
            type: 'alert',
          },
        })
      )
      return
    }

    dispatchEvent(new CustomEvent('ldNotificationClear'))

    // Simulate asynchronous fetch.
    group.markSubmitted(true)
    const { email } = group.value
    await new Promise((resolve) => setTimeout(resolve, 500))
    group.markSubmitted(false)

    console.info('TODO save email in state', email)
    setCurrentStep(1)
  }

  const onSubmitPassword = async () => {
    if (!group.isValid) {
      dispatchEvent(
        new CustomEvent('ldNotificationAdd', {
          detail: {
            content: 'This password does not suffice safety requirements.',
            type: 'alert',
          },
        })
      )
      return
    }

    dispatchEvent(new CustomEvent('ldNotificationClear'))

    // Simulate asynchronous fetch.
    group.markSubmitted(true)
    const { email } = group.value
    await new Promise((resolve) => setTimeout(resolve, 500))
    group.markSubmitted(false)

    console.info('TODO save password in state', email)
  }

  const onSubmit = async (ev: Event) => {
    ev.preventDefault()
    if (group.isSubmitted) return

    switch (currentStep()) {
      case 0:
        onSubmitEmail()
        return
      case 1:
        onSubmitPassword()
        return
    }
  }

  return (
    <div class="flex w-full">
      <Aside>
        <Logo tag="div" href="/" class="mb-ld-40" />

        <ld-typo variant="h3" tag="h2" class="text-wht mb-ld-16">
          Step {currentStep() + 1} of {steps.length}
        </ld-typo>

        <ld-stepper vertical brand-color>
          {steps.map((stepLabel, index) => (
            <ld-step
              current={index === currentStep()}
              last-active={index === currentStep()}
            >
              {stepLabel}
            </ld-step>
          ))}
        </ld-stepper>
      </Aside>

      <main class="flex flex-grow justify-center self-center px-ld-24 py-ld-40 sm:px-ld-40 min-h-screen shadow-hover">
        <div class="container flex-grow mx-auto relative max-w-2xl flex flex-col">
          <Logo
            tag="div"
            href="/"
            class="mb-ld-16 self-start block lg:hidden"
          />

          <div class="my-auto">
            <ld-typo variant="h1" class="block mb-ld-40">
              Sign-up
            </ld-typo>

            <form
              autocomplete="on"
              class="grid w-full grid-cols-1 md:grid-cols-1 gap-ld-24 pb-ld-40"
              onSubmit={onSubmit}
            >
              <TextInput
                autocomplete="email"
                control={group.controls.email}
                label="Email"
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
                <span class="px-8">Continue</span>
              </ld-button>
            </form>

            <ld-typo variant="body-m" tag="h2" class="mb-ld-40">
              Already have an account?&ensp;
              <ld-link href="/login">Log&nbsp;in&nbsp;here.</ld-link>
            </ld-typo>
          </div>

          <div class="text-center lg:hidden">
            <ld-typo variant="h6" tag="h2" class="h-ld-6">
              Step {currentStep() + 1} of {steps.length}
            </ld-typo>

            <ld-stepper size="sm">
              {steps.map((stepLabel, index) => (
                <ld-step
                  current={index === currentStep()}
                  last-active={index === currentStep()}
                  aria-label={stepLabel}
                />
              ))}
            </ld-stepper>
          </div>
        </div>
      </main>
    </div>
  )
}

export default SignUp
