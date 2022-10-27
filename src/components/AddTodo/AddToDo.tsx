import TextInput from '../../components/TextInput/TextInput'
import { createFormGroup, createFormControl } from 'solid-forms'
import type { Component } from 'solid-js'
import { createSignal, JSX, Show } from 'solid-js'

interface AddToDoProps {
  class?: string
  classList?: { [k: string]: boolean | undefined }
  style?: JSX.CSSProperties
}

const AddToDo: Component<AddToDoProps> = (props) => {
  let formRef: HTMLFormElement

  const [loading, setLoading] = createSignal(true)

  const group = createFormGroup({
    task: createFormControl(localStorage.getItem('task') || '', {
      required: true,
      validators: (value: string) => {
        if (value.length === 0) return { missing: true }
        return null
      },
    }),
  })

  const onSubmit = async (ev: Event) => {
    ev.preventDefault()
    if (group.isSubmitted) return

    group.controls.task.markTouched(true)

    if (!group.isValid) {
      setTimeout(() => {
        formRef
          .querySelector<HTMLInputElement>('.ld-input--invalid input')
          ?.focus()
      }, 100)
      return
    }

    dispatchEvent(new CustomEvent('ldNotificationClear'))

    // Simulate asynchronous fetch.
    group.markSubmitted(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    group.markSubmitted(false)
  }

  return (
    <div class={props.class} classList={props.classList} style={props.style}>
      <form
        class="grid w-full grid-cols-2 gap-ld-16 pb-ld-40"
        noValidate
        onSubmit={onSubmit}
        ref={(el) => (formRef = el)}
      >
        <TextInput
          control={group.controls.task}
          label="Add a task"
          class="col-span-2"
          name="name"
          // placeholder="Add a task"
          tone="dark"
          type="email"
        />

        <div class="col-start-2 flex">
          <ld-button
            class="ml-auto"
            mode="highlight"
            onClick={onSubmit}
            progress={group.isSubmitted ? 'pending' : undefined}
          >
            <span class="px-8">Add</span>
          </ld-button>
        </div>
      </form>
    </div>
  )
}

export default AddToDo
