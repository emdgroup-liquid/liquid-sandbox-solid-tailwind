import './TodoListItem.css'
import type { Component } from 'solid-js'
import { createSignal, JSX } from 'solid-js'

interface AddTodoProps {
  class?: string
  classList?: { [k: string]: boolean | undefined }
  style?: JSX.CSSProperties
  todo: Todo
  deleteTodo: (todoId: string) => Promise<void>
}

const TodoListItem: Component<AddTodoProps> = (props) => {
  const [deleting, setDeleting] = createSignal(false)

  const onDelete = async (ev: Event) => {
    ev.preventDefault()
    if (deleting()) return

    dispatchEvent(new CustomEvent('ldNotificationClear'))

    setDeleting(true)
    try {
      await props.deleteTodo(props.todo.id)
      dispatchEvent(
        new CustomEvent('ldNotificationAdd', {
          detail: {
            content: 'Task has been deleted.',
            type: 'info',
          },
        })
      )
    } catch (err) {
      dispatchEvent(
        new CustomEvent('ldNotificationAdd', {
          detail: {
            content: (err as Error)?.message || 'Failed deleting task.',
            type: 'alert',
          },
        })
      )
    }
    setDeleting(false)
  }

  return (
    <ld-card
      class={props.class}
      classList={props.classList}
      role="listitem"
      size="sm"
      style={props.style}
    >
      <div class="grid w-full grid-cols-2 gap-ld-12">
        <ld-typo>{props.todo.description}</ld-typo>

        <div class="col-start-2 flex">
          <ld-button
            class="ml-auto"
            mode="danger-secondary"
            onClick={onDelete}
            progress={deleting() ? 'pending' : undefined}
            size="sm"
          >
            <ld-icon name="bin" size="sm" aria-label="Delete task"></ld-icon>
          </ld-button>
        </div>
      </div>
    </ld-card>
  )
}

export default TodoListItem
