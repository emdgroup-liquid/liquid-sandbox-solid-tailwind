import { Show, mergeProps, type Component, JSX } from 'solid-js'
import { createFormControl, IFormControl } from 'solid-forms'
import '@emdgroup-liquid/liquid/dist/css/ld-input.css'

interface TextInputProps {
  ref?: (el: HTMLInputElement) => void
  autofocus?: boolean
  control?: IFormControl
  label: string | JSX.Element
  name?: string
  placeholder?: string
  type?: string
  tone?: 'dark'
  autocomplete?: string
  successMessage?: string | JSX.Element
}

const TextInput: Component<TextInputProps> = (props: TextInputProps) => {
  // Provide a default form control in case the user doesn't supply one.
  props = mergeProps({ control: createFormControl('') }, props)
  if (!props.control) return ''

  return (
    <ld-label>
      {props.label}
      <div
        class="ld-input"
        classList={{
          'ld-input--dark': props.tone === 'dark',
          'ld-input--invalid':
            props.control.isTouched && !!props.control.errors,
        }}
      >
        <input
          autocomplete={props.autocomplete}
          type={props.type}
          placeholder={props.placeholder}
          value={props.control.value}
          ref={props.ref}
          required={props.control.isRequired}
          onInput={(ev) => {
            const eventTarget = ev.currentTarget
            props.control?.setValue(eventTarget.value || '')
          }}
          onBlur={() => props.control?.markTouched(true)}
        />
      </div>
      <Show when={props.control.isTouched && props.control.errors?.missing}>
        <ld-input-message mode="error">
          {props.label} is required.
        </ld-input-message>
      </Show>
      <Show when={props.control.isTouched && props.control.errors?.invalid}>
        <ld-input-message mode="error">
          {props.label} is invalid.
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
