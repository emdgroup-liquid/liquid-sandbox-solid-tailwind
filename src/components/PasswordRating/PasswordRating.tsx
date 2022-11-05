import { getPasswordRating, getPasswordScore } from '../../utils/passwordScore'
import { type Component, createEffect, createSignal } from 'solid-js'

interface PasswordRatingProps {
  class?: string
  classList?: { [k: string]: boolean | undefined }
  ref?: (el: HTMLElement) => void
  passwordValue?: string
}

const PasswordRating: Component<PasswordRatingProps> = (
  props: PasswordRatingProps
) => {
  const [passwordRating, setPasswordRating] = createSignal('poop')

  createEffect(() => {
    setPasswordRating(getPasswordRating(props.passwordValue))
  })

  return (
    <div
      ref={props.ref}
      class={props.class}
      classList={props.classList}
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
        aria-valuenow={Math.min(100, getPasswordScore(props.passwordValue))}
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
  )
}

export default PasswordRating
