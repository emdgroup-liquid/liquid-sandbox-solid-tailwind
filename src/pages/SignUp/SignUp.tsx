import type { Component } from 'solid-js'
import { createFormControl } from 'solid-forms'
import Aside from '../../components/Aside/Aside'
import Logo from '../../components/Logo/Logo'
import TextInput from '../../components/TextInput/TextInput'
import { createEffect, createSignal } from 'solid-js'
import { getPasswordRating } from './passwordScore'

const SignUp: Component = () => {
  const steps = ['Enter your Email', 'Set password']
  const [currentStep, setCurrentStep] = createSignal(0)
  const [isSubmitted, setIsSubmitted] = createSignal(false)
  const [passwordRating, setPasswordRating] = createSignal('poop')

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

  createEffect(() => {
    setPasswordRating(getPasswordRating(passwordControl.value))
  })

  const onSubmitEmail = async () => {
    if (!emailControl.isValid) {
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
    emailControl.markSubmitted(true)
    const email = emailControl.value
    await new Promise((resolve) => setTimeout(resolve, 500))
    emailControl.markSubmitted(false)

    console.info('TODO save email in state', email)
    setCurrentStep(1)
  }

  const onSubmitPassword = async () => {
    if (!passwordControl.isValid) {
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
    passwordControl.markSubmitted(true)
    const password = passwordControl.value
    await new Promise((resolve) => setTimeout(resolve, 500))
    passwordControl.markSubmitted(false)

    console.info('TODO save password in state', password)
  }

  const onSubmit = async (ev: Event) => {
    ev.preventDefault()
    if (isSubmitted()) return

    setIsSubmitted(true)

    switch (currentStep()) {
      case 0:
        await onSubmitEmail()
        break
      case 1:
        await onSubmitPassword()
        break
    }

    setIsSubmitted(false)
  }

  return (
    <div class="flex w-full">
      <Aside>
        <Logo tag="div" href="/" class="mb-ld-40" />

        <ld-typo variant="h3" tag="h2" class="text-wht mb-ld-24">
          Step {currentStep() + 1} of {steps.length}
        </ld-typo>

        <ld-stepper vertical brand-color>
          {steps.map((stepLabel, index) => (
            <ld-step
              current={index === currentStep()}
              done={index < currentStep()}
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
              novalidate
              onSubmit={onSubmit}
            >
              {currentStep() === 0 && (
                <TextInput
                  autocomplete="email"
                  autofocus
                  control={emailControl}
                  label="Email"
                  name="name"
                  // placeholder="e.g. jason.parse@example.com"
                  tone="dark"
                  type="email"
                />
              )}

              {currentStep() === 1 && (
                <>
                  <TextInput
                    autocomplete="new-password"
                    autofocus
                    control={passwordControl}
                    label="Password"
                    name="name"
                    // placeholder="••••••••••••"
                    tone="dark"
                    type="password"
                  />

                  <div
                    class="flex flex-wrap transition-opacity items-baseline -mt-ld-16"
                    classList={
                      {
                        // hidden: !passwordControl.value,
                      }
                    }
                    style={{
                      '--password-rating-col': (() => {
                        switch (passwordRating()) {
                          case 'strong':
                            return 'var(--ld-col-rg)'
                          case 'good':
                            return 'var(--ld-col-vg)'
                          case 'weak':
                            return 'var(--ld-col-vy)'
                          default:
                            return 'var(--ld-col-rr)'
                        }
                      })(),
                    }}
                  >
                    <ld-typo variant="body-s" class="mr-ld-12">
                      Password strengh:
                    </ld-typo>
                    <ld-progress
                      class="flex-grow"
                      style={{
                        '--ld-progress-bar-col': 'var(--password-rating-col)',
                      }}
                      aria-label={passwordRating()}
                      aria-valuemax="4"
                      aria-valuenow={(() => {
                        if (!passwordControl.value) return 0
                        switch (passwordRating()) {
                          case 'strong':
                            return 4
                          case 'good':
                            return 3
                          case 'weak':
                            return 2
                          default:
                            return 1
                        }
                      })()}
                      // steps
                    ></ld-progress>
                    <ld-typo
                      aria-hidden="true"
                      class="w-full text-right h-ld-2 capitalize"
                      variant="label-s"
                    >
                      {passwordRating()}
                    </ld-typo>
                  </div>
                </>
              )}

              <ld-button
                mode="highlight"
                onClick={onSubmit}
                progress={isSubmitted() ? 'pending' : undefined}
                aria-describedby={
                  currentStep() === steps.length - 1
                    ? 'conditions-notice'
                    : undefined
                }
              >
                <span class="px-8">
                  {currentStep() === steps.length - 1
                    ? 'Create account'
                    : 'Continue'}
                </span>
              </ld-button>
            </form>

            {currentStep() === steps.length - 1 && (
              <ld-typo id="conditions-notice" variant="body-m" tag="h2">
                By creating an account with us, you agree to our{' '}
                <ld-link href="/terms">terms&nbsp;and&nbsp;conditions</ld-link>.
              </ld-typo>
            )}

            <ld-typo variant="body-m" tag="h2" class="mb-ld-40">
              Already have an account?&ensp;
              <ld-link href="/login">Log&nbsp;in&nbsp;here</ld-link>.
            </ld-typo>
          </div>

          <div class="text-center lg:hidden">
            <ld-typo variant="h6" tag="h2" class="h-ld-6">
              Step {currentStep() + 1} of {steps.length}
            </ld-typo>

            <ld-stepper size="sm">
              {steps.map((stepLabel, index) => (
                <ld-step
                  aria-label={stepLabel}
                  current={index === currentStep()}
                  done={index < currentStep()}
                  last-active={index === currentStep()}
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
