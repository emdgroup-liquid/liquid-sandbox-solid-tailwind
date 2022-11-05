import { loadComponents } from '../../liquidLoader'
import TextInput from '../TextInput/TextInput'
import './TodoListItem.css'
import { useNavigate } from '@solidjs/router'
import { createFormControl, createFormGroup } from 'solid-forms'
import type { Component } from 'solid-js'
import {
  createMemo,
  createSignal,
  For,
  type JSX,
  onCleanup,
  onMount,
  Show,
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
  const [componentsLoaded, setComponentsLoaded] = createSignal(false)
  loadComponents([
    'ld-accordion',
    'ld-accordion-panel',
    'ld-accordion-section',
    'ld-accordion-toggle',
    'ld-button',
    'ld-card',
    'ld-checkbox',
    'ld-input',
    'ld-label',
    'ld-modal',
    'ld-option',
    'ld-option-internal',
    'ld-select',
    'ld-typo',
  ]).then(() => {
    setComponentsLoaded(true)
  })

  let checkLabelRef: HTMLLabelElement
  let checkRef: HTMLLdCheckboxElement
  let confirmDeleteModalRef: HTMLLdModalElement
  let customReminderFormRef: HTMLFormElement
  let customReminderModalRef: HTMLLdModalElement
  const [deleting, setDeleting] = createSignal(false)

  const navigate = useNavigate()

  const customReminderGroup = createFormGroup({
    dateTime: createFormControl('', {
      required: true,
      validators: (value: string) => {
        if (value.length === 0) return { missing: true }
        const stamp = Date.parse(value)
        if (isNaN(stamp)) return { invalid: true }
        if (new Date().getTime() - stamp > 0) return { inPast: true }
        return null
      },
    }),
  })

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

  const updateTodo = async (todo: Omit<Todo, 'createdAt'>) => {
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
  }

  const onCheckClick = (ev: MouseEvent) => {
    ev.stopPropagation()
    if ((ev.target as HTMLElement).tagName === 'LABEL') {
      checkRef.checked = !checkRef.checked
    }
  }

  const onSubmitCustomReminder = async (ev: Event) => {
    ev.preventDefault()
    if (customReminderGroup.isSubmitted) return

    customReminderGroup.controls.dateTime.markTouched(true)
    if (!customReminderGroup.isValid) {
      setTimeout(() => {
        customReminderFormRef
          .querySelector<HTMLInputElement>('.ld-input--invalid input')
          ?.focus()
      }, 100)
      return
    }

    dispatchEvent(new CustomEvent('ldNotificationClear'))

    customReminderGroup.markSubmitted(true)
    const { dateTime } = customReminderGroup.value

    await updateTodo({
      ...props.todo,
      reminders: reminderOptions()
        .filter((r) => r.selected)
        .map((r) => {
          if (r.value === 'custom') {
            r.value = 'custom_' + new Date(dateTime || '').toISOString()
          }
          return r.value || ''
        }),
    })

    customReminderGroup.markSubmitted(false)
    customReminderModalRef.close()
  }

  const invokeDeletionConfirmationDialog = () => {
    if (deleting()) return

    dispatchEvent(new CustomEvent('ldNotificationClear'))
    confirmDeleteModalRef.showModal()
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

  return (
    <li
      class={props.class}
      classList={props.classList}
      role="listitem"
      style={{
        ...props.style,
        visibility: componentsLoaded() ? 'inherit' : 'hidden',
      }}
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
        <div slot="footer" class="grid grid-cols-2 gap-ld-12 w-full">
          <ld-button
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
            progress={deleting() ? 'pending' : undefined}
          >
            Delete task
          </ld-button>
        </div>
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
        ref={(el: HTMLLdModalElement) => (customReminderModalRef = el)}
      >
        <ld-typo slot="header">When do you want to be reminded?</ld-typo>
        <form
          aria-label="Set reminder date and time"
          ref={(el) => (customReminderFormRef = el)}
          onSubmit={onSubmitCustomReminder}
        >
          <TextInput
            autofocus
            class="w-full"
            control={customReminderGroup.controls.dateTime}
            label="Date and time"
            min={new Date().toISOString()}
            name="reminder"
            tone="dark"
            type="datetime-local"
          />
        </form>
        <div slot="footer" class="grid grid-cols-2 gap-ld-12 w-full">
          <ld-button
            class=""
            mode="ghost"
            onClick={() => {
              customReminderModalRef.close()
            }}
          >
            Cancel
          </ld-button>
          <ld-button
            class=""
            onClick={async (ev) => {
              await onSubmitCustomReminder(ev)
            }}
            progress={customReminderGroup.isSubmitted ? 'pending' : undefined}
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
                  class="[&::part(input)]:resize-y"
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
                <span>
                  Remind me{' '}
                  <ld-tooltip
                    arrow
                    position="right bottom"
                    trigger-type="click"
                  >
                    <ld-typo>
                      We will send you a notification Email to your account
                      Email address. You can change your notification settings{' '}
                      <ld-link
                        onClick={() => navigate('/notification-settings')}
                      >
                        here
                      </ld-link>
                      .
                    </ld-typo>
                  </ld-tooltip>
                </span>
                <ld-select
                  onLdchange={(ev) => {
                    const compareBefore = JSON.stringify(
                      reminderOptions()
                        .filter((o) => o.selected)
                        .map((o) => o.value)
                        .sort()
                    )
                    setReminderOptions((s) =>
                      s.map((r) => {
                        const selected = ev.detail.includes(r.value || '')
                        return {
                          ...r,
                          value:
                            r.value?.startsWith('custom_') && !selected
                              ? 'custom'
                              : r.value,
                          selected: ev.detail.includes(r.value || ''),
                        }
                      })
                    )
                    if (ev.detail.includes('custom')) {
                      customReminderModalRef.showModal()
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
