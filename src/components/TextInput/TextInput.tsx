import { loadComponents } from '../../liquidLoader'
import '@emdgroup-liquid/liquid/dist/css/ld-input.css'
import { createFormControl, IFormControl } from 'solid-forms'
import {
  Show,
  mergeProps,
  type Component,
  type JSX,
  onMount,
  createSignal,
} from 'solid-js'

interface TextInputProps {
  autocomplete?: string
  autofocus?: boolean
  class?: string
  classList?: { [k: string]: boolean | undefined }
  control?: IFormControl
  iconStart?: JSX.Element
  iconEnd?: JSX.Element
  inputRef?: (el: HTMLInputElement) => void
  label: string | JSX.Element
  min?: string
  name?: string
  placeholder?: string
  ref?: (el: HTMLElement) => void
  size?: 'sm' | 'lg'
  spellcheck?: boolean
  successMessage?: string | JSX.Element
  tone?: 'dark'
  tooltip?: JSX.Element
  type?: string
}

const TextInput: Component<TextInputProps> = (props: TextInputProps) => {
  loadComponents([
    'ld-icon',
    'ld-button',
    'ld-label',
    'ld-input-message',
    'ld-progress',
  ])

  // Provide a default form control in case the user doesn't supply one.
  props = mergeProps({ control: createFormControl('') }, props)
  if (!props.control) return ''

  const [passwordVisible, setPasswordVisible] = createSignal(false)

  const togglePasswordVisibility = (ev: MouseEvent) => {
    ev.preventDefault()
    setPasswordVisible(!passwordVisible())
  }

  function capitalize(s: string) {
    return s[0].toUpperCase() + s.slice(1)
  }
  const thisField = props.name ? capitalize(props.name) : 'This field'

  let inputRef: HTMLInputElement
  let inputWrapperRef: HTMLDivElement

  onMount(() => {
    if (!props.autofocus) return
    setTimeout(() => {
      inputRef.focus()
    }, 100)
  })

  return (
    <ld-label ref={props.ref} class={props.class} classList={props.classList}>
      <span>
        {props.label} {props.tooltip}
      </span>
      <div
        class="ld-input"
        classList={{
          ['ld-input--' + props.size]: !!props.size,
          'ld-input--dark': props.tone === 'dark',
          'ld-input--invalid':
            props.control.isTouched && !!props.control.errors,
        }}
        onFocusOut={(ev) => {
          const hasFocusInside =
            (ev.relatedTarget as HTMLElement)?.closest('.ld-input') ===
            inputWrapperRef
          if (hasFocusInside) return
          setPasswordVisible(false)
        }}
        ref={(el) => (inputWrapperRef = el)}
      >
        {props.iconStart}
        <input
          autocapitalize="off"
          autocomplete={props.autocomplete}
          min={props.min}
          onInput={(ev) => {
            const eventTarget = ev.currentTarget
            props.control?.setValue(eventTarget.value || '')
          }}
          placeholder={props.placeholder}
          ref={(el) => {
            inputRef = el
            props.inputRef?.call(this, el)
          }}
          required={props.control.isRequired}
          spellcheck={!!props.spellcheck}
          type={
            props.type === 'password' && passwordVisible() ? 'text' : props.type
          }
          value={props.control.value}
        />
        {props.type === 'password' ? (
          <ld-button
            type="button"
            onClick={togglePasswordVisibility}
            role="switch"
            aria-checked={passwordVisible()}
            mode="ghost"
          >
            <ld-icon class="pointer-events-none">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Toggle password visibility</title>
                {!passwordVisible() && (
                  <>
                    <path
                      d="M10.96 11.71a2.22 2.22 0 0 1 3.15-3.14l4.84 4.84a2.22 2.22 0 0 1-3.15 3.14l-4.84-4.84ZM8.95 11.71A2.22 2.22 0 1 0 5.8 8.57L.96 13.41a2.22 2.22 0 0 0 3.15 3.14l4.84-4.84Z"
                      fill="currentColor"
                    />
                    <path
                      d="M9 10a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM12 11a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM11.5 14a.5.5 0 0 0 0-1h-3a.5.5 0 0 0 0 1h3Z"
                      fill="currentColor"
                    />
                  </>
                )}
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M0 7a3 3 0 0 0 2 2.83V12a8 8 0 1 0 16 0V9.83A3 3 0 0 0 16.93 4 8 8 0 0 0 3.07 4H3a3 3 0 0 0-3 3Zm14.62 5a2.59 2.59 0 0 0-1.33 2.23v.01c0 .75-.36 1.45-1 1.97-.63.53-1.47.8-2.37.79-1.74-.03-3.14-1.2-3.21-2.65V14.2c.01-.87-.49-1.7-1.33-2.2A2.66 2.66 0 0 1 4 9.76C4 8.28 5.43 7.04 7.2 7h.09c.89 0 1.74.3 2.36.84.1.08.22.12.35.12.13 0 .26-.04.35-.12A3.65 3.65 0 0 1 12.8 7c1.77.04 3.2 1.28 3.2 2.76 0 .9-.52 1.73-1.38 2.25ZM9 10a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm-.5 3a.5.5 0 0 0 0-1h-3a.5.5 0 0 0 0 1h3Z"
                  fill="currentColor"
                />
              </svg>
            </ld-icon>
          </ld-button>
        ) : (
          props.iconEnd
        )}
      </div>
      <Show when={props.control.isTouched && props.control.errors?.missing}>
        <ld-input-message mode="error">
          {thisField} is required.
        </ld-input-message>
      </Show>
      <Show when={props.control.isTouched && props.control.errors?.inPast}>
        <ld-input-message mode="error">
          {thisField} must be in the future.
        </ld-input-message>
      </Show>
      <Show when={props.control.isTouched && props.control.errors?.invalid}>
        <ld-input-message mode="error">
          {thisField} is invalid.
        </ld-input-message>
      </Show>
      <Show
        when={
          props.successMessage &&
          props.control.isTouched &&
          !props.control.errors
        }
      >
        <ld-input-message mode="valid">{props.successMessage}</ld-input-message>
      </Show>
    </ld-label>
  )
}

export default TextInput
