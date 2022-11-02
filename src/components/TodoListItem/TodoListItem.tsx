import './TodoListItem.css'
import type { Component } from 'solid-js'
import {
  createMemo,
  createSignal,
  For,
  type JSX,
  onCleanup,
  onMount,
} from 'solid-js'

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
  let confirmDeleteModalRef: HTMLLdModalElement
  let setCustomReminderModalRef: HTMLLdModalElement
  const [updating, setUpdating] = createSignal(false)

  const isLaterToday = createMemo(() => {
    return new Date().getHours() >= 16
  })

  const tomorrowText = createMemo(() => {
    return (
      'Tomorrow (' +
      new Intl.DateTimeFormat('en', { weekday: 'short' }).format(
        new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
      ) +
      ', 9 AM)'
    )
  })

  const nextWeekText = createMemo(() => {
    return (
      'Next week (' +
      new Intl.DateTimeFormat('en', { weekday: 'short' }).format(
        new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
      ) +
      ', 9 AM)'
    )
  })

  const customReminderValue = createMemo(() =>
    props.todo.reminders?.find((r) => r.startsWith('custom_'))
  )
  const customReminderText = createMemo(() => {
    const crValue = customReminderValue()
    if (!crValue) return
    const date = new Date(crValue.split('_')[1])
    return (
      new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(date) +
      ' (' +
      new Intl.DateTimeFormat('en', { timeStyle: 'short' }).format(date) +
      ')'
    )
  })

  const [reminderOptions, setReminderOptions] = createSignal([
    ...(isLaterToday()
      ? []
      : [
          {
            value: 'later-today',
            selected: props.todo.reminders?.includes('later-today'),
          },
        ]),
    {
      value: 'tomorrow',
      selected: props.todo.reminders?.includes('tomorrow'),
    },
    {
      value: 'next-week',
      selected: props.todo.reminders?.includes('next-week'),
    },
    ...(customReminderValue()
      ? [
          {
            value: customReminderValue(),
            selected: true,
          },
        ]
      : [
          {
            value: 'custom',
            selected: false,
          },
        ]),
  ])

  const reminderTextFrom = (optionValue: string) => {
    switch (optionValue) {
      case 'later-today':
        return 'Later today (4:00 PM)'
      case 'tomorrow':
        return tomorrowText()
      case 'next-week':
        return nextWeekText()
      case 'custom':
        return 'Custom...'
      default:
        // Parse custom reminder value
        return customReminderText()
    }
  }

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
    confirmDeleteModalRef.showModal()
  }

  return (
    <li
      class={props.class}
      classList={props.classList}
      role="listitem"
      style={props.style}
    >
      <ld-modal
        class="[&::part(footer)]:grid-cols-1"
        onLdmodalclosed={() => {
          // TODO: set focus
        }}
        ref={(el: HTMLLdModalElement) => (confirmDeleteModalRef = el)}
      >
        <ld-typo slot="header">Are you sure?</ld-typo>
        <ld-typo class="text-center">
          You won't be able to undo this action.
        </ld-typo>
        <ld-button
          slot="footer"
          style="width: 8rem"
          mode="ghost"
          onClick={() => {
            confirmDeleteModalRef.close()
          }}
        >
          Cancel
        </ld-button>
        <ld-button
          mode="danger"
          onClick={async () => {
            await deleteTodo()
            confirmDeleteModalRef.close()
          }}
          progress={updating() ? 'pending' : undefined}
          slot="footer"
          style="width: 8rem"
        >
          Delete task
        </ld-button>
      </ld-modal>
      <ld-modal
        class="[&::part(footer)]:grid-cols-1"
        onLdmodalclosed={() => {
          // TODO: set focus
        }}
        onLdmodalclosing={() => {
          setReminderOptions((s) =>
            s.map((r) => ({
              ...r,
              selected: r.value === 'custom' ? false : !!r.selected,
            }))
          )
        }}
        ref={(el: HTMLLdModalElement) => (setCustomReminderModalRef = el)}
      >
        <ld-typo slot="header">When do you want to be reminded?</ld-typo>
        <div class="grid grid-cols-2 gap-ld-12">
          <ld-input type="date" tone="dark" />
          <ld-input type="time" tone="dark" />
        </div>
        <div slot="footer" class="grid grid-cols-2 gap-ld-12 w-full">
          <ld-button
            class=""
            mode="ghost"
            onClick={() => {
              setCustomReminderModalRef.close()
            }}
          >
            Cancel
          </ld-button>
          <ld-button
            class=""
            onClick={async () => {
              // TODO: save custom reminder
              // await updateTodo()
              setCustomReminderModalRef.close()
            }}
            progress={updating() ? 'pending' : undefined}
          >
            Set reminder
          </ld-button>
        </div>
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
                  onLdchange={(ev) => {
                    const ldCheckbox = ev.target as HTMLLdCheckboxElement
                    updateTodo({ ...props.todo, done: !ldCheckbox.checked })
                  }}
                  checked={props.todo.done}
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
                  multiline
                  rows={4}
                  onBlur={(ev) => {
                    const ldInput = ev.target as HTMLLdInputElement
                    const inputValue = ldInput.value
                    if (!inputValue || inputValue === props.todo.description) {
                      ldInput.value = props.todo.description
                      return
                    }
                    updateTodo({ ...props.todo, description: inputValue })
                  }}
                  tone="dark"
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
                      inputValue !== undefined &&
                      !isNaN(Date.parse(inputValue || ''))
                    let dueAt: string | undefined
                    if (!isInputValid) {
                      ldInput.value = undefined
                    } else {
                      dueAt = new Date(inputValue).toISOString()
                    }
                    if (dueAt === props.todo.dueAt) {
                      return
                    }
                    updateTodo({
                      ...props.todo,
                      dueAt,
                    })
                  }}
                  tone="dark"
                  type="date"
                  value={props.todo.dueAt?.split('T')[0]}
                />
              </ld-label>

              <ld-label>
                Remind me
                <ld-select
                  onLdchange={(ev) => {
                    const compareBefore = JSON.stringify(
                      reminderOptions()
                        .filter((o) => o.selected)
                        .map((o) => o.value)
                        .sort()
                    )
                    setReminderOptions((s) =>
                      s.map((r) => ({
                        ...r,
                        selected: ev.detail.includes(r.value || ''),
                      }))
                    )
                    if (ev.detail.includes('custom')) {
                      setCustomReminderModalRef.showModal()
                    } else {
                      // prevent update on modal cancel
                      const needsUpdate =
                        compareBefore !== JSON.stringify(ev.detail.sort())
                      if (needsUpdate) {
                        updateTodo({
                          ...props.todo,
                          reminders: reminderOptions()
                            .filter((option) => option.selected)
                            .map((r) => r.value || ''),
                        })
                      }
                    }
                  }}
                  placeholder="No reminders"
                  multiple
                >
                  <For each={reminderOptions()}>
                    {(option) => (
                      <ld-option
                        value={option.value}
                        selected={option.selected}
                      >
                        {reminderTextFrom(option.value || '')}
                      </ld-option>
                    )}
                  </For>
                </ld-select>
              </ld-label>

              <div class="flex">
                <ld-button
                  class="mr-auto mt-ld-8"
                  mode="danger"
                  onClick={invokeDeletionConfirmationDialog}
                  size="sm"
                >
                  Delete task
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
