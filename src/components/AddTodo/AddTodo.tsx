import TextInput from '../../components/TextInput/TextInput'
import { createFormGroup, createFormControl } from 'solid-forms'
import type { Component } from 'solid-js'
import { JSX } from 'solid-js'

interface AddTodoProps {
  class?: string
  classList?: { [k: string]: boolean | undefined }
  style?: JSX.CSSProperties
  createTodo: (todo: Omit<Todo, 'id' | 'createdAt'>) => Promise<void>
}

const AddTodo: Component<AddTodoProps> = (props) => {
  let formRef: HTMLFormElement
  let addTodoInputRef: HTMLElement

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

    group.markSubmitted(true)
    const { task } = group.value
    let isTodoCreated = false
    try {
      await props.createTodo({ description: task || '' })
      isTodoCreated = true
      dispatchEvent(
        new CustomEvent('ldNotificationAdd', {
          detail: {
            content: 'Task has been created.',
            type: 'info',
          },
        })
      )
    } catch (err) {
      dispatchEvent(
        new CustomEvent('ldNotificationAdd', {
          detail: {
            content: (err as Error)?.message || 'Failed creating task.',
            type: 'alert',
          },
        })
      )
    }
    if (isTodoCreated) {
      formRef.reset()
      addTodoInputRef.querySelector('input')?.focus()
    }
    group.markSubmitted(false)
  }

  return (
    <ld-card
      size="sm"
      class={props.class}
      classList={props.classList}
      style={props.style}
    >
      <form
        class="grid w-full grid-cols-2 gap-ld-12"
        noValidate
        onSubmit={onSubmit}
        ref={(el) => (formRef = el)}
      >
        <TextInput
          ref={(el: HTMLElement) => (addTodoInputRef = el)}
          control={group.controls.task}
          label="Add a task"
          class="col-span-2"
          name="description"
          tone="dark"
          type="email"
          iconStart={
            <ld-icon>
              <svg
                width="23"
                height="23"
                viewBox="0 0 23 23"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M10.45 2.28c-.4.32-.46.85-.46 1.36v6.35H3.64c-.5 0-1.04.07-1.36.46-.2.23-.36.58-.36 1.05 0 .47.16.82.36 1.05.32.4.85.46 1.36.46h6.35v6.35c0 .5.07 1.04.46 1.36.23.2.58.36 1.05.36.47 0 .82-.16 1.05-.36.4-.32.46-.85.46-1.36v-6.35h6.35c.5 0 1.04-.07 1.36-.46.2-.23.36-.58.36-1.05 0-.47-.16-.82-.36-1.05-.32-.4-.85-.46-1.36-.46h-6.35V3.64c0-.5-.07-1.04-.46-1.36-.23-.2-.58-.36-1.05-.36-.47 0-.82.16-1.05.36Z"
                  fill="currentColor"
                />
              </svg>
            </ld-icon>
          }
        />

        <div class="col-start-2 flex">
          <ld-button
            class="ml-auto"
            mode="highlight"
            onClick={onSubmit}
            progress={group.isSubmitted ? 'pending' : undefined}
            size="sm"
          >
            <span class="px-8">Add</span>
          </ld-button>
        </div>
      </form>
    </ld-card>
  )
}

export default AddTodo
