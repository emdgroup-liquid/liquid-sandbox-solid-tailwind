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
  let modalRef: HTMLLdModalElement
  const [deleting, setDeleting] = createSignal(false)

  const deleteTodo = async () => {
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

  const invokeDeletionConfirmationDialog = () => {
    if (deleting()) return

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
          progress={deleting() ? 'pending' : undefined}
          slot="footer"
          style="width: 8rem"
        >
          Delete task
        </ld-button>
      </ld-modal>
      <ld-accordion rounded class="shadow-stacked rounded-l overflow-hidden">
        <ld-accordion-section>
          <ld-accordion-toggle>
            <ld-typo>{props.todo.description}</ld-typo>
          </ld-accordion-toggle>
          <ld-accordion-panel>
            <div class="p-ld-16">
              <div class="col-start-2 flex">
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
