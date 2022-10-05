import { Show, mergeProps, type Component, JSX } from 'solid-js'
import { createFormControl, IFormControl } from 'solid-forms'

interface TextInputProps {
  control?: IFormControl
  label: string | JSX.Element
  name?: string
  placeholder?: string
  type?: string
  tone?: 'dark'
  successMessage?: string | JSX.Element
}

export const TextInput: Component<TextInputProps> = (props: TextInputProps) => {
  // Provide a default form control in case the user doesn't supply one.
  props = mergeProps({ control: createFormControl('') }, props)
  if (!props.control) return ''

  return (
    <ld-label>
      {props.label}
      <ld-input
        type={props.type}
        tone={props.tone}
        placeholder={props.placeholder}
        value={props.control.value}
        invalid={props.control.isTouched && !!props.control.errors}
        required={props.control.isRequired}
        onLdinput={(ev) => {
          const eventTarget = ev.currentTarget as HTMLLdInputElement
          props.control?.setValue(eventTarget.value || '')
        }}
        onblur={() => props.control?.markTouched(true)}
      ></ld-input>
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
