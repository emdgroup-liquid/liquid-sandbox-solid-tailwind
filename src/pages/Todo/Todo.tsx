import AddTodo from '../../components/AddTodo/AddTodo'
import TodoListItem from '../../components/TodoListItem/TodoListItem'
import {
  createTodo,
  deleteTodo,
  initStore,
  todos,
  updateTodo,
} from '../../services/todo'
import { getSession } from '../../services/user'
import { parsePath } from '../../utils/path'
import { useLocation, useNavigate } from '@solidjs/router'
import {
  createEffect,
  createMemo,
  createSignal,
  For,
  Match,
  onCleanup,
  onMount,
  Show,
  Switch,
  type Component,
} from 'solid-js'
import { TransitionGroup } from 'solid-transition-group'

const Todo: Component = () => {
  let mainRef: HTMLElement
  let addTodoInputRef: HTMLInputElement
  const navigate = useNavigate()

  const [loading, setLoading] = createSignal(true)
  const [loadingTodos, setLoadingTodos] = createSignal(true)

  const location = useLocation()
  const pathname = createMemo(() => parsePath(location.pathname))

  const selectedTodos = createMemo(() => {
    switch (pathname()) {
      case '/todo/due-today':
        return todos.dueToday
      case '/todo/done':
        return todos.done
      default:
        return todos.upcomming
    }
  })

  createEffect(async () => {
    if (!(await getSession())) {
      navigate('/login', { replace: true })
    } else {
      setLoading(false)
      await initStore()
      setLoadingTodos(false)
    }
  })

  const collapseSiblings = (ev: Event) => {
    if (!(ev.target as HTMLLdAccordionSectionElement).expanded) return
    mainRef.querySelectorAll('ld-accordion-section').forEach((section) => {
      if (section !== ev.target) {
        section.expanded = false
      }
    })
  }

  onMount(async () => {
    mainRef.addEventListener('ldaccordionchange', collapseSiblings, {
      passive: true,
    })
  })

  onCleanup(() => {
    mainRef.removeEventListener('ldaccordionchange', collapseSiblings)
  })

  return (
    <main
      aria-busy={loading()}
      aria-live="polite"
      class="flex flex-col max-w-[max(80vw,_80rem)] mx-auto px-ld-24 py-ld-40 relative h-screen flex-grow overflow-auto"
      ref={(el) => (mainRef = el)}
    >
      <Show when={!loading()} fallback={<ld-loading class="m-auto" />}>
        <>
          <ld-typo variant="h2" tag="h1" class="mt-6 xs:mt-1 mb-6">
            <Switch fallback={'Upcomming'}>
              <Match when={pathname() === '/todo/due-today'}>Due today</Match>
              <Match when={pathname() === '/todo/done'}>Done</Match>
            </Switch>
          </ld-typo>
          <AddTodo
            inputRef={(el: HTMLInputElement) => (addTodoInputRef = el)}
            createTodo={createTodo}
            class="w-full mb-ld-16"
          />
        </>

        <Show
          when={!loadingTodos()}
          fallback={<ld-loading class="mx-auto mt-ld-32" />}
        >
          <Show
            when={selectedTodos().length}
            fallback={
              <ld-typo class="mx-auto mt-ld-32">
                <Switch fallback={'Seems like there is nothing to be done.'}>
                  <Match when={pathname() === '/todo/due-today'}>
                    Seems like nothing is due today.
                  </Match>
                  <Match when={pathname() === '/todo/done'}>
                    Seems like nothing is done yet.
                  </Match>
                </Switch>
                <ld-icon name="plant" class="transform translate-y-ld-4" />
              </ld-typo>
            }
          >
            <ul class="relative">
              <TransitionGroup name="todo-list-item">
                <For each={selectedTodos()}>
                  {(todo) => (
                    <TodoListItem
                      class="w-full mb-ld-12 todo-list-item"
                      deleteTodo={deleteTodo}
                      onDelete={() => addTodoInputRef.focus()}
                      updateTodo={updateTodo}
                      todo={todo}
                    />
                  )}
                </For>
              </TransitionGroup>
            </ul>
          </Show>
        </Show>
      </Show>
    </main>
  )
}

export default Todo
