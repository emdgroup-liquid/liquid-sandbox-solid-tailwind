import Aside from '../../components/Aside/Aside'
import Logo from '../../components/Logo/Logo'
import TextInput from '../../components/TextInput/TextInput'
import { getPasswordRating, getPasswordScore } from './passwordScore'
import { useNavigate } from '@solidjs/router'
import { createFormControl } from 'solid-forms'
import type { Component } from 'solid-js'
import { createEffect, createSignal, For, Match, Show, Switch } from 'solid-js'

const SignUp: Component = () => {
  const navigate = useNavigate()
  let formRef: HTMLFormElement

  const emailControl = createFormControl(
    localStorage.getItem('user_email') || '',
    {
      required: true,
      validators: (value: string) => {
        if (value.length === 0) return { missing: true }
        if (!value.includes('@')) return { invalid: true }
        return null
      },
    }
  )
  const passwordControl = createFormControl(
    localStorage.getItem('user_password') || '',
    {
      required: true,
      validators: (value: string) => {
        return value.length === 0 ? { missing: true } : null
      },
    }
  )

  const steps = ['Enter your Email', 'Set password']
  const [currentStep, setCurrentStep] = createSignal(0)
  const [isSubmitted, setIsSubmitted] = createSignal(false)
  const [passwordRating, setPasswordRating] = createSignal('poop')
  const stepsDoneIndices: number[] = []
  if (localStorage.getItem('user_email')) stepsDoneIndices.push(0)
  if (localStorage.getItem('user_password')) stepsDoneIndices.push(1)
  const [stepsDone, setStepsDone] = createSignal(new Set(stepsDoneIndices))

  createEffect(() => {
    if (localStorage.getItem('session')) {
      navigate('/dashboard', { replace: true })
      return
    }
    setPasswordRating(getPasswordRating(passwordControl.value))
  })

  const onSubmitEmail = async () => {
    emailControl.markTouched(true)

    if (!emailControl.isValid) {
      setTimeout(() => {
        formRef
          .querySelector<HTMLInputElement>('.ld-input--invalid input')
          ?.focus()
      }, 100)
      return
    }

    dispatchEvent(new CustomEvent('ldNotificationClear'))

    // Simulate asynchronous fetch.
    emailControl.markSubmitted(true)
    const email = emailControl.value
    await new Promise((resolve) => setTimeout(resolve, 500))
    emailControl.markSubmitted(false)

    localStorage.setItem('user_email', email)
    setStepsDone(new Set([...stepsDone(), 0]))
    setCurrentStep(1)
  }

  const onSubmitPassword = async () => {
    passwordControl.markTouched(true)

    if (!passwordControl.isValid) {
      setTimeout(() => {
        formRef
          .querySelector<HTMLInputElement>('.ld-input--invalid input')
          ?.focus()
      }, 100)
      return
    }

    dispatchEvent(new CustomEvent('ldNotificationClear'))

    // Simulate asynchronous fetch.
    passwordControl.markSubmitted(true)
    const password = passwordControl.value
    await new Promise((resolve) => setTimeout(resolve, 500))
    passwordControl.markSubmitted(false)

    localStorage.setItem('user_password', password)
    localStorage.setItem('session', 'yes') // Fake session.
    setStepsDone(new Set([...stepsDone(), 1]))

    navigate('/dashboard', { replace: true })
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
          <For each={steps}>
            {(stepLabel, i) => (
              <ld-step
                current={i() === currentStep()}
                disabled={i() > currentStep() && !stepsDone().has(i() - 1)}
                done={i() < currentStep() || stepsDone().has(i())}
                last-active={i() === currentStep()}
                onClick={() => {
                  setCurrentStep(i())
                }}
              >
                {stepLabel}
              </ld-step>
            )}
          </For>
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
              ref={(el) => (formRef = el)}
            >
              <Switch
                fallback={
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
                }
              >
                <Match when={currentStep() === 1}>
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
                      class="flex-grow mb-ld-4"
                      style={{
                        '--ld-progress-bar-col': 'var(--password-rating-col)',
                      }}
                      aria-label={passwordRating()}
                      aria-valuenow={Math.min(
                        100,
                        getPasswordScore(passwordControl.value)
                      )}
                      // steps
                    ></ld-progress>
                    <ld-typo
                      aria-hidden="true"
                      class="w-full text-right h-0 capitalize"
                      variant="label-s"
                    >
                      {passwordRating()}
                    </ld-typo>
                  </div>
                </Match>
              </Switch>

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

            <Show when={currentStep() === steps.length - 1}>
              <ld-typo id="conditions-notice" variant="body-m" tag="h2">
                By creating an account with us, you agree to our{' '}
                <ld-link href="/terms">terms&nbsp;and&nbsp;conditions</ld-link>.
              </ld-typo>
            </Show>

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
              <For each={steps}>
                {(stepLabel, i) => (
                  <ld-step
                    aria-label={stepLabel}
                    current={i() === currentStep()}
                    disabled={i() > currentStep() && !stepsDone().has(i() - 1)}
                    done={i() < currentStep() || stepsDone().has(i())}
                    last-active={i() === currentStep()}
                    onClick={() => {
                      setCurrentStep(i())
                    }}
                  />
                )}
              </For>
            </ld-stepper>
          </div>
        </div>
      </main>
    </div>
  )
}

export default SignUp
