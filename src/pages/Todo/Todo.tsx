import AddTodo from '../../components/AddTodo/AddTodo'
import Sidenav from '../../components/Sidenav/Sidenav'
import TodoListItem from '../../components/TodoListItem/TodoListItem'
import { createTodo, deleteTodo, initStore, todos } from '../../services/todo'
import { getSession } from '../../services/user'
import { useNavigate } from '@solidjs/router'
import type { Component } from 'solid-js'
import { createEffect, createSignal, For, Show } from 'solid-js'
import { TransitionGroup } from 'solid-transition-group'

const Todo: Component = () => {
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

  return (
    <div class="w-full min-h-screen relative flex bg-neutral-010">
      <Sidenav todos={todos} />
      <main
        aria-busy={loading()}
        aria-live="polite"
        class="flex flex-col px-ld-24 py-ld-40 relative min-h-screen flex-grow"
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
              when={todos.length}
              fallback={
                <ld-typo class="mx-auto mt-ld-32">
                  Seems like there's nothing to do here.{' '}
                  <ld-icon name="plant" class="transform translate-y-ld-4" />
                </ld-typo>
              }
            >
              <ul class="relative">
                <TransitionGroup name="todo-list-item">
                  <For each={todos}>
                    {(todo) => (
                      <TodoListItem
                        class="w-full mb-ld-12 todo-list-item"
                        deleteTodo={deleteTodo}
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
