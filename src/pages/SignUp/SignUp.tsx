import Aside from '../../components/Aside/Aside'
import Logo from '../../components/Logo/Logo'
import TextInput from '../../components/TextInput/TextInput'
import { createUser, getSession, userExists } from '../../services/user'
import { getPasswordRating, getPasswordScore } from './passwordScore'
import { useNavigate } from '@solidjs/router'
import { createFormControl } from 'solid-forms'
import {
  createEffect,
  createSignal,
  For,
  Match,
  Show,
  Switch,
  type Component,
} from 'solid-js'

const SignUpStep: Component<{
  compact?: boolean
  currentStep: number
  index: number
  setCurrentStep: (index: number) => void
  stepLabel: string
  stepsDone: Set<number>
}> = (props) => {
  return (
    <ld-step
      aria-label={props.compact ? props.stepLabel : undefined}
      current={props.index === props.currentStep}
      disabled={
        props.index > props.currentStep && !props.stepsDone.has(props.index - 1)
      }
      done={props.index < props.currentStep || props.stepsDone.has(props.index)}
      last-active={
        props.index === props.currentStep && !props.stepsDone.has(props.index)
      }
      next={props.stepsDone.has(props.index - 1)}
      onClick={() => {
        props.setCurrentStep(props.index)
      }}
    >
      <Show when={!props.compact}>{props.stepLabel}</Show>
    </ld-step>
  )
}

const SignUp: Component = () => {
  const navigate = useNavigate()
  let formRef: HTMLFormElement

  const emailControl = createFormControl(
    localStorage.getItem('user_signup_email') || '',
    {
      required: true,
      validators: (value: string) => {
        if (value.length === 0) return { missing: true }
        if (!value.includes('@')) return { invalid: true }
        return null
      },
    }
  )
  const passwordControl = createFormControl('', {
    required: true,
    validators: (value: string) => {
      return value.length === 0 ? { missing: true } : null
    },
  })

  const [loading, setLoading] = createSignal(true)

  const steps = ['Enter your Email', 'Set password']
  const [currentStep, setCurrentStep] = createSignal(0)
  const [isSubmitted, setIsSubmitted] = createSignal(false)
  const [passwordRating, setPasswordRating] = createSignal('poop')
  const stepsDoneIndices: number[] = []
  if (localStorage.getItem('user_signup_email')) stepsDoneIndices.push(0)
  const [stepsDone, setStepsDone] = createSignal(new Set(stepsDoneIndices))

  createEffect(async () => {
    dispatchEvent(new CustomEvent('ldNotificationClear'))
    const session = await getSession()
    if (session) {
      navigate('/todo', { replace: true })
    }
    setLoading(false)
  })

  createEffect(() => {
    setPasswordRating(getPasswordRating(passwordControl.value))
  })

  const onSubmitEmail = async () => {
    emailControl.markTouched(true)

    if (!emailControl.isValid) {
      setTimeout(() => {
        formRef.querySelector<HTMLInputElement>('.ld-input input')?.focus()
      }, 100)
      return
    }

    dispatchEvent(new CustomEvent('ldNotificationClear'))
    passwordControl.markSubmitted(true)

    const email = emailControl.value
    const emailTaken = await userExists(email)
    emailControl.markSubmitted(false)
    if (emailTaken) {
      formRef.querySelector<HTMLInputElement>('.ld-input input')?.focus()
      dispatchEvent(
        new CustomEvent('ldNotificationAdd', {
          detail: {
            content:
              '<span>An account with this email already exists. Would you like to <ld-link href="/login">log in</ld-link>?</span>',
            timeout: 0,
            type: 'warn',
          },
        })
      )
      return
    }

    localStorage.setItem('user_signup_email', email)
    setStepsDone(new Set([...stepsDone(), 0]))
    setCurrentStep(1)
  }

  const onSubmitPassword = async () => {
    passwordControl.markTouched(true)

    if (!passwordControl.isValid) {
      setTimeout(() => {
        formRef.querySelector<HTMLInputElement>('.ld-input input')?.focus()
      }, 100)
      return
    }

    dispatchEvent(new CustomEvent('ldNotificationClear'))
    passwordControl.markSubmitted(true)

    // Create user.
    const email = emailControl.value
    const password = passwordControl.value
    await createUser(email, password)

    passwordControl.markSubmitted(false)

    // Clean up.
    localStorage.removeItem('user_signup_email')

    // Redirect.
    navigate('/todo', { replace: true })
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

        <Show when={!loading()}>
          <>
            <ld-typo variant="h3" tag="h2" class="text-wht mb-ld-24">
              Step {currentStep() + 1} of {steps.length}
            </ld-typo>

            <ld-stepper vertical brand-color>
              <For each={steps}>
                {(stepLabel, i) => (
                  <SignUpStep
                    currentStep={currentStep()}
                    index={i()}
                    setCurrentStep={setCurrentStep}
                    stepLabel={stepLabel}
                    stepsDone={stepsDone()}
                  />
                )}
              </For>
            </ld-stepper>
          </>
        </Show>
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
                  Sign-up
                </ld-typo>

                <form
                  autocomplete="on"
                  class="grid w-full gap-ld-24 pb-ld-40"
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
                            '--ld-progress-bar-col':
                              'var(--password-rating-col)',
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
                    <ld-link href="/terms">
                      terms&nbsp;and&nbsp;conditions
                    </ld-link>
                    .
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
                      <SignUpStep
                        compact
                        currentStep={currentStep()}
                        index={i()}
                        setCurrentStep={setCurrentStep}
                        stepLabel={stepLabel}
                        stepsDone={stepsDone()}
                      />
                    )}
                  </For>
                </ld-stepper>
              </div>
            </>
          </Show>
        </div>
      </main>
    </div>
  )
}

export default SignUp
