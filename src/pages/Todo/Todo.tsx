import AddTodo from '../../components/AddTodo/AddTodo'
import Sidenav from '../../components/Sidenav/Sidenav'
import TodoListItem from '../../components/TodoListItem/TodoListItem'
import {
  createTodo,
  deleteTodo,
  initStore,
  todos,
  updateTodo,
} from '../../services/todo'
import { getSession } from '../../services/user'
import { useNavigate } from '@solidjs/router'
import type { Component } from 'solid-js'
import {
  createEffect,
  createSignal,
  For,
  onCleanup,
  onMount,
  Show,
} from 'solid-js'
import { TransitionGroup } from 'solid-transition-group'

const Todo: Component = () => {
  let mainRef: HTMLElement
  const navigate = useNavigate()

  const [loading, setLoading] = createSignal(true)
  const [loadingTodos, setLoadingTodos] = createSignal(true)

  createEffect(async () => {
    if (!(await getSession())) {
      navigate('/login', { replace: true })
    } else {
      await initStore()
      setLoadingTodos(false)
    }
  })

  createEffect(async () => {
    dispatchEvent(new CustomEvent('ldNotificationClear'))
    const session = await getSession()
    if (!session) {
      navigate('/login', { replace: true })
    }
    setLoading(false)
  })

  const onAccordionChange = (ev: Event) => {
    // TODO: collapse siblings.
    console.info('onAccordionChange', ev)
  }

  onMount(async () => {
    mainRef.addEventListener('ldaccordionchange', onAccordionChange, {
      passive: true,
    })
  })

  onCleanup(() => {
    mainRef.removeEventListener('ldaccordionchange', onAccordionChange)
  })

  return (
    <div class="w-full min-h-screen relative flex bg-neutral-010">
      <Sidenav todos={todos} />
      <main
        aria-busy={loading()}
        aria-live="polite"
        class="flex flex-col px-ld-24 py-ld-40 relative h-screen flex-grow overflow-auto"
        ref={(el) => (mainRef = el)}
      >
        <Show when={!loading()} fallback={<ld-loading class="m-auto" />}>
          <>
            <ld-typo variant="h2" tag="h1" class="mt-6 xs:mt-1 mb-6">
              Upcomming
            </ld-typo>
            <AddTodo createTodo={createTodo} class="w-full mb-ld-16" />
          </>

          <Show
            when={!loadingTodos()}
            fallback={<ld-loading class="mx-auto mt-ld-32" />}
          >
            <Show
              when={todos.all.length}
              fallback={
                <ld-typo class="mx-auto mt-ld-32">
                  Seems like there's nothing to do here.{' '}
                  <ld-icon name="plant" class="transform translate-y-ld-4" />
                </ld-typo>
              }
            >
              <ul class="relative">
                <TransitionGroup name="todo-list-item">
                  <For each={todos.all}>
                    {(todo) => (
                      <TodoListItem
                        class="w-full mb-ld-12 todo-list-item"
                        deleteTodo={deleteTodo}
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
    </div>
  )
}

export default Todo
