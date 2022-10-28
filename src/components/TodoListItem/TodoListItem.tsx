import './TodoListItem.css'
import type { Component } from 'solid-js'
import { createSignal, JSX, onCleanup, onMount } from 'solid-js'

interface AddTodoProps {
  class?: string
  classList?: { [k: string]: boolean | undefined }
  style?: JSX.CSSProperties
  todo: Todo
  deleteTodo: (todoId: string) => Promise<void>
  updateTodo: (todo: Omit<Todo, 'createdAt'>) => Promise<void>
}

const TodoListItem: Component<AddTodoProps> = (props) => {
  let checkLabelRef: HTMLLabelElement
  let checkRef: HTMLLdCheckboxElement
  let modalRef: HTMLLdModalElement
  const [updating, setUpdating] = createSignal(false)

  const deleteTodo = async () => {
    if (updating()) return

    dispatchEvent(new CustomEvent('ldNotificationClear'))

    setUpdating(true)
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
    setUpdating(false)
  }

  const updateTodo = async (todo: Omit<Todo, 'createdAt'>) => {
    if (updating()) return

    dispatchEvent(new CustomEvent('ldNotificationClear'))

    setUpdating(true)
    try {
      await props.updateTodo({
        ...todo,
        id: props.todo.id,
      })
      dispatchEvent(
        new CustomEvent('ldNotificationAdd', {
          detail: {
            content: 'Task has been updated.',
            type: 'info',
          },
        })
      )
    } catch (err) {
      dispatchEvent(
        new CustomEvent('ldNotificationAdd', {
          detail: {
            content: (err as Error)?.message || 'Failed updating task.',
            type: 'alert',
          },
        })
      )
    }
    setUpdating(false)
  }

  const onCheckClick = (ev: MouseEvent) => {
    ev.stopPropagation()
    if ((ev.target as HTMLElement).tagName === 'LABEL') {
      checkRef.checked = !checkRef.checked
    }
  }

  onMount(() => {
    checkLabelRef.addEventListener('click', onCheckClick, {
      capture: true,
    })
  })

  onCleanup(() => {
    checkLabelRef.removeEventListener('click', onCheckClick, {
      capture: true,
    })
  })

  const invokeDeletionConfirmationDialog = () => {
    if (updating()) return

    dispatchEvent(new CustomEvent('ldNotificationClear'))
    modalRef.showModal()
  }

  return (
    <li
      class={props.class}
      classList={props.classList}
      role="listitem"
      style={props.style}
    >
      <ld-modal ref={(el: HTMLLdModalElement) => (modalRef = el)}>
        <ld-typo slot="header">Are you sure?</ld-typo>
        <ld-typo style="text-align: center">
          You won't be able to undo this action.
        </ld-typo>
        <ld-button
          slot="footer"
          style="width: 8rem"
          mode="ghost"
          onClick={() => {
            modalRef.close()
          }}
        >
          Cancel
        </ld-button>
        <ld-button
          mode="danger"
          onClick={async () => {
            await deleteTodo()
            modalRef.close()
          }}
          progress={updating() ? 'pending' : undefined}
          slot="footer"
          style="width: 8rem"
        >
          Delete task
        </ld-button>
      </ld-modal>
      <ld-accordion rounded class="shadow-stacked rounded-l overflow-hidden">
        <ld-accordion-section>
          <ld-accordion-toggle>
            <div class="flex items-center">
              <label
                ref={(el) => (checkLabelRef = el)}
                class="cursor-pointer p-ld-12 mr-ld-2 -ml-ld-12 -my-ld-4 flex"
              >
                <ld-sr-only class="absolute">Done</ld-sr-only>
                <ld-checkbox
                  ref={(el: HTMLLdCheckboxElement) => (checkRef = el)}
                />
              </label>
              <ld-typo>{props.todo.description}</ld-typo>
            </div>
          </ld-accordion-toggle>
          <ld-accordion-panel>
            <div class="p-ld-16 grid gap-ld-16">
              <ld-label>
                Description
                <ld-input
                  onBlur={(ev) => {
                    const ldInput = ev.target as HTMLLdInputElement
                    const inputValue = ldInput.value
                    if (!inputValue || inputValue === props.todo.description) {
                      ldInput.value = props.todo.description
                      return
                    }
                    updateTodo({ ...props.todo, description: inputValue })
                  }}
                  value={props.todo.description}
                ></ld-input>
              </ld-label>
              <ld-label>
                Due date
                <ld-input
                  onBlur={(ev) => {
                    const ldInput = ev.target as HTMLLdInputElement
                    const inputValue = ldInput.value
                    const isInputValid =
                      typeof inputValue !== 'string' ||
                      !isNaN(Date.parse(inputValue))
                    let dueAt: string | undefined
                    if (!isInputValid) {
                      ldInput.value = undefined
                    } else {
                      dueAt = new Date(inputValue as string).toISOString()
                    }
                    if (dueAt === props.todo.dueAt) {
                      return
                    }
                    updateTodo({
                      ...props.todo,
                      dueAt,
                    })
                  }}
                  type="date"
                  value={props.todo.dueAt?.split('T')[0]}
                ></ld-input>
              </ld-label>
              <div class="flex">
                <ld-button
                  class="ml-auto"
                  mode="danger-secondary"
                  onClick={invokeDeletionConfirmationDialog}
                  size="sm"
                >
                  <ld-icon
                    name="bin"
                    size="sm"
                    aria-label="Delete task"
                  ></ld-icon>
                </ld-button>
              </div>
            </div>
          </ld-accordion-panel>
        </ld-accordion-section>
      </ld-accordion>
    </li>
  )
}

export default TodoListItem
